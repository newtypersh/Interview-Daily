export function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({
    resultType: "FAIL",
    error: { errorCode: "unauthorized", reason: "로그인이 필요합니다.", data: null },
    success: null,
  });
}