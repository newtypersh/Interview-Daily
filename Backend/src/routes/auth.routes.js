import express from 'express';
import passport from 'passport';
import * as authCtrl from '../controllers/auth.controller.js';
import { oauthCallbackHandler } from '../controllers/auth.controller.js';
import { ensureAuth } from '../middleware/authMiddleware.js';

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

router.post("/logout", ensureAuth, authCtrl.logout);

export default router;
