const supertest = require('supertest');
const dbUtil = require('../../database/utils/cleanDatabase');
const app = require('../../app');
const request = supertest(app);
const jwt = require('jsonwebtoken');

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
  credits: [{
    nominal: 25000.0
  }],
  debits: [{
    nominal: 25000.0
  }]
};

/**
 * Initial data for create Credit
 * @type {Object}
 */
let dataCredit = {
  nominal: 25000.65
};

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
describe('Create Rekening before running credit test suites', function () {
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
describe('Create JurnalUmum and Retrieve JurnalUmum data before running credit test', function () {
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
      .expect(201);

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

    dataJurnalUmum = response.body.data;

    done();
  });

  /**
   * Run request testing to endpoint GET /jurnal-umum/:id
   * Should passed and get retrieved data
   */
  it('should get jurnal umum with id given', async function (done) {
    const response = await request.get(`/jurnal-umum/${dataJurnalUmum.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

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

    dataJurnalUmum = response.body.data;

    dataCredit = {
      ...dataCredit,
      jurnal_umum_id: dataJurnalUmum.id,
      rekening_bulan_id: dataJurnalUmum.Credits[0].rekening_bulan_id,
      rekening_id: dataJurnalUmum.Credits[0].rekening_id
    };

    done();
  });
});

/**
 * Run testing for post request credit
 */
describe('POST /credit', function () {
  /**
   * Run request testing to endpoint POST /credit
   * Should passed create new credit data
   */
  it('should create credit', async function (done) {
    const response = await request.post('/credit')
      .send(dataCredit)
      .set('Authorization', `Bearer ${token}`)
      .set('x-brand', brand_id)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          nominal: 25000.65
        })
      })
    );

    dataCredit = response.body.data;

    done();
  });
});

/**
 * Run testing for put request credit
 */
describe('PUT /credit/:id', function () {
  /**
   * Run request testing to endpoint PUT /credit/:id
   * Should passed and update credit data with new data
   */
  it('should update credit with id given', async function (done) {
    let updateCredit = {
      nominal: 160000.75
    };

    const response = await request.put(`/credit/${dataCredit.id}`)
      .send(updateCredit)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success'
      })
    );

    done();
  });
});

/**
 * Run testing for get request credit
 */
describe('GET /credit', function () {
  /**
   * Run request testing to endpoint GET /credit?:queries
   * Should passed and get retrieved data
   */
  it('should get all credit data with filter given', async function (done) {
    const response = await request.get(`/credit?page=1&per_page=10&jurnal_umum_id=${dataJurnalUmum.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              jurnal_umum_id: dataJurnalUmum.id
            })
          ]),
          pagination: expect.objectContaining({
            current_page: 1
          })
        })
      })
    );

    done();
  });

  /**
   * Run request testing to endpoint GET /credit/:id
   * Should passed and get retrieved data
   */
  it('should get credit data with id given', async function (done) {
    const response = await request.get(`/credit/${dataCredit.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          id: dataCredit.id,
          jurnal_umum_id: dataJurnalUmum.id
        })
      })
    );

    done();
  });
});

/**
 * Run testing for delete request credit
 */
describe('DELETE /credit/:id', function () {
  /**
   * Run request testing to endpoint DELETE /credit/:id
   * Should passed and delete credit data
   */
  it('should delete credit data with id given', async function (done) {
    const response = await request.delete(`/credit/${dataCredit.id}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success'
      })
    );

    done();
  });
});
