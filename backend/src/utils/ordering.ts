import db from '../config/db';

interface VideoInSequence {
  id: number;
  section_id: number;
  order_index: number;
  section_order_index: number;
}

/**
 * Returns all video IDs for a subject in global order
 * (sections ordered by order_index, videos within each section by order_index)
 */
export async function getGlobalVideoSequence(subjectId: number): Promise<number[]> {
  const videos = await db<VideoInSequence>('videos as v')
    .join('sections as s', 's.id', 'v.section_id')
    .where('s.subject_id', subjectId)
    .orderBy(['s.order_index', 'v.order_index'])
    .select('v.id');

  return videos.map((v) => v.id);
}

/**
 * Returns previous and next video IDs in the global sequence for a subject.
 */
export async function getPrevNextForVideo(
  subjectId: number,
  videoId: number
): Promise<{ prevVideoId: number | null; nextVideoId: number | null }> {
  const sequence = await getGlobalVideoSequence(subjectId);
  const idx = sequence.indexOf(videoId);

  if (idx === -1) {
    return { prevVideoId: null, nextVideoId: null };
  }

  return {
    prevVideoId: idx > 0 ? sequence[idx - 1] : null,
    nextVideoId: idx < sequence.length - 1 ? sequence[idx + 1] : null,
  };
}

/**
 * Returns whether a video is locked for a user.
 * A video is locked if its prerequisite (previous video in global sequence)
 * has not been completed by the user.
 */
export async function isVideoLocked(
  userId: number,
  videoId: number,
  subjectId: number
): Promise<{ locked: boolean; unlockReason: string | null; prerequisiteVideoId: number | null }> {
  const sequence = await getGlobalVideoSequence(subjectId);
  const idx = sequence.indexOf(videoId);

  if (idx <= 0) {
    // First video is always unlocked
    return { locked: false, unlockReason: null, prerequisiteVideoId: null };
  }

  const prerequisiteVideoId = sequence[idx - 1];

  // Check if prerequisite is completed
  const progress = await db('video_progress')
    .where({ user_id: userId, video_id: prerequisiteVideoId })
    .first<{ is_completed: boolean }>();

  const completed = progress?.is_completed === true || (progress as any)?.is_completed === 1;

  if (!completed) {
    return {
      locked: true,
      unlockReason: 'Complete previous video to unlock this lesson',
      prerequisiteVideoId,
    };
  }

  return { locked: false, unlockReason: null, prerequisiteVideoId };
}
