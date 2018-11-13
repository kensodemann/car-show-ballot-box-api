'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const MockClient = require('../util/mock-client');
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

  describe.skip('save', () => {
    it('connects to the database', async () => {
      await service.save({
        firstName: 'Tess',
        lastName: 'McTesterson'
      });
      expect(database.connect.calledOnce).to.be.true;
    });

    describe('a user with an ID', () => {
      it('updates the existing user', async () => {
        sinon.spy(client, 'query');
        await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(client.query.calledOnce).to.be.true;
        const sql = client.query.args[0][0];
        expect(
          /^update users.*where id = \$1 returning id, first_name as "firstName",/.test(
            sql
          )
        ).to.be.true;
      });

      it('does not touch the password', async () => {
        sinon.spy(password, 'change');
        sinon.spy(password, 'initialize');
        await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(password.change.called).to.be.false;
        password.change.restore();
        password.initialize.restore();
      });

      it('resolves the updated user', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 4273,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        const user = await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.deep.equal({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
      });

      it('resolves empty if there was no user to update', async () => {
        sinon.stub(client, 'query');
        client.query.resolves({ rows: [] });
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
      beforeEach(() => {
        sinon.stub(password, 'initialize');
      });

      afterEach(() => {
        password.initialize.restore();
      });

      it('creates a new user', async () => {
        sinon.spy(client, 'query');
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(client.query.calledOnce).to.be.true;
        const sql = client.query.args[0][0];
        expect(
          /^insert into users.*returning id, first_name as "firstName",/.test(
            sql
          )
        ).to.be.true;
      });

      it('creates an initial password', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 1138,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly',
          password: 'I am a freak'
        });
        expect(password.initialize.calledOnce).to.be.true;
        expect(password.initialize.calledWith(1138, 'I am a freak')).to.be.true;
      });

      it('defaults to password if no password is given', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 1138,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(password.initialize.calledWith(1138, 'password')).to.be.true;
      });

      it('resolves the inserted user', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 4273,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        const user = await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.deep.equal({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
      });
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await service.save({
        firstName: 'Tess',
        lastName: 'McTesterson'
      });
      expect(client.release.calledOnce).to.be.true;
    });
  });
});
