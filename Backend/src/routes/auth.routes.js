import express from 'express';
import passport from 'passport';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/login/google', passport.authenticate('google'), (req, res) => {
  /* 
      #swagger.tags = ['Auth']
      #swagger.summary = '구글 로그인 시작'
      #swagger.description = '구글 OAuth2 인증 페이지로 리다이렉트합니다.'
      #swagger.responses[302] = {
          description: '구글 로그인 페이지로 이동'
      }
  */
});


router.get(
  '/callback/google',
  passport.authenticate('google', {
    failureRedirect: '/oauth2/login/google',
    failureMessage: true,
  }),
  (req, res) => {
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = '구글 로그인 콜백'
       #swagger.description = '구글 인증 서버에서 돌아오는 콜백 URL입니다. 인증 성공 시 세션을 생성하고 메인 페이지(/)로 리다이렉트합니다.'
       #swagger.responses[302] = { description: '로그인 성공 후 리다이렉트' }
       #swagger.responses[401] = { description: '인증 실패 (로그인 페이지로 리다이렉트)' }
    */
    res.redirect('/');
  }
);

router.post("/logout", ensureAuth, function (req, res, next) {
  /* 
      #swagger.tags = ['Auth']
      #swagger.summary = '로그아웃'
      #swagger.description = '현재 세션을 종료하고 메인 페이지로 리다이렉트합니다.'
      #swagger.responses[302] = { description: '로그아웃 성공 후 메인으로 이동' }
      #swagger.responses[401] = { description: '로그인하지 않은 사용자' }
  */
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});


export default router;
