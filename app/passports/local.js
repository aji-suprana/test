const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models').User;
const debug = require('../services/debug');
const flaverr = require('flaverr');
module.exports= (passport)=>{
  passport.use(
    'local',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        debug.logHeader("Authenticating");
        try {
          const user = await User.findOne({
            where: {
              email,
            },
          });
          debug.logData("user",user);

          if (!user) {
            throw flaverr('E_UNAUTHORIZED', Error('Incorrect email or password.'));
          }

          const confirmPassword = bcrypt.compareSync(password, user.password);

          if (!confirmPassword) {
            throw flaverr('E_UNAUTHORIZED', Error('Incorrect email or password.'));
          }

          const data = {
            user_id: user.id,
            email : user.email,
            username: user.username,
            is_verified: user.isVerified
          };

          return done(null, data);
        } catch (err) {
          debug.logError(err);

          return done(err);
        }
      }
    )
  );
}
