const express = require('express')
const router = express.Router();
const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log('Google profile:', profile);
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos[0].value,
    };

    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      } else {
        user = await User.create(newUser);
        done(null, user);
      }
    } catch (error) {
      console.log(error);
    }
  }

));

//Google login Route
router.get('/auth/google',
  passport.authenticate('google', 
  { scope: ['email','profile','openid'] }));

  //Retrive user data
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login-failure',
    successRedirect:'/dashboard'

}),
(req, res) => {
  console.log('callback - req.user:', req.user); 
  res.redirect('/dashboard');
}
  );

  //Route if someting goes wrong
  router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...');
  });

// Destroy user session
router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if(error) {
      console.log(error);
      res.send('Error loggin out');
    } else {
      res.redirect('/')
    }
  })
});


// Presist user data after successful authentication
passport.serializeUser(function (user, done) {
 
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  //User.findById(id, function (err, user) {
    try {
      const user = await User.findById(id).exec();
      //const user = await User.findById(id);
      if(user){
      done(null, user); 
    }else{
      done(null,false)
    }
  }catch (err) {
    done(err, null);
    }
  });


module.exports = router;