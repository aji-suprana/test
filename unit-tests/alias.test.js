jest.setTimeout(30000);

const supertest = require('supertest');
const app = require('../app');
const qs = require('querystring');

const clearDatabase = require('./helpers/clearDB');
const token = require('./helpers/token');

const defaultData = require('./constants/defaultData').alias;
const { brand_id } = require('./constants/defaultData');

const request = supertest(app);

/**
 * global hapus table
 */
beforeAll(async function (done) {
  await clearDatabase();
  done();
});

let alias_id;

/**
 * Run: POST /alias
 */
describe('POST /alias', function () {
  /**
   * Run: bikin alias barang dan success
   */
  it('bikin alias barang dan success', async function (done) {
    const response = await request
      .post('/alias')
      .send(defaultData)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );

    alias_id = response.body.data.id;

    done();
  });
});

/**
 * Run: GET /alias success
 */
describe('GET /alias success', function () {
  /**
   * Run: ambil semua alias barang
   */
  it('ambil semua alias barang', async function () {
    const response = await request
      .get('/alias')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );
  });

  /**
   * Run: filter smua alias dengan variable pencarian
   */
  it('filter smua alias dengan variable pencarian', async function () {
    const pencarian = {
      nama_general: qs.escape(defaultData.nama_general),
    };

    const response = await request
      .get('/alias')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );
  });
});

/**
 * Run: GET /alias/:id
 */
describe('GET /alias/:id', function () {
  /**
   * Run: ambil alias barang per id
   */
  it('ambil alias barang per id', async function () {
    const response = await request
      .get(`/alias/${qs.escape(alias_id)}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining(defaultData),
      })
    );
  });
});

/**
 * Run: GET /alias failed
 */
describe('GET /alias failed', function () {
  beforeEach(async (done) => {
    await clearDatabase();
    done();
  });

  /**
   * Run: ambil semua alias, akan tetapi database kosong
   */
  it('ambil semua alias, akan tetapi database kosong', async function (done) {
    const response = await request
      .get('/alias')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);
    const isTrue = (function () {
      const message = response.body.message;
      return message === 'alias not found';
    })();
    expect(isTrue).toEqual(true);

    done();
  });

  /**
   * Run: ambil alias sesuai filter, akan tetapi alias tidak ditemukan
   */
  it('ambil alias sesuai filter, akan tetapi alias tidak ditemukan', async function (done) {
    const pencarian = {
      nama_general: qs.escape('kelompok'),
    };
    const response = await request
      .get('/alias')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);
    const isTrue = (function () {
      const message = response.body.message;
      return message === 'alias not found';
    })();
    expect(isTrue).toEqual(true);

    done();
  });
});
