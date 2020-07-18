const strategy = require('passport-facebook');
const log = require("../services/debug")
const FacebookStrategy = strategy.Strategy;
const axios = require('axios');

module.exports = (passport) => {
    log.logHeader("Passpor Initialize Facebook Authentication");
    log.log("callbackURL",process.env.FACEBOOK_CALLBACK_URL);
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['email', 'name'],
        scope: ['manage_pages','publish_video','email','pages_messaging','pages_show_list']
    },
        async (accessToken, refreshToken, profile, done) => {
            log.logHeader("Facebook Auth")
            try {
                const data = {
                    accessToken: accessToken,
                    userData: profile._json
                }
                console.log(data);
                done(null, data);
            }
            catch (err) {
                done(err);
            }
        }));
}