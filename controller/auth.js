const passport = require('passport');
const {
  createUser,
  checkUser,
  updateLastAccess,
} = require('../Model/usermodel');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   }); // this is for storing data in database
      const { displayName, email } = profile;
      const created_at = new Date();
      console.log(displayName, email);
      try {
        const checkUsr = await checkUser(email);
        if (checkUsr.length === 0) {
          await createUser(displayName, email, created_at);
          done(null, profile);
        } else {
          const updateData = [new Date(), email];
          await updateLastAccess(updateData);
          done(null, profile);
        }
      } catch (error) {
        console.log('error is ', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
