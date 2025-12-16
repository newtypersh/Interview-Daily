import { Request } from "express";
import AWS from "aws-sdk";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

// 허용 확장자
const allowedExtensions = [".mp3", ".wav", ".m4a", ".ogg", ".webm", ".aac"];

export const audioUploader = multer({
  storage: multerS3({
    s3: s3 as any,
    bucket: process.env.AWS_S3_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req: Request, file: any, cb: (error: any, key?: string) => void) => {

      const { interviewId, answerId } = req.params;
      const ext = path.extname(file.originalname).toLowerCase() || `.${file.mimetype.split("/")[1] || "bin"}`;
      if (!allowedExtensions.includes(ext)) {
         console.error("[AudioUploader] Invalid extension:", ext);
         return cb(new Error("WRONG_EXTENSION"));
      }
      const filename = `${uuidv4()}${ext}`;
      const dir = "answer-voices";

      cb(null, `${dir}/${filename}`);
    },
    acl: "private", // Bucket Policy가 ACL 금지시 private로 설정해야 함
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req: Request, file: any, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) return cb(null, false);
    cb(null, true);
  },
});