'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const MockClient = require('../mocks/mock-client');
const sinon = require('sinon');
const service = require('../../src/services/votes');

describe('service: votes', () => {
  let client;
  let testData;

  beforeEach(() => {
    client = new MockClient();
    sinon.stub(database, 'connect');
    database.connect.resolves(client);
    testData = [
      {
        id: 1,
        year: 2018,
        car_class_rid: 3,
        car_number: 42
      },
      {
        id: 2,
        year: 2018,
        car_class_rid: 2,
        car_number: 314
      },
      {
        id: 3,
        year: 2018,
        car_class_rid: 3,
        car_number: 73
      }
    ];
  });

  afterEach(() => {
    database.connect.restore();
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      service.getAll();
      expect(database.connect.calledOnce).to.be.true;
    });

    it('queries the votes', async () => {
      sinon.spy(client, 'query');
      await service.getAll();
      expect(client.query.calledOnce).to.be.true;
      expect(client.query.calledWith('select * from votes')).to.be.true;
    });

    it('limits by year if given', async () => {
      sinon.spy(client, 'query');
      await service.getAll(2019);
      expect(client.query.calledOnce).to.be.true;
      expect(
        client.query.calledWith('select * from votes where year = $1', [2019])
      ).to.be.true;
    });

    it('returns the data', async () => {
      sinon.stub(client, 'query');
      client.query.resolves({ rows: testData });
      const data = await service.getAll();
      expect(data).to.deep.equal(testData);
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await service.getAll();
      expect(client.release.calledOnce).to.be.true;
    });
  });

  // describe('get', () => {
  //   it('connects to the pool', () => {
  //     service.get(42);
  //     expect(pool.connect.calledOnce).to.be.true;
  //   });

  //   it('releases the client', async () => {
  //     sinon.spy(client, 'release');
  //     await service.get(42);
  //     expect(client.release.calledOnce).to.be.true;
  //   });

  //   it('queries the teas for the tea with the given ID', async () => {
  //     sinon.spy(client, 'query');
  //     await service.get(42);
  //     expect(client.query.calledOnce).to.be.true;
  //     const args = client.query.args[0];
  //     expect(/select .* from teas .* where teas\.id = \$1/.test(args[0])).to.be
  //       .true;
  //     expect(args[1]).to.deep.equal([42]);
  //   });

  //   it('resolves the data', async () => {
  //     sinon.stub(client, 'query');
  //     client.query.returns(
  //       Promise.resolve({
  //         rows: [
  //           {
  //             id: 42,
  //             name: 'Monkey Picked Oolong',
  //             teaCategoryId: 2,
  //             teaCategoryName: 'Oolong',
  //             description: 'Good quality basic oolong tea'
  //           }
  //         ]
  //       })
  //     );
  //     const data = await service.get(42);
  //     expect(data).to.deep.equal({
  //       id: 42,
  //       name: 'Monkey Picked Oolong',
  //       teaCategoryId: 2,
  //       teaCategoryName: 'Oolong',
  //       description: 'Good quality basic oolong tea'
  //     });
  //   });
  // });

  // describe('save', () => {
  //   it('connects to the pool', () => {
  //     service.save({});
  //     expect(pool.connect.calledOnce).to.be.true;
  //   });

  //   describe('with an ID', () => {
  //     it('updates the given tea', async () => {
  //       sinon.spy(client, 'query');
  //       await service.save({
  //         id: 42,
  //         name: 'Monkey Picked Oolong',
  //         teaCategoryId: 2,
  //         teaCategoryName: 'Oolong',
  //         description: 'Good quality basic oolong tea'
  //       });
  //       expect(client.query.calledTwice).to.be.true;
  //       let args = client.query.args[0];
  //       expect(/update teas .*/.test(args[0])).to.be.true;

  //       args = client.query.args[1];
  //       expect(/select .* from teas .* where teas\.id = \$1/.test(args[0])).to
  //         .be.true;
  //       expect(args[1]).to.deep.equal([42]);
  //     });

  //     it('returns the updated tea', async () => {
  //       sinon.stub(client, 'query');
  //       client.query.returns(
  //         Promise.resolve({
  //           rows: [
  //             {
  //               id: 42,
  //               name: 'Monkey Picked Oolong',
  //               teaCategoryId: 2,
  //               teaCategoryName: 'Oolong',
  //               description: 'Good quality basic oolong tea'
  //             }
  //           ]
  //         })
  //       );
  //       const data = await service.save({
  //         id: 42,
  //         name: 'Monkey Picked Oolong',
  //         teaCategoryId: 2,
  //         teaCategoryName: 'Oolong',
  //         description: 'Good quality basic oolong tea'
  //       });
  //       expect(data).to.deep.equal({
  //         id: 42,
  //         name: 'Monkey Picked Oolong',
  //         teaCategoryId: 2,
  //         teaCategoryName: 'Oolong',
  //         description: 'Good quality basic oolong tea'
  //       });
  //     });
  //   });

  //   describe('without an ID', () => {
  //     beforeEach(() => {
  //       sinon.stub(client, 'query');
  //       client.query.onCall(0).returns(
  //         Promise.resolve({
  //           rows: [{ id: 1138 }]
  //         })
  //       );
  //       client.query.onCall(1).returns(
  //         Promise.resolve({
  //           rows: [
  //             {
  //               id: 1138,
  //               name: 'Monkey Picked Oolong',
  //               teaCategoryId: 2,
  //               teaCategoryName: 'Oolong',
  //               description: 'Good quality basic oolong tea'
  //             }
  //           ]
  //         })
  //       );
  //     });

  //     it('inserts the given tea', async () => {
  //       await service.save({
  //         name: 'Monkey Picked Oolong',
  //         teaCategoryId: 2,
  //         teaCategoryName: 'Oolong',
  //         description: 'Good quality basic oolong tea'
  //       });
  //       expect(client.query.calledTwice).to.be.true;
  //       let args = client.query.args[0];
  //       expect(/insert into teas .* returning id/.test(args[0])).to.be.true;

  //       args = client.query.args[1];
  //       expect(/select .* from teas .* where teas\.id = \$1/.test(args[0])).to
  //         .be.true;
  //       expect(args[1]).to.deep.equal([1138]);
  //     });

  //     it('returns the inserted tea', async () => {
  //       const data = await service.save({
  //         name: 'Monkey Picked Oolong',
  //         teaCategoryId: 2,
  //         teaCategoryName: 'Oolong',
  //         description: 'Good quality basic oolong tea'
  //       });
  //       expect(data).to.deep.equal({
  //         id: 1138,
  //         name: 'Monkey Picked Oolong',
  //         teaCategoryId: 2,
  //         teaCategoryName: 'Oolong',
  //         description: 'Good quality basic oolong tea'
  //       });
  //     });
  //   });

  //   it('releases the client', async () => {
  //     sinon.spy(client, 'release');
  //     await service.save({});
  //     expect(client.release.calledOnce).to.be.true;
  //   });
  // });

  // describe('delete', () => {
  //   it('connects to the pool', () => {
  //     service.delete(42);
  //     expect(pool.connect.calledOnce).to.be.true;
  //   });

  //   it('deletes the tea with the given ID', async () => {
  //     sinon.spy(client, 'query');
  //     await service.delete(42);
  //     expect(client.query.calledTwice).to.be.true;

  //     let args = client.query.args[0];
  //     expect(/delete from tea_purchase_links where tea_rid = \$1/.test(args[0]))
  //       .to.be.true;
  //     expect(args[1]).to.deep.equal([42]);

  //     args = client.query.args[1];
  //     expect(/delete from teas where id = \$1/.test(args[0])).to.be.true;
  //     expect(args[1]).to.deep.equal([42]);
  //   });

  //   it('releases the client', async () => {
  //     sinon.spy(client, 'release');
  //     await service.delete(42);
  //     expect(client.release.calledOnce).to.be.true;
  //   });
  // });
});
