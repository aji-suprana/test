jest.setTimeout(30000);

const supertest = require('supertest');
const app = require('../app');
const qs = require('querystring');

const kategoriBarangRepo = require('../app/repositories/kategori_barang');

const clearDatabase = require('./helpers/clearDB');
const token = require('./helpers/token');

const allDefaultData = require('./constants/defaultData');

const brand_id = allDefaultData.brand_id;
const dataAlias = allDefaultData.alias;
const dataJenBar = allDefaultData.jenisBarang[0];
const dataJenHar = allDefaultData.jenisHarga[0];
const dataKonversi = allDefaultData.konversi;
const dataSatuankecil = allDefaultData.satuan[0];
const dataSatuanLain = allDefaultData.satuan[1];

const defaultData = allDefaultData.barang;

const request = supertest(app);

let dataKatBar;

beforeAll(async (done) => {
  await clearDatabase();

  const createAlias = await request
    .post('/alias')
    .send(dataAlias)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  const createJenisBarang = await request
    .post('/jenis-barang')
    .send(dataJenBar)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  const createJenisHarga = await request
    .post('/jenis-harga-jual')
    .send(dataJenHar)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  const createSatuanKecil = await request
    .post('/satuan')
    .send(dataSatuankecil)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  const createSatuanLain = await request
    .post('/satuan')
    .send(dataSatuanLain)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  const kategoriBarang = await kategoriBarangRepo.FindMany();

  console.log(kategoriBarang);

  dataKatBar = {
    id: kategoriBarang.data.data[0].id,
    nama: kategoriBarang.data.data[0].nama,
  };

  dataKonversi.satuan_tujuan = createSatuanKecil.body.data.id;
  dataKonversi.satuan_asal = createSatuanLain.body.data.id;

  const createKonversi = await request
    .post('/konversi')
    .send(dataKonversi)
    .set('Authorization', `Bearer ${token}`)
    .set('x-brand', brand_id)
    .expect(201);

  defaultData.kategori_barang_id = dataKatBar.id;
  defaultData.alias_id = createAlias.body.data.id;
  defaultData.jenis_barang_id.push(createJenisBarang.body.data.id);
  defaultData.harga_jual.push({
    id: createJenisHarga.body.data.id,
    qty_min: 1,
    harga_jual: 2000,
  });
  defaultData.satuan_id = createSatuanKecil.body.data.id;
  defaultData.konversi.push({
    id: createKonversi.body.data.id,
    nama_konversi: 'Bp Genko',
    barcode: '1823218371',
  });

  done();
});

/**
 * Run: POST /barang
 */
describe('POST /barang', function () {
  /**
   * Run: buat barang data dengan default data
   */
  it('buat barang data dengan default data', async function (done) {
    const response = await request
      .post('/barang')
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
 * Run: GET /barang success
 */
describe('GET /barang success', function () {
  /**
   * Run: ambil semua barang
   */
  it('ambil semua barang', async function (done) {
    const response = await request
      .get('/barang')
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
   * Run: filter smua barang dengan variable pencarian
   */
  it('filter smua barang dengan variable pencarian', async function (done) {
    const pencarian = {
      nama_barang: qs.escape('kardus'),
    };

    const response = await request
      .get('/barang')
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
 * Run: GET /barang/:id
 */
describe('GET /barang/:id', function () {
  /**
   * Run: ambil jenis barang barang per id
   */
  it('ambil jenis barang barang per id', async function (done) {
    const response = await request
      .get(`/barang/${qs.escape(defaultData.id)}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          nama_barang: defaultData.nama_barang,
        }),
      })
    );

    done();
  });
});

/**
 * Run: UPDATE /barang
 */
describe('UPDATE /barang', function () {
  it('update barang', async function (done) {
    const { id } = defaultData;
    defaultData.nama_barang = 'Kardus 2';

    const response = await request
      .put(`/barang/${qs.escape(id)}`)
      .send(defaultData)
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
 * Run: DELETE /barang
 */
describe('DELETE /barang', function () {
  it('delete barang', async function (done) {
    const { id } = defaultData;

    const response = await request
      .delete(`/barang/${qs.escape(id)}`)
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
 * Run: GET /barang failed
 */
describe('GET /barang failed', function () {
  /**
   * Run: ambil semua barang, akan tetapi database kosong
   */
  it('ambil semua jenis barang, akan tetapi database kosong', async function (done) {
    const response = await request
      .get('/barang')
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('barang not found');

    done();
  });

  /**
   * Run: ambil barang sesuai filter, akan tetapi barang tidak ditemukan
   */
  it('ambil barang sesuai filter, akan tetapi barang tidak ditemukan', async function (done) {
    const pencarian = {
      nama: qs.escape('kardus '),
    };

    const response = await request
      .get('/barang')
      .query(pencarian)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(404);

    expect(response.body.message).toBe('barang not found');

    done();
  });
});
