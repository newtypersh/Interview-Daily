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
