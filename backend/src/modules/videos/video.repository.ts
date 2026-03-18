import db from '../../config/db';
import { getPrevNextForVideo, isVideoLocked } from '../../utils/ordering';

export async function findVideoWithContext(videoId: number, userId: number) {
  const video = await db('videos as v')
    .join('sections as s', 's.id', 'v.section_id')
    .join('subjects as sub', 'sub.id', 's.subject_id')
    .where('v.id', videoId)
    .select(
      'v.id', 'v.title', 'v.description', 'v.youtube_url',
      'v.order_index', 'v.duration_seconds', 'v.section_id',
      's.title as section_title', 's.subject_id',
      'sub.title as subject_title'
    )
    .first();

  if (!video) return null;

  const { prevVideoId, nextVideoId } = await getPrevNextForVideo(video.subject_id, videoId);
  const { locked, unlockReason, prerequisiteVideoId } = await isVideoLocked(userId, videoId, video.subject_id);

  return {
    ...video,
    previous_video_id: prevVideoId,
    next_video_id: nextVideoId,
    locked,
    unlock_reason: unlockReason,
    prerequisite_video_id: prerequisiteVideoId,
  };
}
