jest.setTimeout(30000);

const supertest = require('supertest');
const app = require('../app');
const qs = require('querystring');

const clearDatabase = require('./helpers/clearDB');
const token = require('./helpers/token');

const allDefaultData = require('./constants/defaultData');

const defaultData = allDefaultData.jenisHarga[0];
const defaultDataArray = {
  nama: allDefaultData.jenisBarang.map((item) => item.nama),
};
const brand_id = allDefaultData.brand_id;

const request = supertest(app);

beforeAll(async (done) => {
  await clearDatabase();
  done();
});

/**
 * Run: POST /jenis-harga-jual/bulk
 */
describe('POST /jenis-harga-jual/bulk', function () {
  /**
   * Run: POST /jenis-harga-jual/bulk bikin jenis harga jual array
   */
  it('POST /jenis-harga-jual/bulk bikin jenis harga jual array', async function (done) {
    const response = await request
      .post('/jenis-harga-jual/bulk')
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
 * Run: POST /jenis-harga-jual
 */
describe('POST /jenis-harga-jual', function () {
  beforeEach(async (done) => {
    await clearDatabase();
    done();
  });

  /**
   * Run: POST /jenis-harga-jual bikin jenis harga jual satu
   */
  it('POST /jenis-harga-jual bikin jenis harga jual satu', async function (done) {
    const response = await request
      .post('/jenis-harga-jual')
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
 * Run: GET /jenis-harga-jual success
 */
describe('GET /jenis-harga-jual success', function () {
  /**
   * Run: jenis harga jual semua alias barang
   */
  it('jenis harga jual semua jenis harga jual barang', async function (done) {
    const response = await request
      .get('/jenis-harga-jual')
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
  it('filter smua jenis harga jual dengan variable pencarian', async function (done) {
    const pencarian = {
      nama: qs.escape('grosir'),
    };

    const response = await request
      .get('/jenis-harga-jual')
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
 * Run: GET /jenis-harga-jual/:id
 */
describe('GET /jenis-harga-jual/:id', function () {
  /**
   * Run: ambil jenis harga jual barang per id
   */
  it('ambil jenis harga jual barang per id', async function () {
    const response = await request
      .get(`/jenis-harga-jual/${qs.escape(defaultData.id)}`)
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
 * Run: GET /jenis-harga-jual failed
 */
describe('GET /jenis-harga-jual failed', function () {
  beforeEach(async (done) => {
    await clearDatabase();
    done();
  });

  /**
   * Run: ambil semua jenis harga jual, akan tetapi database kosong
   */
  it('ambil semua jenis harga jual, akan tetapi database kosong', async function (done) {
    const response = await request
      .get('/jenis-harga-jual')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('jenis_harga_jual not found');
    done();
  });

  /**
   * Run: ambil jenis harga jual sesuai filter, akan tetapi jenis harga jual tidak ditemukan
   */
  it('ambil jenis harga jual sesuai filter, akan tetapi jenis harga jual tidak ditemukan', async function (done) {
    const pencarian = {
      nama: qs.escape('retail'),
    };

    const response = await request
      .get('/jenis-harga-jual')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('jenis_harga_jual not found');
    done();
  });
});
