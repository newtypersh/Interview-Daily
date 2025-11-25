import AWS from "aws-sdk";
import multer from "multer";
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
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const { interviewId, answerId } = req.params;
      const ext = path.extname(file.originalname).toLowerCase() || `.${file.mimetype.split("/")[1] || "bin"}`;
      if (!allowedExtensions.includes(ext)) return cb(new Error("WRONG_EXTENSION"));
      const filename = `${uuidv4()}${ext}`;
      const dir = "answer-voices";
      cb(null, `${dir}/${filename}`);
    },
    acl: "private", // private 권장. 공개 필요하면 변경
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) return cb(new Error("WRONG_EXTENSION"), false);
    cb(null, true);
  },
});