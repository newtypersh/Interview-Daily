import { renderHook, act } from '@testing-library/react';
import { useFeedbackForm } from './useFeedbackForm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock uses dependencies
vi.mock('./useFeedbackSubmission', () => ({
  useFeedbackSubmission: () => ({
    onSubmit: vi.fn(),
    isSubmitting: false,
  }),
}));

// Partially mock react-hook-form to intercept handleSubmit
vi.mock('react-hook-form', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-hook-form')>();
    return {
        ...actual,
        useForm: () => ({
            control: {},
            handleSubmit: (onValid: any, onInvalid: any) => {
                return (e: any) => {
                    // Simulate Validation Failure with Root Error
                    onInvalid({
                        root: { message: 'Root Error Occurred' }
                    });
                };
            },
        }),
    };
});

describe('useFeedbackForm Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should alert root error message if validation fails with root error', async () => {
    // Spy on alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useFeedbackForm([], 'interview-1')
    );

    // Trigger submit
    // Our mocked handleSubmit calls onInvalid immediately
    await act(async () => {
        result.current.submitHandler({} as any);
    });

    expect(alertSpy).toHaveBeenCalledWith('Root Error Occurred');
    
    alertSpy.mockRestore();
  });
});
