const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);
const jwt = require('jsonwebtoken');
const db = require('../../app/models');
const dbUtil = require('../../database/utils/cleanDatabase');

/**
 * Initial data for rekening1
 * @type {Object}
 */
let dataRekening1 = {
  nama: "Hebat",
  nomor_rekening: "12392183117",
  jenis_rekening_id: "0a2de9f1-5df8-4a96-aa07-8427981fd339"
};

/**
 * Initial data for rekening2
 * @type {Object}
 */
let dataRekening2 = {
  nama: "Hebat 2",
  nomor_rekening: "12392183112",
  jenis_rekening_id: "0a2de9f1-5df8-4a96-aa07-8427981fd339"
};

/**
 * Initial data for create JurnalUmum
 * @type {Object}
 */
let dataJurnalUmum = {
  tanggal: '2020-07-06',
  nomor_invoice: 'JLC-SHYK-200706-009786',
  modul: 'KAS BANK',
  debits: [{
    nominal: 25000.0
  }],
  credits: [{
    nominal: 25000.0
  }]
};

/**
 * Default data for manipaluting JurnalUmum
 * @type {Object}
 */
let defaultData = {};

/**
 * UUID of Brand
 * @type {String}
 */
const brand_id = '88d09484-d5cf-46eb-bfda-2fadb6f5b094';

/**
 * Generating JWT Token for Signing
 * @type {undefined|String}
 */
const token = jwt.sign({
  user_id: '425b4e9a-262e-4548-a3f8-b3e50a98db7a',
  email: 'toriq@voxel.com',
  brand_id: [brand_id]
}, process.env.JWT_SECRET, {
  expiresIn: '7d',
});

/**
 * Clean up database before run testing
 * @param  {function}
 * @return {Promise<void>}
 */
beforeAll(async function () {
  await dbUtil.cleanUpDatabase();
});

/**
 * Run testing for post request rekening
 */
describe('Create Rekening before running jurnalumum test suites', function () {
  /**
   * Run request testing to endpoint POST /rekening
   * Should passed and create new rekening
   */
  it('should create rekening 1', async function (done) {
    const response = await request.post('/rekening')
      .send(dataRekening1)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('x-brand', brand_id)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          nama: dataRekening1.nama,
          nomor_rekening: dataRekening1.nomor_rekening,
          jenis_rekening_id: dataRekening1.jenis_rekening_id,
          brand_id: brand_id
        })
      })
    );

    dataRekening1 = response.body.data;

    dataJurnalUmum.credits[0].rekening = dataRekening1.id;

    done();
  });

  /**
   * Run request testing to endpoint POST /rekening
   * Should passed and create new rekening
   */
  it('should create rekening 2', async function (done) {
    const response = await request.post('/rekening')
      .send(dataRekening2)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('x-brand', brand_id)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          nama: dataRekening2.nama,
          nomor_rekening: dataRekening2.nomor_rekening,
          jenis_rekening_id: dataRekening2.jenis_rekening_id,
          brand_id: brand_id
        })
      })
    );

    dataRekening2 = response.body.data;

    dataJurnalUmum.debits[0].rekening = dataRekening2.id;

    done();
  });
});

/**
 * Run testing for post request jurnal umum
 */
describe('POST /jurnal-umum', function () {
  /**
   * Run request testing to endpoint POST /jurnal-umum
   * Should passed create new jurnal umum data
   */
  it('should create jurnal umum', async function (done) {
    const response = await request.post('/jurnal-umum')
      .send(dataJurnalUmum)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('x-brand', brand_id)
      .expect(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          nomor_invoice: 'JLC-SHYK-200706-009786',
          modul: 'KAS BANK',
          selisih_debet_kredit_total: 0
        })
      })
    );

    defaultData = response.body.data;

    done();
  });
});

/**
 * Run testing for put request jurnal umum
 */
describe('PUT /jurnal-umum/:id', function () {
  /**
   * Run request testing to endpoint PUT /jurnal-umum/:id
   * Should passed and update jurnal data with new data
   */
  it('should update jurnal umum with id given', async function (done) {
    let updateDataJurnalUmum = {
      tanggal: '2020-07-05',
      modul: 'Piutang'
    };

    const response = await request.put(`/jurnal-umum/${defaultData.id}`)
      .send(updateDataJurnalUmum)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          nomor_invoice: 'JLC-SHYK-200706-009786',
          modul: 'Piutang',
          selisih_debet_kredit_total: 0
        })
      })
    );

    done();
  });
});

/**
 * Run testing for get request jurnal umum
 */
describe('GET /jurnal-umum', function () {
  /**
   * Run request testing to endpoint GET /jurnal-umum?:queries
   * Should passed and get retrieved data
   */
  it('should get all jurnal umum with filter data given', async function (done) {
    const response = await request.get(`/jurnal-umum?page=1&per_page=10&brand_id=${brand_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              nomor_invoice: 'JLC-SHYK-200706-009786',
              modul: 'Piutang',
              selisih_debet_kredit_total: 0
            })
          ]),
          pagination: expect.objectContaining({
            total_records: 1,
            total_per_page: 10,
            total_page: 1,
            current_page: 1,
            next_page: null,
            prev_page: null
          })
        })
      })
    );

    done();
  });

  /**
   * Run request testing to endpoint GET /jurnal-umum/:id
   * Should passed and get retrieved data
   */
  it('should get jurnal umum with id given', async function (done) {
    const response = await request.get(`/jurnal-umum/${defaultData.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          nomor_invoice: 'JLC-SHYK-200706-009786',
          modul: 'Piutang',
          selisih_debet_kredit_total: 0
        })
      })
    );

    done();
  });
});

/**
 * Run testing for delete request jurnal umum
 */
describe('DELETE /jurnal-umum/:id', function () {
  /**
   * Run request testing to endpoint DELETE /jurnal-umum/:id
   * Should passed and delete jurnal umum data
   */
  it('should delete jurnal umum with id given', async function (done) {
    const response = await request.delete(`/jurnal-umum/${defaultData.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success'
      })
    );

    done();
  });
});
