import express from 'express';
import passport from 'passport';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/oauth2/login/google', passport.authenticate('google'));

router.get(
  '/oauth2/callback/google',
  passport.authenticate('google', {
    failureRedirect: '/oauth2/login/google',
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.post("/oauth2/logout", ensureAuth, function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default router;
