jest.setTimeout(30000);

const supertest = require('supertest');
const app = require('../app');
const qs = require('querystring');

const clearDatabase = require('./helpers/clearDB');
const token = require('./helpers/token');

const allDefaultData = require('./constants/defaultData');

const brand_id = allDefaultData.brand_id;
const satuan_tujuan = {
  nama_satuan: allDefaultData.satuan[0].nama_satuan,
};
const satuan_asal = {
  nama_satuan: allDefaultData.satuan[1].nama_satuan,
};
const defaultData = allDefaultData.konversi;

const request = supertest(app);

beforeAll(async (done) => {
  await clearDatabase();

  const tujuan = await request
    .post('/satuan')
    .send(satuan_tujuan)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  const asal = await request
    .post('/satuan')
    .send(satuan_asal)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  satuan_tujuan.id = tujuan.body.data.id;
  satuan_asal.id = asal.body.data.id;
  defaultData.satuan_tujuan = tujuan.body.data.id;
  defaultData.satuan_asal = asal.body.data.id;

  done();
});

/**
 * Run: POST /konversi
 */
describe('POST /konversi', function () {
  /**
   * Run: buat konversi barang
   */
  it('buat konversi barang', async function (done) {
    const response = await request
      .post('/konversi')
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
 * Run: GET /konversi success
 */
describe('GET /konversi success', function () {
  /**
   * Run: ambil semua konversi
   */
  it('ambil semua konversi', async function (done) {
    const response = await request
      .get('/konversi')
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
  it('filter smua alias dengan variable pencarian', async function (done) {
    const pencarian = {
      satuan_tujuan: qs.escape(defaultData.satuan_tujuan),
      satuan_asal: qs.escape(defaultData.satuan_asal),
    };

    const response = await request
      .get('/konversi')
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
 * Run: GET /konversi/:id
 */
describe('GET /konversi/:id', function () {
  /**
   * Run: ambil konversi per id
   */
  it('ambil konversi per id', async function (done) {
    const response = await request
      .get(`/konversi/${qs.escape(defaultData.id)}`)
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
 * Run: GET /konversi failed
 */
describe('GET /konversi failed', function () {
  beforeEach(async (done) => {
    await clearDatabase();
    done();
  });

  /**
   * Run: konversi semua konversi, akan tetapi database kosong
   */
  it('ambil semua konversi, akan tetapi database kosong', async function (done) {
    const response = await request
      .get('/konversi')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('konversi not found');
    done();
  });

  /**
   * Run: ambil konversi sesuai filter, akan tetapi konversi tidak ditemukan
   */
  it('ambil konversi sesuai filter, akan tetapi konversi tidak ditemukan', async function (done) {
    const pencarian = {
      satuan_terkecil: qs.escape(defaultData.satuan_terkecil),
      satuan_lain_id: qs.escape(defaultData.satuan_lain_id),
    };

    const response = await request
      .get('/konversi')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('konversi not found');
    done();
  });
});
