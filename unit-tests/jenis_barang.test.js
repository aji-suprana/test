jest.setTimeout(30000);

const supertest = require('supertest');
const app = require('../app');
const qs = require('querystring');

const clearDatabase = require('./helpers/clearDB');
const token = require('./helpers/token');

const allDefaultData = require('./constants/defaultData');

const defaultData = allDefaultData.jenisBarang[0];
const anakData = allDefaultData.jenisBarang[1];
const brand_id = allDefaultData.brand_id;

const request = supertest(app);

beforeAll(async (done) => {
  await clearDatabase();
  done();
});

/**
 * Run: POST /jenis-barang single
 */
describe('POST /jenis-barang single', function () {
  /**
   * Run: bikin jenis barang dan success
   */
  it('bikin jenis barang barang dan success', async function (done) {
    const response = await request
      .post('/jenis-barang')
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
 * Run: POST /jenis-barang anak jenis barang
 */
describe('POST /jenis-barang anak jenis barang', function () {
  /**
   * Run: bikin jenis barang anak dan success
   */
  it('bikin jenis barang barang anak dan success', async function (done) {
    const data = {
      ...anakData,
      jenis_barang_id: defaultData.id,
    };

    const response = await request
      .post('/jenis-barang')
      .send(data)
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

describe('GET /jenis-barang success', function () {
  /**
   * Run: ambil semua jenis barang
   */
  it('ambil semua jenis barang barang', async function () {
    const response = await request
      .get('/jenis-barang')
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
   * Run: filter smua jenis barang dengan variable pencarian
   */
  it('filter smua jenis barang dengan variable pencarian', async function () {
    const pencarian = { nama: qs.escape('jenis ') };

    const response = await request
      .get('/jenis-barang')
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
 * Run: GET /jenis-barang/:id
 */
describe('GET /jenis-barang/:id', function () {
  /**
   * Run: ambil jenis barang barang per id
   */
  it('ambil jenis barang barang per id', async function () {
    const response = await request
      .get(`/jenis-barang/${qs.escape(defaultData.id)}`)
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
 * Run: GET /jenis-barang failed
 */
describe('GET /jenis-barang failed', function () {
  beforeEach(async (done) => {
    await clearDatabase();
    done();
  });

  /**
   * Run: ambil semua jenis barang, akan tetapi database kosong
   */
  it('ambil semua jenis barang, akan tetapi database kosong', async function (done) {
    const response = await request
      .get('/jenis-barang')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('jenis_barang not found');
    done();
  });

  /**
   * Run: ambil jenis barang sesuai filter, akan tetapi jenis barang tidak ditemukan
   */
  it('ambil jenis barang sesuai filter, akan tetapi jenis barang tidak ditemukan', async function (done) {
    const pencarian = {
      nama: qs.escape('kelompok'),
    };
    const response = await request
      .get('/jenis-barang')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('jenis_barang not found');
    done();
  });
});
