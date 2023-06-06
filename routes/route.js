const express = require('express');
const passport = require('passport');
const { htmlFileSend } = require('../controller/htmlController');

const Router = express.Router();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

Router.get('/', htmlFileSend);

Router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

Router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure',
  })
);

Router.get('/auth/google/failure', isLoggedIn, (req, res) => {
  res.send('Something went wrong!');
});

Router.get('/auth/google/success', isLoggedIn, (req, res) => {
  const name = req.user.displayName;
  return res.status(200).send(`hello there! ${name}`);
});

Router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = Router;
