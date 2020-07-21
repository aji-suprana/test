const env = require('../env')
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const db = require('../app/models');
const qs = require('querystring');

jest.setTimeout(30000);

/**
 * reset table [Profile, User, EmailVerification]
 * @returns {Promise<void>}
 */
const clearDatabase = async function () {
  await db.EmailVerification.destroy({
    where: {},
    force: true,
    truncate: { cascade: true },
  });
  await db.Profile.destroy({
    where: {},
    force: true,
    truncate: { cascade: true },
  });
  await db.User.destroy({
    where: {},
    force: true,
    truncate: { cascade: true },
  });
};

/**
 * global hapus table
 */
beforeAll(async function (done) {
  await clearDatabase();
  done();
});

/**
 * user data default
 * @type {{password: string, email: string, username: string}}
 */
const userData = {
  username: 'adila',
  first_name: 'adila',
  last_name: 'putra',
  email: 'adila@adila.com',
  password: 'Adila1234!@',
  token: 'aaa',
};

let bearerToken;
let serversecretToken;
let info;
let newPassword;

beforeAll(async (done) => {
  await request.post('/auth/register').send(userData).expect(200);
  const user = await db.User.findOne({
    where: { username: userData.username },
  });

  if (!user) {
    throw new Error('User tidak ada');
  }

  user.isVerified = true;
  user.credit = 10;
  await user.save();

  const login = await request
    .post('/auth/login')
    .send({
      email: userData.email,
      password: userData.password,
      token: 'aaa',
    })
    .expect(200);

  const { token, serverSecret } = login.body.data;
  bearerToken = token;
  serversecretToken = serverSecret;

  const responseInfo = await request
    .get('/user/get-authenticated')
    .set('Authorization', `Bearer ${bearerToken}`)
    .set('server-secret', serversecretToken)
    .expect(200);

  info = responseInfo.body.data;

  done();
});

/**
 * Run test GET /user/get-authenticated
 */
describe('GET /user/get-authenticated', function () {
  /**
   * test run berhasil: dapetin user token
   */
  it('dapetin user token', async function (done) {
    const response = await request
      .get('/user/get-authenticated')
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('server-secret', serversecretToken)
      .expect(200);
    const { data } = response.body;
    expect(data).toEqual(
      expect.objectContaining({
        username: userData.username,
        email: userData.email,
      })
    );
    done();
  });
});

/**
 * Run test GET /user
 */
describe('GET /user', function () {
  /**
   * test run berhasil: dapetin user semua
   */
  it('dapetin user semua', async function (done) {
    const response = await request
      .get('/user')
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200);
    const { data } = response.body;
    const hasDataAndPagination =
      data.hasOwnProperty('pagination') && data.hasOwnProperty('data');
    expect(hasDataAndPagination).toEqual(true);
    done();
  });

  /**
   * test run berhasil: filter user email dengan email dan verify true
   */
  it(`filter user email dengan ${userData.email} dan verify true`, async function (done) {
    const response = await request
      .get('/user')
      .query({
        email: userData.email,
        is_verified: true,
      })
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200);
    const { data } = response.body;
    const hasDataAndPagination =
      data.hasOwnProperty('pagination') && data.hasOwnProperty('data');
    expect(hasDataAndPagination).toEqual(true);
    done();
  });
});

/**
 * Run test GET /user/:id
 */
describe('GET /user/:id', function () {
  /**
   * test run berhasil: ambil data perid user
   */
  it('ambil data perid user', async function (done) {
    const userId = qs.escape(info.id);
    const response = await request
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        username: userData.username,
        email: userData.email,
      })
    );
    done();
  });
});

/**
 * Run test PATCH /user/:id
 */
describe('PATCH /user', function () {
  /**
   * test run berhasil: ganti password dan ganti credit dengan 10
   */
  it('ganti password dan ganti credit dengan 10', async function (done) {
    const userId = qs.escape(info.id);
    newPassword = 'Adila1235!';
    const response = await request
      .patch(`/user/${userId}`)
      .send({
        password: newPassword,
        credit: 10,
      })
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        credit: 10,
      })
    );
    done();
  });
});

/**
 * Run test PATCH /user/change-password
 */
describe('PATCH /user/change-password', function () {
  /**
   * test run berhasil: ganti password user dengan message `password changed successfully`
   */
  it('ganti password user dengan message `password changed successfully`', async function (done) {
    const data = {
      old_password: newPassword,
      new_password: 'Adila123##',
    };

    const response = await request
      .patch('/user/change-password')
      .send(data)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'password changed successfully',
      })
    );
    done();
  });
});

/**
 * Run test POST /user/increase-credit
 */
describe('POST /user/increase-credit', function () {
  /**
   * test run berhasil: ganti increased credit dengan message `credit increased successfully`
   */
  it('ganti increased credit dengan message `credit increased successfully`', async function (done) {
    const response = await request
      .post('/user/increase-credit')
      .send({
        credit: 50000,
      })
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'credit increased successfully',
      })
    );
    done();
  });
});

/**
 * Run test POST /user/decrease-credit
 */
describe('POST /user/decrease-credit', function () {
  /**
   * test run berhasil: ganti decrease credit dengan message `ccredit decreased successfully`
   */
  it('ganti decrease credit dengan message `credit decrease successfully`', async function (done) {
    const response = await request
      .post('/user/decrease-credit')
      .send({
        credit: 1,
      })
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'credit decreased successfully',
      })
    );
    done();
  });
});
