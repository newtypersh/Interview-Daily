import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";

dotenv.config();

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
  const googleId = profile.id;
  if (!googleId) {
    throw new Error(`profile.id was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { google_id: googleId } });
  if (user !== null) {
    return { id: user.id, google_id: user.google_id, nickname: user.nickname };
  }

  const now = new Date();
  const created = await prisma.user.create({
    data: {
      google_id: googleId,
      nickname: profile.displayName?.slice(0, 32) ?? "구글유저",
      created_at: now,
      updated_at: now,
    },
  });

  return { id: created.id, google_id: created.google_id, nickname: created.nickname };
};