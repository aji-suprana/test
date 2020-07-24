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
describe('Create Rekening before running RekeningTahun test suites', function () {
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
});

/**
 * Run testing for post request rekening tahun
 */
describe('POST /rekening-tahun', function () {
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

    done();
  });
});

/**
 * Run testing for put request rekening tahun
 */
describe('PUT /rekening-tahun/:id', function () {
  /**
   * Run request testing to endpoint PUT /rekening-tahun/:id
   * Should passed and update rekening tahun data with new data
   */
  it('should update rekening tahun with id given', async function (done) {
    let dataRekeningTahunUpdate = {
      rekening_id: dataRekening2.id
    };

    const response = await request.put(`/rekening-tahun/${dataRekeningTahun.id}`)
      .send(dataRekeningTahunUpdate)
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
 * Run testing for get request rekening tahun
 */
describe('GET /rekening-tahun', function () {
  /**
   * Run request testing to endpoint GET /rekening-tahun?:queries
   * Should passed and get retrieved data
   */
  it('should get all rekening tahun data with filter given', async function (done) {
    const response = await request.get(`/rekening-tahun?page=1&per_page=10&rekening_id=${dataRekening2.id}`)
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
   * Run request testing to endpoint GET /rekening-tahun/:id
   * Should passed and get retrieved data
   */
  it('should get rekening tahun data with id given', async function (done) {
    const response = await request.get(`/rekening-tahun/${dataRekeningTahun.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'success',
        data: expect.objectContaining({
          tahun: dataRekeningTahun.tahun
        })
      })
    );

    done();
  });
});

/**
 * Run testing for delete request rekening tahun
 */
describe('DELETE /rekening-tahun/:id', function () {
  /**
   * Run request testing to endpoint DELETE /rekening-tahun/:id
   * Should passed and delete rekening-tahun data
   */
  it('should delete rekening tahun with id given', async function (done) {
    const response = await request.delete(`/rekening-tahun/${dataRekeningTahun.id}`)
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
