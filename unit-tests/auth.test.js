const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const db = require('../app/models');
const jwt = require('jsonwebtoken');
const emailToken = require('../app/services/emailToken');
const transactionRepo = require('../app/repositories/transaction');

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
let emailVerify;

beforeAll(async (done) => {
  await request.post('/auth/register').send(userData).expect(200);
  const user = await db.User.findOne({
    where: { username: userData.username },
  });

  if (!user) {
    throw new Error('User tidak ada');
  }

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

  const decryptToken = jwt.verify(token, process.env.JWT_SECRET);

  // start transaction
  const transaction = await transactionRepo.Create();

  const emailVerifyToken = await emailToken.generate(
    { user_id: decryptToken.user_id },
    transaction.data
  );

  // end transaction
  await transactionRepo.Commit(transaction.data);

  emailVerify = {
    ...emailVerifyToken,
    user_id: decryptToken.user_id,
  };

  done();
});

/**
 * Run test POST /auth/register
 */
describe('POST /auth/register', function () {
  /**
   * test run gagal: register jika password tidak memenuhi syarat
   */
  it('register jika password tidak memenuhi syarat', async function (done) {
    const response = await request
      .post('/auth/register')
      .send({
        ...userData,
        password: 'awur',
      })
      .expect(422);
    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'E_VALIDATION',
      })
    );
    done();
  });
});

/**
 * Run test POST /auth/login
 */
describe('POST /auth/login', function () {
  /**
   * test run berhasil: login jika email sama
   */
  it('login jika email sama', async function (done) {
    const response = await request
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
        token: 'aaa',
      })
      .expect(200);
    const decryptToken = jwt.verify(
      response.body.data.token,
      process.env.JWT_SECRET
    );
    expect(decryptToken).toEqual(
      expect.objectContaining({
        email: userData.email,
      })
    );
    done();
  });
});

/**
 * Run test POST /auth/validate
 */
describe('POST /auth/validate', function () {
  /**
   * test run berhasil: validate token berhasil jika email nya sama
   */
  it('validate token berhasil jika email nya sama', async function (done) {
    const validate = await request
      .get('/auth/validate')
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('server-secret', serversecretToken)
      .expect(200);
    expect(validate.body.data).toEqual(
      expect.objectContaining({
        email: userData.email,
      })
    );
    done();
  });
});

/**
 * Run test POST auth/resend-verify-email
 */
describe('POST auth/resend-verify-email', function () {
  /**
   * test run berhasil: resend email dengan messagenya `token verify email sent successfully`
   */
  it('resend email dengan messagenya `token verify email sent successfully`', async function (done) {
    const response = await request
      .get('/auth/resend-verify-email')
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'token verify email sent successfully',
      })
    );
    done();
  });
});

/**
 * Run test POST auth/verify-email
 */
describe('POST auth/verify-email', function () {
  /**
   * test run berhasil: POST auth/verify-email jika berhasil
   */
  it('POST auth/verify-email jika berhasil', async function (done) {
    const { verif_code, user_id } = emailVerify;

    const response = await request
      .post('/auth/verify-email')
      .send({
        verifcode: verif_code,
        user_id,
      })
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          isVerified: true,
        }),
      })
    );
    done();
  });
});

/**
 * Run test POST /auth/forgot-password
 */
describe('POST /auth/forgot-password', function () {
  /**
   * test run berhasil: send forgot password ke email jika berhasil
   */
  it('send forgot password ke email jika berhasil', async function (done) {
    await request
      .post('/auth/forgot-password')
      .send({
        email: userData.email,
      })
      .expect(200);
    expect(true).toEqual(true);
    done();
  });
});

/**
 * Run test GET /auth/forgot-password
 */
describe('GET /auth/forgot-password-verify-token', function () {
  /**
   * Run test success: test request kalo verify nya success
   */
  it('test request kalo verify nya success', async function (done) {
    const forgotPassword = await db.User.findOne({
      where: { email: userData.email },
    });

    await request
      .get('/auth/forgot-password-verify-token')
      .query({ token: forgotPassword.password_reset_token })
      .expect(200);
    expect(true).toEqual(true);
    done();
  });
});
