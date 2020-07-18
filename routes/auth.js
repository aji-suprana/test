const express = require('express');
const router = express.Router();
const passport = require('passport');
const facebook = require('../app/controllers/facebook');
const auth = require('../app/controllers/auth');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/user-facebook');

// facebook register user
router.get('/facebook', passport.authenticate('facebook', { session: false }));
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/fail',
    session: false
}));

router.get('/facebook/fail', (req, res, next) => {
    res.status(401).json({
        status: 'failed',
        message: 'failed authenticate'
    });
});

router.get('/facebook', facebook.success);

// manual register user
router.post('/register', validationRules.save(), validate, auth.register);
// router.post('/token', auth.token)

module.exports = router;