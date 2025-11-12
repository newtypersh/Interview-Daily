import { toPublicUser } from '../dtos/user.dto.js';

/**
 * Final handler after passport authentication.
 * Currently redirects to the frontend root on success.
 */
export const oauthCallbackHandler = (req, res) => {
  if (!req.user) return res.redirect('/oauth2/login/google');

  const publicUser = toPublicUser(req.user);
  // Here you might want to set a cookie, issue a JWT, or redirect with params.
  // For now keep existing behavior: redirect to '/'.
  return res.redirect('/');
};

// 로그아웃 핸들러
export const logout = (req, res, next) => {
  try {
    // passport >=0.6: req.logout(callback)
    req.logout(function (err) {
      if (err) return next(err);

      // 세션이 있으면 파기
      if (req.session) {
        req.session.destroy((err) => {
          // 세션 쿠키 제거 (세션 이름은 index.js의 session name과 일치시킬 것)
          res.clearCookie(process.env.SESSION_NAME || 'connect.sid', { path: '/' });
          if (err) return next(err);
                  
          // 공통 응답 포맷 사용
          return res.success(null);
        });
      } else {
        // 세션 없음 -> 그냥 쿠키 삭제 및 응답
        res.clearCookie(process.env.SESSION_NAME || 'connect.sid', { path: '/' });
        return res.success(null);
      }
    });
  } catch (err) {
    next(err);
  }
}
