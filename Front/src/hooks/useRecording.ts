import { useState, useCallback } from 'react';

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);

  const start = useCallback(() => {
    setIsRecording(true);
    setRecordingStopped(false);
    // TODO: Implement actual recording logic (MediaRecorder)
  }, []);

  const stop = useCallback(() => {
    setIsRecording(false);
    setRecordingStopped(true);
    // TODO: Stop MediaRecorder and save blob
  }, []);

  const reset = useCallback(() => {
    setIsRecording(false);
    setRecordingStopped(false);
    // TODO: Reset MediaRecorder state
  }, []);

  return {
    isRecording,
    recordingStopped,
    start,
    stop,
    reset,
  };
};
