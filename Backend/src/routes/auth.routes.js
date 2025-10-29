import express from 'express';
import passport from 'passport';
import { oauthCallbackHandler } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/login/google', passport.authenticate('google'));

router.get(
  '/callback/google',
  passport.authenticate('google', {
    failureRedirect: '/oauth2/login/google',
    failureMessage: true,
  }),
  oauthCallbackHandler,
);

export default router;
