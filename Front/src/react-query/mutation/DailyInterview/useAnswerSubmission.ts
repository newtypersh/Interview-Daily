import { useMutation } from '@tanstack/react-query';
import { uploadAnswerAudio } from '../../../apis/interview';
import type { UploadAudioResponse } from '../../../apis/interview';

type UseAnswerSubmissionProps = {
  interviewId: string | null;
  onSuccess: (data: UploadAudioResponse) => void;
  onError: (error: Error) => void;
}

export const useAnswerSubmission = ({ interviewId, onSuccess, onError }: UseAnswerSubmissionProps) => {
  const { mutate: mutateAudio, isPending: isSubmitting, error } = useMutation<UploadAudioResponse, Error, { id: string; mediaUrl: string }>({
    mutationFn: async ({ id, mediaUrl }) => {
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

  const submit = (id: string | undefined, mediaUrl: string | null) => {
    if (!id || !mediaUrl) return;
    mutateAudio({ id, mediaUrl });
  };

  return {
    submit,
    isSubmitting,
    error,
  };
};
