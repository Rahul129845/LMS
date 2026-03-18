import db from '../../config/db';

export async function getVideoProgress(userId: number, videoId: number) {
  const row = await db('video_progress')
    .where({ user_id: userId, video_id: videoId })
    .first();
  return {
    last_position_seconds: row?.last_position_seconds ?? 0,
    is_completed: row?.is_completed === 1 || row?.is_completed === true || false,
  };
}

export async function upsertVideoProgress(
  userId: number,
  videoId: number,
  data: { last_position_seconds: number; is_completed?: boolean }
) {
  // Get video duration for capping
  const video = await db('videos').where({ id: videoId }).select('duration_seconds').first();
  let cappedPosition = Math.max(0, data.last_position_seconds);
  if (video?.duration_seconds) {
    cappedPosition = Math.min(cappedPosition, video.duration_seconds);
  }

  const existing = await db('video_progress')
    .where({ user_id: userId, video_id: videoId })
    .first();

  const now = new Date();

  if (existing) {
    const updateData: Record<string, unknown> = {
      last_position_seconds: cappedPosition,
      updated_at: now,
    };
    if (data.is_completed && !existing.is_completed) {
      updateData['is_completed'] = true;
      updateData['completed_at'] = now;
    }
    await db('video_progress')
      .where({ user_id: userId, video_id: videoId })
      .update(updateData);
  } else {
    const isCompleted = data.is_completed === true;
    await db('video_progress').insert({
      user_id: userId,
      video_id: videoId,
      last_position_seconds: cappedPosition,
      is_completed: isCompleted,
      completed_at: isCompleted ? now : null,
      created_at: now,
      updated_at: now,
    });
  }

  return getVideoProgress(userId, videoId);
}

export async function getSubjectProgress(userId: number, subjectId: number) {
  // Get all video IDs for this subject
  const videos = await db('videos as v')
    .join('sections as s', 's.id', 'v.section_id')
    .where('s.subject_id', subjectId)
    .select('v.id');

  const totalVideos = videos.length;
  if (totalVideos === 0) {
    return { total_videos: 0, completed_videos: 0, percent_complete: 0, last_video_id: null, last_position_seconds: null };
  }

  const videoIds = videos.map((v: any) => v.id);

  const progressRecords = await db('video_progress')
    .where({ user_id: userId })
    .whereIn('video_id', videoIds)
    .select('video_id', 'is_completed', 'last_position_seconds', 'updated_at')
    .orderBy('updated_at', 'desc');

  const completedVideos = progressRecords.filter(
    (p: any) => p.is_completed === 1 || p.is_completed === true
  ).length;

  const lastRecord = progressRecords[0];

  return {
    total_videos: totalVideos,
    completed_videos: completedVideos,
    percent_complete: Math.round((completedVideos / totalVideos) * 100),
    last_video_id: lastRecord?.video_id ?? null,
    last_position_seconds: lastRecord?.last_position_seconds ?? null,
  };
}
