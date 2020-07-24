jest.setTimeout(30000);

const supertest = require('supertest');
const app = require('../app');
const qs = require('querystring');

const token = require('./helpers/token');

const allDefaultData = require('./constants/defaultData');
const brand_id = allDefaultData.brand_id;

const request = supertest(app);

let kategoriBarang;

/**
 * Run: GET /kategori-barang
 */
describe('GET /kategori-barang', function () {
  /**
   * Run: ambil semua kategori barang
   */
  it('ambil semua kategori barang', async function (done) {
    const response = await request
      .get('/kategori-barang')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );

    kategoriBarang = {
      id: response.body.data.data[0].id,
      nama: response.body.data.data[0].nama,
    };

    done();
  });

  /**
   * Run: filter smua alias dengan variable pencarian
   */
  it('filter smua alias dengan variable pencarian', async function (done) {
    const pencarian = {
      nama: qs.escape(kategoriBarang.nama),
    };

    const response = await request
      .get('/kategori-barang')
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
 * Run: GET /kategori-barang/:id
 */
describe('GET /kategori-barang/:id', function () {
  /**
   * Run: ambil kategori barang per id
   */
  it('ambil kategori barang per id', async function (done) {
    const response = await request
      .get(`/kategori-barang/${qs.escape(kategoriBarang.id)}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining(kategoriBarang),
      })
    );

    done();
  });
});
