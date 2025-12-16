import axios from "axios";
import FormData from "form-data";
import * as repo from "../repositories/interview.repository.js";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

/**
 * enqueueTranscription(answerId, audioUrl, attempt=0)
 * - in-process 비동기 작업
 */
export async function enqueueTranscription(answerId: string, audioUrl: string, attempt: number = 0) {
  const MAX_ATTEMPTS = 3;
  try {
    
    // 1) S3에서 파일 다운로드 (Stream)
    // URL에서 Key 추출: https://bucket.s3.region.amazonaws.com/dir/file.webm -> dir/file.webm
    const urlObj = new URL(audioUrl);
    const key = urlObj.pathname.substring(1); // leading slash removal



    const audioStream = s3.getObject({ 
        Bucket: process.env.AWS_S3_BUCKET_NAME!, 
        Key: key 
    }).createReadStream();

    // 확장자 추출
    const ext = key.split(".").pop()?.split("?")[0] || "webm"; 
    const filename = `answer-${answerId}.${ext}`;



    // 2) OpenAI Whisper 호출 (multipart/form-data)
    const form = new FormData();
    form.append("file", audioStream, { filename });
    form.append("model", "whisper-1");
    // form.append("language", "ko"); // 필요 시 활성화

    const openaiRes = await axios.post("https://api.openai.com/v1/audio/transcriptions", form, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
      maxBodyLength: Infinity,
      timeout: 180_000,
    });

    const text = openaiRes?.data?.text ?? "";

    
    // 3) 오직 transcript_text만 저장
    await repo.updateInterviewAnswerContent({ answerId, transcriptText: text });
    return;
  } catch (error) {
    const err = error as any;
    const status = err.response?.status;
    const data = err.response?.data;
    console.error(`[Transcription Failed] Answer:${answerId}, Attempt:${attempt}, Status:${status}, Msg:${err.message}`);
    if(data) console.error("[Transcription Error Data]", JSON.stringify(data));

    if (attempt + 1 < MAX_ATTEMPTS) {
      const backoff = Math.pow(2, attempt) * 5000;
      setTimeout(() => {
        enqueueTranscription(answerId, audioUrl, attempt + 1).catch(e => console.error("retry failed:", e));
      }, backoff);
    }
  }
}