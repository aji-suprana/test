const express = require('express');
const router = express.Router();
const payment = require('../app/controllers/payment');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/payment');
const upload = require('../app/middlewares/upload-image').upload;

router.post('/', validationRules.save(), validate, payment.save);
router.get('/:id', validationRules.findById(), validate, payment.findById);
router.get('/', validationRules.findAll(), validate, payment.findAll);
router.patch('/:id', validationRules.update(), validate, payment.update);
router.delete('/:id', validationRules.destroy(), validate, payment.destroy);
router.put('/change_status', validationRules.changeStatus(), validate, payment.changeStatus);
router.put('/upload_payment', upload, validationRules.uploadPayment(), validate, payment.uploadPaymentImage);

module.exports = router;
