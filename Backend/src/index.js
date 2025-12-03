BigInt.prototype.toJSON = function() {
  return this.toString();
};

import "dotenv/config";
import cors from 'cors'
import { prisma } from './db.config.js'
import express from 'express'          // -> ES Module
import swaggerAutogen from 'swagger-autogen'
import swaggerUiExpress from 'swagger-ui-express'
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy } from "./auth.config.js";
import fs from 'fs';
import path from 'path';

import authRouter from './routes/auth.routes.js';
import questionSetRouter from "./routes/questionSet.routes.js";
import feedbackTemplateRouter from "./routes/feedbackTemplate.routes.js";
import historyRouter from "./routes/history.routes.js";
import interviewRouter from "./routes/interview.routes.js";



passport.use(googleStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();
const port = process.env.PORT;

// 공통 응답을 사용할 수 있는 헬퍼 함수 등록
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use(cors()); // cors 방식 허용
app.use(express.static('public')); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 생성된 swagger-output.json 파일을 읽어옵니다.
// 참고하신 코드의 'import ... assert { type: "json" }'과 같은 역할입니다.
const swaggerFile = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/swagger-output.json'), 'utf-8')
);

// Swagger UI 연결 (참고하신 코드 스타일)
app.use(
  '/api-docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerFile)
);

app.get('/', (req, res) => {
  // #swagger.ignore = true
  res.send('Hello World!');
});

app.use('/oauth2', authRouter);
app.use("/api/question-sets", questionSetRouter);
app.use("/api/feedback-templates", feedbackTemplateRouter);
app.use("/api/history", historyRouter);
app.use("/api/interviews", interviewRouter);

// 전역 오류를 처리하기 위한 미들웨어
app.use((err, req, res, next) => {
  if(res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});