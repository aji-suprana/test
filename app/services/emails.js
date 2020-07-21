
const ejs = require('ejs')
const nodemailer = require('nodemailer')
const lodash = require('lodash');
const debug = require('../services/debug');
const path = require('path');

var library = {};
library.sendVerificationEmail=async function(email,name,base_url,verifCode,userId) {
  debug.logHeader('Send Email Verification');
  if(!lodash.isString(email)){debug.logError("INVALID_EMAIL"); throw "INVALID_EMAIL"; }
  if(!lodash.isString(name)){debug.logError("INVALID_NAME"); throw "INVALID_NAME"}
  if(!lodash.isString(base_url)){debug.logError("INVALID_BASEURL"); throw "INVALID_BASEURL"}
  if(!lodash.isObject(verifCode)){debug.logError("INVALID_VERIFCODE"); throw "INVALID_VERIFCODE"}
  if(!lodash.isString(userId)){debug.logError("INVALID_USERID"); throw "INVALID_USERID"}


  var emailFile;
  ejs.renderFile(
    `${__dirname}/../../assets/verifyEmail.html`,
    { name:name, base_url: base_url, verif_code: verifCode.verif_code, user_id: userId },
    (err, data) => {

      if(err)
        throw err;

      emailFile = data;

      const mailOptions = {
        from: 'Vobis <verification@vobis.io>',
        to: email,
        subject: `Welcome to Vobis!`,
        replyTo: 'verify@vobis.io',
        html: data
      };

      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: 'admin@vobis.io',
          pass: 'vobis12345'
        }
      });

      //Verifying the Nodemailer Transport instance
      transporter.verify((error, success) => {
          if (error) {
            throw error;
          }
        });

      (async () => {
        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          throw error;
        }
      })();

      return true;
  });
  return emailFile;
}

library.sendForgotPasswordEmail =async function(email, name, url, expired, token) {
  debug.logHeader('Send Email Verification');
  if(!lodash.isString(email)){debug.logError("INVALID_EMAIL"); throw "INVALID_EMAIL"; }
  if(!lodash.isString(name)){debug.logError("INVALID_NAME"); throw "INVALID_NAME"; }
  if(!lodash.isString(url)){debug.logError("INVALID_URL"); throw "INVALID_URL"}
  if(!lodash.isDate(expired)){debug.logError("INVALID_EXPIRED"); throw "INVALID_EXPIRED"}


  var emailFile;
  const dir = path.join(__dirname, '../../assets/forgotPassword.html')
  ejs.renderFile(
    dir,
    { name: name, base_url: url, expired: expired, token: token},
    (err, data) => {

      if(err)
        throw err;

      emailFile = data;

      const mailOptions = {
        from: 'Vobis <verification@vobis.io>',
        to: email,
        subject: `verify your account`,
        replyTo: 'verify@vobis.io',
        html: data
      };

      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: 'admin@vobis.io',
          pass: 'vobis12345'
        }
      });

      //Verifying the Nodemailer Transport instance
      transporter.verify((error, success) => {
          if (error) {
            throw error;
          }
        });

     (async () => {
       try {
         await transporter.sendMail(mailOptions);
       } catch (error) {
         throw error
       }
     })();

     return true;
  });
  return emailFile;
}

module.exports=library;
