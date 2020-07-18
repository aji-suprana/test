const express = require('express');
const router = express.Router();
const passport = require('passport');
const facebookBuyer = require('../app/controllers/facebookbuyer');

router.get('/facebook', passport.authenticate('facebookBuyer', { session: false }));
router.get('/facebook/callback', passport.authenticate('facebookBuyer', {
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

router.get('/facebook', facebookBuyer.success);

module.exports = router;