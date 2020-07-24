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
 * Initial data for create RekeningTahun
 * @type {Object}
 */
let dataRekeningTahun = {
  tahun: 2021
};

let dataRekeningBulan = {
  bulan: 7,
  tahun: 2021
}

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
 * Run testing for post request rekening and rekening tahun
 */
describe('Create Rekening before running RekeningBulan test suites', function () {
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

    dataRekeningTahun.rekening_id = dataRekening1.id;

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

    done();
  });

  /**
   * Run request testing to endpoint POST /rekening-tahun
   * Should passed and create new rekening tahun
   */
  it('should create rekening tahun', async function (done) {
    const response = await request.post('/rekening-tahun')
      .send(dataRekeningTahun)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('x-brand', brand_id)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          tahun: dataRekeningTahun.tahun,
          rekening_id: dataRekeningTahun.rekening_id
        })
      })
    );

    dataRekeningTahun = response.body.data;

    dataRekeningBulan.rekening_id = dataRekening1.id;
    dataRekeningBulan.rekening_tahun_id = dataRekeningTahun.id;

    done();
  });
});

/**
 * Run testing for post request rekening bulan
 */
describe('POST /rekening-bulan', function () {
  /**
   * Run request testing to endpoint POST /rekening-bulan
   * Should passed and create new rekening bulan
   */
  it('should create rekening bulan', async function (done) {
    const response = await request.post('/rekening-bulan')
      .send(dataRekeningBulan)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('x-brand', brand_id)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          bulan: dataRekeningBulan.bulan,
          tahun: dataRekeningBulan.tahun,
          rekening_id: dataRekeningBulan.rekening_id
        })
      })
    );

    dataRekeningBulan = response.body.data;

    done();
  });
});

/**
 * Run testing for put request rekening bulan
 */
describe('PUT /rekening-bulan/:id', function () {
  /**
   * Run request testing to endpoint PUT /rekening-bulan/:id
   * Should passed and update rekening bulan data with new data
   */
  it('should update rekening bulan with id given', async function (done) {
    let dataRekeningBulanUpdate = {
      rekening_id: dataRekening2.id
    };

    const response = await request.put(`/rekening-bulan/${dataRekeningBulan.id}`)
      .send(dataRekeningBulanUpdate)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('x-brand', brand_id)
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
 * Run testing for get request rekening bulan
 */
describe('GET /rekening-bulan', function () {
  /**
   * Run request testing to endpoint GET /rekening-bulan?:queries
   * Should passed and get retrieved data
   */
  it('should get all rekening bulan data with filter given', async function (done) {
    const response = await request.get(`/rekening-bulan?page=1&per_page=10&rekening_id=${dataRekening2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              rekening_id: dataRekening2.id
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
   * Run request testing to endpoint GET /rekening-bulan/:id
   * Should passed and get retrieved data
   */
  it('should get rekening bulan data with id given', async function (done) {
    const response = await request.get(`/rekening-bulan/${dataRekeningBulan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          tahun: dataRekeningBulan.tahun,
          bulan: dataRekeningBulan.bulan
        })
      })
    );

    done();
  });
});

/**
 * Run testing for delete request rekening bulan
 */
describe('DELETE /rekening-bulan/:id', function () {
  /**
   * Run request testing to endpoint DELETE /rekening-bulan/:id
   * Should passed and delete rekening-bulan data
   */
  it('should delete rekening bulan with id given', async function (done) {
    const response = await request.delete(`/rekening-bulan/${dataRekeningBulan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
      })
    );

    done();
  });
});
