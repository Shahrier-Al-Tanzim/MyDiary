const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const googleStrategy = new GoogleStrategy(
  {
    // clientID: '735145698258-aaic4o5bhdvsvdl96lhlhrsrre0mt4i7.apps.googleusercontent.com',
    // clientSecret: "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",
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/google/callback',
    passReqToCallback: true,
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
      // Ensure you're accessing the email correctly from the profile
      let _email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      if (!_email) {
        // Handle case where email is not available in the profile
        return done(new Error('Email not found in the Google profile.'));
      }

      let user = await User.findOne({ email: _email });

      if (!user) {
        user = new User({
          name: profile.displayName,
          email: _email,
        });
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }

);

passport.use('google', googleStrategy);

passport.serializeUser(async (user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});

module.exports = passport;
