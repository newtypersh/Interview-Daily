import { useMutation } from '@tanstack/react-query';
import { uploadAnswerAudio } from '../../../apis/interview';
import type { UploadAudioResponse } from '../../../types/interview';

interface UseAnswerSubmissionProps {
  interviewId: string | null;
  onSuccess: (data: UploadAudioResponse) => void;
  onError: (error: Error) => void;
}

export const useAnswerSubmission = ({ interviewId, onSuccess, onError }: UseAnswerSubmissionProps) => {
  const { mutate: submitAudio, isPending: isSubmitting, error } = useMutation({
    mutationFn: async ({ id, mediaUrl }: { id: string; mediaUrl: string }) => {
      if (!interviewId) throw new Error('Interview ID is missing');
      
      try {
        const response = await fetch(mediaUrl);
        const blob = await response.blob(); 
        return uploadAnswerAudio(interviewId, id, blob);
      } catch (err) {
        throw new Error('Failed to process audio recording');
      }
    },
    onSuccess,
    onError,
  });

  return {
    submitAudio,
    isSubmitting,
    error,
  };
};
