const strategy = require('passport-jwt');
const JWTStrategy = strategy.Strategy;
const extractJWT = strategy.ExtractJwt;
const passport = require('passport');
const debug = require('../services/debug')
module.exports = (passport) => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
        if(!payload) done(new Error('Token mismatch'));
        done(null, payload);
    }));
}


