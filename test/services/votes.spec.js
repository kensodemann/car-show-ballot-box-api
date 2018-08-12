'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const sinon = require('sinon');
const Service = require('../../src/services/votes');

describe('service: votes', () => {
  let pool;
  let service;
  let testData;

  beforeEach(() => {
    pool = new MockPool();
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
    service = new Service(pool);
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.getAll();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the votes', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.getAll();
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(pool.test_client.query.calledWith('select * from votes')).to.be
        .true;
    });

    it('limits by year if given', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.getAll(2019);
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(pool.test_client.query.calledWith('select * from votes where year = $1', [2019])).to.be.true;
    });

    it('returns the data', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: testData }));
      const data = await service.getAll();
      expect(data).to.deep.equal(testData);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.getAll();
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  // describe('get', () => {
  //   it('connects to the pool', () => {
  //     sinon.spy(pool, 'connect');
  //     service.get(42);
  //     expect(pool.connect.calledOnce).to.be.true;
  //   });

  //   it('releases the client', async () => {
  //     sinon.spy(pool.test_client, 'release');
  //     await service.get(42);
  //     expect(pool.test_client.release.calledOnce).to.be.true;
  //   });

  //   it('queries the teas for the tea with the given ID', async () => {
  //     sinon.spy(pool.test_client, 'query');
  //     await service.get(42);
  //     expect(pool.test_client.query.calledOnce).to.be.true;
  //     const args = pool.test_client.query.args[0];
  //     expect(/select .* from teas .* where teas\.id = \$1/.test(args[0])).to.be
  //       .true;
  //     expect(args[1]).to.deep.equal([42]);
  //   });

  //   it('resolves the data', async () => {
  //     sinon.stub(pool.test_client, 'query');
  //     pool.test_client.query.returns(
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
  //     sinon.spy(pool, 'connect');
  //     service.save({});
  //     expect(pool.connect.calledOnce).to.be.true;
  //   });

  //   describe('with an ID', () => {
  //     it('updates the given tea', async () => {
  //       sinon.spy(pool.test_client, 'query');
  //       await service.save({
  //         id: 42,
  //         name: 'Monkey Picked Oolong',
  //         teaCategoryId: 2,
  //         teaCategoryName: 'Oolong',
  //         description: 'Good quality basic oolong tea'
  //       });
  //       expect(pool.test_client.query.calledTwice).to.be.true;
  //       let args = pool.test_client.query.args[0];
  //       expect(/update teas .*/.test(args[0])).to.be.true;

  //       args = pool.test_client.query.args[1];
  //       expect(/select .* from teas .* where teas\.id = \$1/.test(args[0])).to
  //         .be.true;
  //       expect(args[1]).to.deep.equal([42]);
  //     });

  //     it('returns the updated tea', async () => {
  //       sinon.stub(pool.test_client, 'query');
  //       pool.test_client.query.returns(
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
  //       sinon.stub(pool.test_client, 'query');
  //       pool.test_client.query.onCall(0).returns(
  //         Promise.resolve({
  //           rows: [{ id: 1138 }]
  //         })
  //       );
  //       pool.test_client.query.onCall(1).returns(
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
  //       expect(pool.test_client.query.calledTwice).to.be.true;
  //       let args = pool.test_client.query.args[0];
  //       expect(/insert into teas .* returning id/.test(args[0])).to.be.true;

  //       args = pool.test_client.query.args[1];
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
  //     sinon.spy(pool.test_client, 'release');
  //     await service.save({});
  //     expect(pool.test_client.release.calledOnce).to.be.true;
  //   });
  // });

  // describe('delete', () => {
  //   it('connects to the pool', () => {
  //     sinon.spy(pool, 'connect');
  //     service.delete(42);
  //     expect(pool.connect.calledOnce).to.be.true;
  //   });

  //   it('deletes the tea with the given ID', async () => {
  //     sinon.spy(pool.test_client, 'query');
  //     await service.delete(42);
  //     expect(pool.test_client.query.calledTwice).to.be.true;

  //     let args = pool.test_client.query.args[0];
  //     expect(/delete from tea_purchase_links where tea_rid = \$1/.test(args[0]))
  //       .to.be.true;
  //     expect(args[1]).to.deep.equal([42]);

  //     args = pool.test_client.query.args[1];
  //     expect(/delete from teas where id = \$1/.test(args[0])).to.be.true;
  //     expect(args[1]).to.deep.equal([42]);
  //   });

  //   it('releases the client', async () => {
  //     sinon.spy(pool.test_client, 'release');
  //     await service.delete(42);
  //     expect(pool.test_client.release.calledOnce).to.be.true;
  //   });
  // });
});
