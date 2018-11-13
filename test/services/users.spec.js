'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const sinon = require('sinon');
const testDatabase = require('../util/test-database');

const password = require('../../src/services/password');
const service = require('../../src/services/users');

describe('service: users', () => {
  before(async () => {
    await testDatabase.reload();
  });

  afterEach(() => {
    expect(database.idleCount).to.equal(database.totalCount);
  });

  describe('getAll', () => {
    it('resolves the data', async () => {
      const data = await service.getAll();
      expect(data).to.deep.equal([
        {
          id: 1,
          firstName: 'Kenneth',
          lastName: 'Sodemann',
          email: 'not.my.real.email@gmail.com'
        },
        {
          id: 2,
          firstName: 'Lisa',
          lastName: 'Buerger',
          email: 'another.fake.email@aol.com'
        },
        {
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'douglas@adams.net'
        },
        {
          id: 1138,
          firstName: 'George',
          lastName: 'Lucas',
          email: 'luke@sykwalker.com'
        }
      ]);
    });
  });

  describe('get', () => {
    // NOTE: For now, all users get the roles of 'admin' and 'user' by default
    it('queries the users for the user with the given ID', async () => {
      const data = await service.get(2);
      expect(data).to.deep.equal({
        id: 2,
        firstName: 'Lisa',
        lastName: 'Buerger',
        email: 'another.fake.email@aol.com',
        roles: ['admin', 'user']
      });
    });

    it('queries the users for the user with the given ID string', async () => {
      const data = await service.get('42');
      expect(data).to.deep.equal({
        id: 42,
        firstName: 'Douglas',
        lastName: 'Adams',
        email: 'douglas@adams.net',
        roles: ['admin', 'user']
      });
    });

    it('queries the users by email if the passed id has an "@" sign', async () => {
      const data = await service.get('douglas@adams.net');
      expect(data).to.deep.equal({
        id: 42,
        firstName: 'Douglas',
        lastName: 'Adams',
        email: 'douglas@adams.net',
        roles: ['admin', 'user']
      });
    });

    it('resolves undefined if not found', async () => {
      const data = await service.get(73);
      expect(data).to.be.undefined;
    });
  });

  describe('save', () => {
    beforeEach(() => {
      sinon.stub(password, 'change');
      sinon.stub(password, 'initialize');
    });

    afterEach(async () => {
      password.change.restore();
      password.initialize.restore();
      await testDatabase.reload();
    });

    describe('a user with an ID', () => {
      it('updates the existing user', async () => {
        await service.save({
          id: 42,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        const res = await database.query('select * from users where id = 42');
        expect(res.rows[0]).to.deep.equal({
          id: 42,
          first_name: 'Tess',
          last_name: 'McTesterson',
          email: 'tess@test.ly'
        });
      });

      it('does not touch the password', async () => {
        await service.save({
          id: 42,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(password.change.called).to.be.false;
        expect(password.initialize.called).to.be.false;
      });

      it('resolves the updated user', async () => {
        const user = await service.save({
          id: 42,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.deep.equal({
          id: 42,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly',
          roles: ['admin', 'user']
        });
      });

      it('resolves empty if there was no user to update', async () => {
        const user = await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.be.undefined;
      });
    });

    describe('a user without an ID', () => {
      it('creates a new user', async () => {
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        const res = await database.query('select * from users');
        expect(res.rows.length).to.equal(5);
        expect(res.rows.find(u => u.id === 5)).to.deep.equal({
          id: 5,
          first_name: 'Tess',
          last_name: 'McTesterson',
          email: 'tess@test.ly'
        });
      });

      it('creates an initial password', async () => {
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly',
          password: 'I am a freak'
        });
        expect(password.initialize.calledOnce).to.be.true;
        expect(password.initialize.calledWith(5, 'I am a freak')).to.be.true;
      });

      it('defaults to password if no password is given', async () => {
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(password.initialize.calledWith(5, 'password')).to.be.true;
      });

      it('resolves the inserted user', async () => {
        const user = await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.deep.equal({
          id: 5,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly',
          roles: ['admin', 'user']
        });
      });
    });
  });
});
