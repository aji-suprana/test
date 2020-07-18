const strategy = require('passport-facebook');
const FacebookStrategy = strategy.Strategy;
const axios = require('axios');

module.exports = (passport) => {
    passport.use('facebookBuyer', new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.BUYER_FACEBOOK_CALLBACK_URL,
        profileFields: ['email', 'name'],
        scope: ['manage_pages', 'publish_video', 'user_videos', 'user_posts', 'user_link', 'user_friends', 'email', 'publish_pages', 'publish_to_groups', 'pages_messaging', 'pages_show_list']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile)
                const data = {
                    accessToken: accessToken,
                    userData: profile._json
                }

                done(null, data);
            }
            catch (err) {
                done(err);
            }
        }));
}