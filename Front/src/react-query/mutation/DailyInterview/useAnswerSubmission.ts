import { useMutation } from '@tanstack/react-query';
import { processAndUploadAudio } from '../../../apis/interview';
import type { UploadAudioResponse } from '../../../apis/interview';

type UseAnswerSubmissionProps = {
  interviewId: string | null;
  onSuccess: (data: UploadAudioResponse) => void;
  onError: (error: Error) => void;
}

export const useAnswerSubmission = ({ interviewId, onSuccess, onError }: UseAnswerSubmissionProps) => {
  const { mutate: mutateAudio, isPending: isSubmitting, error } = useMutation<UploadAudioResponse, Error, { id: string; mediaUrl: string }>({
    mutationFn: async ({ id, mediaUrl }) => {
      // processAndUploadAudio handles fetch(axios) and upload
      return processAndUploadAudio(interviewId, id, mediaUrl);
    },
    onSuccess,
    onError,
  });

  const submit = (id: string | undefined, mediaUrl: string | null) => {
    if (!id || !mediaUrl) {
      onError(new Error('제출에 필요한 정보가 누락되었습니다.'));
      return;
    }
    mutateAudio({ id, mediaUrl });
  };

  return {
    submit,
    isSubmitting,
    error,
  };
};
