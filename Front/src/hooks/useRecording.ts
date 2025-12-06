import { useReactMediaRecorder } from 'react-media-recorder';

export const useRecording = () => {
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    status,
    clearBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  const isRecording = status === 'recording';
  const recordingStopped = status === 'stopped';

  // Manual reset function (optional since we have clearBlobUrl)
  const reset = () => {
    clearBlobUrl();
    // If needed, we can add more reset logic here
    // Note: react-media-recorder doesn't have a direct 'reset' to initial state, 
    // but clearing blob and status tracking handles most cases.
  };

  return {
    isRecording,
    recordingStopped,
    mediaBlobUrl, // Exposed for playback and upload
    start: startRecording,
    stop: stopRecording,
    reset,
  };
};
