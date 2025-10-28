import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";

dotenv.config();

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

  const now = new Date();
  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName?.slice(0, 32) ?? "구글유저",
      created_at: now,
      updated_at: now,
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};