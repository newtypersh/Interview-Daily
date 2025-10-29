import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import { createUserAndDefaults } from "./services/user.service.js";

// googleStarategy(Options 객체, VerifyCallback 함수)
// Options 객체: clientID, clientSecret, callbackURL, scope
// VerifyCallback 함수: (accessToken, refreshToken, profile, cb)
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/callback/google",
    scope: ["email", "profile"],
    state: true,
  },
  (accessToken, refreshToken, profile, cb) => {
    return googleVerify(profile)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
);

const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${JSON.stringify(profile)}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    await prisma.user.update({
      where: { id: user.id },
      data: { updated_at: new Date() },
    });
    return { id: user.id, email: user.email, name: user.name };
  }

  // 신규 사용자 생성 + 기본 세트 생성 (서비스에 위임)
  const createdUser = await createUserAndDefaults({
    email,
    name: profile.displayName?.slice(0, 32) ?? "구글유저",
  });

  return { id: createdUser.id, email: createdUser.email, name: createdUser.name };
};