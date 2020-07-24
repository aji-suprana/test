jest.setTimeout(30000);

const supertest = require('supertest');
const app = require('../app');
const qs = require('querystring');

const clearDatabase = require('./helpers/clearDB');
const token = require('./helpers/token');

const allDefaultData = require('./constants/defaultData');

const brand_id = allDefaultData.brand_id;
const defaultData = allDefaultData.satuan[0];
const defaultDataArray = {
  nama_satuan: allDefaultData.satuan.map((item) => item.nama_satuan),
};

const request = supertest(app);

beforeAll(async (done) => {
  await clearDatabase();
  done();
});

/**
 * Run: POST /satuan/bulk
 */
describe('POST /satuan/bulk', function () {
  /**
   * Run: POST /satuan/bulk bikin satuan array
   */
  it('POST /satuan/bulk bikin satuan array', async function (done) {
    const response = await request
      .post('/satuan/bulk')
      .send(defaultDataArray)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );

    done();
  });
});

/**
 * Run: POST /satuan
 */
describe('POST /satuan', function () {
  beforeEach(async (done) => {
    await clearDatabase();
    done();
  });

  /**
   * Run: POST /satuan bikin satuan satu
   */
  it('POST /satuan bikin satuan satu', async function (done) {
    const response = await request
      .post('/satuan')
      .send(defaultData)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );

    defaultData.id = response.body.data.id;
    done();
  });
});

/**
 * Run: GET /satuan success
 */
describe('GET /satuan success', function () {
  /**
   * Run: satuan semua alias barang
   */
  it('satuan semua satuan barang', async function (done) {
    const response = await request
      .get('/satuan')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );

    done();
  });

  /**
   * Run: filter smua alias dengan variable pencarian
   */
  it('filter smua satuan dengan variable pencarian', async function (done) {
    const pencarian = {
      nama_satuan: qs.escape('pcs'),
    };

    const response = await request
      .get('/satuan')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );

    done();
  });
});

/**
 * Run: GET /satuan/:id
 */
describe('GET /satuan/:id', function () {
  /**
   * Run: ambil satuan barang per id
   */
  it('ambil satuan barang per id', async function (done) {
    const response = await request
      .get(`/satuan/${qs.escape(defaultData.id)}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining(defaultData),
      })
    );

    done();
  });
});

/**
 * Run: GET /satuan failed
 */
describe('GET /satuan failed', function () {
  beforeEach(async (done) => {
    await clearDatabase();
    done();
  });

  /**
   * Run: ambil semua satuan, akan tetapi database kosong
   */
  it('ambil semua satuan, akan tetapi database kosong', async function (done) {
    const response = await request
      .get('/satuan')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('satuan not found');
    done();
  });

  /**
   * Run: ambil satuan sesuai filter, akan tetapi satuan tidak ditemukan
   */
  it('ambil satuan sesuai filter, akan tetapi satuan tidak ditemukan', async function (done) {
    const pencarian = {
      nama_satuan: qs.escape('pcs'),
    };

    const response = await request
      .get('/satuan')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('satuan not found');
    done();
  });
});
