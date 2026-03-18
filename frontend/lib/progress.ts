import apiClient from './apiClient';

let progressTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced progress sender - waits 5 seconds after last call before posting.
 */
export function sendProgress(
  videoId: number,
  payload: { last_position_seconds: number; is_completed?: boolean }
) {
  if (progressTimer) {
    clearTimeout(progressTimer);
  }
  progressTimer = setTimeout(async () => {
    try {
      await apiClient.post(`/api/progress/videos/${videoId}`, payload);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, 5000);
}

/**
 * Immediately sends progress (for completion events).
 */
export async function sendProgressImmediate(
  videoId: number,
  payload: { last_position_seconds: number; is_completed?: boolean }
) {
  if (progressTimer) {
    clearTimeout(progressTimer);
    progressTimer = null;
  }
  await apiClient.post(`/api/progress/videos/${videoId}`, payload);
}
