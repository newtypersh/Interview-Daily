import { api } from '../axios';
import { 
  StartInterviewResponseSchema, 
  InterviewSchema, 
  UploadAudioResponseSchema, 
  CompleteInterviewResponseSchema,
  type StartInterviewResponse,
  type Interview,
  type InterviewAnswer,
  type UploadAudioResponse,
  type CompleteInterviewResponse,
} from '../../schemas/interview';

export type { StartInterviewResponse, Interview, InterviewAnswer, UploadAudioResponse, CompleteInterviewResponse };
export { StartInterviewResponseSchema, InterviewSchema, UploadAudioResponseSchema, CompleteInterviewResponseSchema };
import { z } from 'zod';

export const startInterview = async (strategy: string): Promise<StartInterviewResponse> => {
  const response = await api.post<StartInterviewResponse>('/interviews/start', { strategy });
  const result = StartInterviewResponseSchema.safeParse(response.data);
  if (!result.success) {
    console.error('startInterview validation failed:', result.error);
    throw new Error('인터뷰 시작 응답 검증에 실패했습니다.');
  }
  return result.data;
};

export const getInterview = async (interviewId: string): Promise<{ interview: Interview }> => {
  const response = await api.get<{ interview: Interview }>(`/interviews/${interviewId}`);
  const result = z.object({ interview: InterviewSchema }).safeParse(response.data);
  if (!result.success) {
    console.error('getInterview validation failed:', result.error);
    throw new Error('인터뷰 상세 조회 검증에 실패했습니다.');
  }
  return result.data;
};

export const getInterviewAnswers = async (interviewId: string): Promise<Interview> => {
  const response = await api.get<Interview>(`/interviews/${interviewId}/answers`);
  const result = InterviewSchema.safeParse(response.data);
  if (!result.success) {
    console.error('getInterviewAnswers validation failed:', result.error);
    throw new Error('인터뷰 답변 조회 검증에 실패했습니다.');
  }
  return result.data;
};

export const uploadAnswerAudio = async (interviewId: string, answerId: string, blob: Blob): Promise<UploadAudioResponse> => {
  const formData = new FormData();
  formData.append('file', blob, 'answer.webm');
  
  const response = await api.post<UploadAudioResponse>(`/interviews/${interviewId}/answers/${answerId}/audio`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const result = UploadAudioResponseSchema.safeParse(response.data);
  if (!result.success) {
    console.error('uploadAnswerAudio validation failed:', result.error);
    throw new Error('오디오 업로드 응답 검증에 실패했습니다.');
  }
  return result.data;
};

export const processAndUploadAudio = async (interviewId: string | null | undefined, answerId: string | null | undefined, mediaUrl: string): Promise<UploadAudioResponse> => {
    const schema = z.object({
        interviewId: z.string().min(1),
        answerId: z.string().min(1),
    });

    const result = schema.safeParse({ interviewId, answerId });

    if (!result.success) {
        console.error('Validation failed:', result.error);
        const errorTree = z.treeifyError(result.error);
        
        if (errorTree && errorTree.properties) {
             const missingFields: string[] = [];
             if (errorTree.properties.interviewId) {
                missingFields.push('Interview ID');
             }
             if (errorTree.properties.answerId) {
                missingFields.push('Answer ID');
             }
             
             if (missingFields.length > 0) {
                 throw new Error(`${missingFields.join(', ')} is missing`);
             }
        }
        
        throw new Error(result.error.issues[0].message);
    }
    
    // ... rest of the function

    // After validation, we know these are strings
    const validInterviewId = result.data.interviewId;
    const validAnswerId = result.data.answerId;

    const response = await api.get(mediaUrl, { responseType: 'blob' });
    const blob = response.data; // response.data is Blob due to responseType: 'blob'
    return uploadAnswerAudio(validInterviewId, validAnswerId, blob);
};

export const submitFeedbacks = async (interviewId: string, feedbacks: { answerId: string; rating: number; feedbackText?: string }[]): Promise<{ message: string; count: number }> => {
  const response = await api.post<{ success: { message: string; count: number } }>(`/interviews/${interviewId}/feedbacks`, { feedbacks });
  // Simple inline validation for this specific response
  const schema = z.object({ message: z.string(), count: z.number() });
  const result = schema.safeParse(response.data.success);
  if (!result.success) {
    console.error('submitFeedbacks validation failed:', result.error);
    throw new Error('피드백 제출 응답 검증에 실패했습니다.');
  }
  return result.data;
};

export const completeInterview = async (interviewId: string): Promise<CompleteInterviewResponse> => {
    const response = await api.post<{ success: { data: CompleteInterviewResponse } }>(`/interviews/${interviewId}/complete`);
    // Note: The API response structure seems to be nested in success.data based on original code
    // Original: return response.data.success.data;
    // Schema matches CompleteInterviewResponse
    const result = CompleteInterviewResponseSchema.safeParse(response.data.success.data);
    if (!result.success) {
      console.error('completeInterview validation failed:', result.error);
      throw new Error('인터뷰 완료 응답 검증에 실패했습니다.');
    }
    return result.data;
};
