import { useEffect } from 'react';
import { useRecording } from '../../../../hooks/useRecording';

interface UseRecordingManagerProps {
  resetOnIndexChange: number;
}

export const useRecordingManager = ({ resetOnIndexChange }: UseRecordingManagerProps) => {
  const recording = useRecording();

  // Automatically reset recording when the question index changes
  useEffect(() => {
    recording.reset();
  }, [resetOnIndexChange]);

  return {
    isActive: recording.isRecording,
    isStopped: recording.recordingStopped,
    mediaBlobUrl: recording.mediaBlobUrl ?? null,
    start: recording.start,
    stop: recording.stop,
    retry: recording.reset,
  };
};
