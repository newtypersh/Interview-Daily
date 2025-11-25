import axios from "axios";
import FormData from "form-data";
import * as repo from "../repositories/interview.repository.js";

/**
 * enqueueTranscription(answerId, audioUrl, attempt=0)
 * - in-process 비동기 작업
 * - 성공 시 repo.updateInterviewAnswerTranscriptText만 호출
 */
export async function enqueueTranscription(answerId, audioUrl, attempt = 0) {
  const MAX_ATTEMPTS = 3;
  try {
    // 1) 오디오 스트림 준비
    const resp = await axios.get(audioUrl, { responseType: "stream", timeout: 120_000 });
    const audioStream = resp.data;

    // 2) OpenAI Whisper 호출 (multipart/form-data)
    const form = new FormData();
    form.append("file", audioStream, { filename: `answer-${answerId}.audio` });
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
    await repo.updateInterviewAnswerTranscriptText({ answerId, transcriptText: text });
    return;
  } catch (err) {
    const message = err?.message || String(err);
    console.error(`transcription failed (answer:${answerId}, attempt:${attempt}):`, message);

    if (attempt + 1 < MAX_ATTEMPTS) {
      const backoff = Math.pow(2, attempt) * 5000;
      setTimeout(() => {
        enqueueTranscription(answerId, audioUrl, attempt + 1).catch(e => console.error("retry failed:", e));
      }, backoff);
    }
    // 최종 실패 시 DB에 아무것도 저장하지 않음(요청대로)
  }
}