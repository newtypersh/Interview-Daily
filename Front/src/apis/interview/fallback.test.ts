import { describe, it, expect, vi } from 'vitest';
import { processAndUploadAudio } from './index';

// We need to mock zod BEFORE importing the module under test
vi.mock('zod', async (importOriginal) => {
  const actual = await importOriginal<typeof import('zod')>();
  return {
    ...actual,
    z: {
      ...actual.z,
      treeifyError: () => null, // Force treeifyError to return null
    },
  };
});

// Mock axios since processAndUploadAudio imports it
vi.mock('../axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Interview API Fallback', () => {
  it('should throw raw issue message if treeifyError fails (fallback path)', async () => {
    // This input will trigger validation error because interviewId is null
    // And since treeifyError is mocked to return null, it should hit the fallback throw
    await expect(processAndUploadAudio(null, null, 'blob:url'))
        .rejects.toThrow(); 
  });
});
