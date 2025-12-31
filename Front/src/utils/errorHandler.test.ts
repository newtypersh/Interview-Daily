import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleError } from './errorHandler';
import { ERROR_MESSAGES } from '../constants/messages';

describe('errorHandler', () => {
  // Mock console.error and window.alert before tests
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  // Define alert mock. using vi.fn() so we can check calls
  const alertMock = vi.fn();

  beforeEach(() => {
    // Determine if window exists (jsdom/happy-dom) or if we need to mock it on global
    if (typeof window !== 'undefined') {
      window.alert = alertMock;
    } else {
      vi.stubGlobal('alert', alertMock);
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should log the original error to console', () => {
    const error = new Error('Test error');
    handleError(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', error);
  });

  it('should alert the error message if it is an instance of Error', () => {
    const error = new Error('Network failure');
    handleError(error);
    expect(alertMock).toHaveBeenCalledWith('Network failure');
  });

  it('should alert the default error message if it is NOT an instance of Error', () => {
    const error = 'Some string error';
    handleError(error);
    expect(alertMock).toHaveBeenCalledWith(ERROR_MESSAGES.DEFAULT);
  });

  it('should alert the custom message if provided, regardless of error type', () => {
    const error = new Error('Actual error');
    const customMsg = 'User friendly message';
    
    handleError(error, customMsg);
    
    // Should still log original error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', error);
    // But alert custom message
    expect(alertMock).toHaveBeenCalledWith(customMsg);
  });
});
