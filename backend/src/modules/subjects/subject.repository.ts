import db from '../../config/db';

export interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function listPublishedSubjects(page = 1, pageSize = 12, q?: string) {
  const query = db<Subject>('subjects').where({ is_published: true });
  if (q) {
    query.where('title', 'like', `%${q}%`);
  }

  const total = await query.clone().count<{ count: string }>('id as count').first();
  const subjects = await query
    .orderBy('created_at', 'desc')
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .select('id', 'title', 'slug', 'description', 'thumbnail_url', 'created_at');

  return {
    subjects,
    total: parseInt(total?.count || '0'),
    page,
    pageSize,
  };
}

export async function findSubjectById(id: number): Promise<Subject | undefined> {
  return db<Subject>('subjects').where({ id, is_published: true }).first();
}

export async function getSubjectTree(subjectId: number, userId: number) {
  // Fetch sections
  const sections = await db('sections')
    .where({ subject_id: subjectId })
    .orderBy('order_index')
    .select('id', 'title', 'order_index');

  if (sections.length === 0) return [];

  const sectionIds = sections.map((s: any) => s.id);

  // Fetch videos for all sections
  const videos = await db('videos')
    .whereIn('section_id', sectionIds)
    .orderBy('order_index')
    .select('id', 'section_id', 'title', 'order_index', 'duration_seconds', 'youtube_url');

  // Fetch user progress for all videos
  const videoIds = videos.map((v: any) => v.id);
  const progressRecords = videoIds.length > 0
    ? await db('video_progress')
        .where({ user_id: userId })
        .whereIn('video_id', videoIds)
        .select('video_id', 'is_completed', 'last_position_seconds')
    : [];

  const progressMap = new Map<number, { is_completed: boolean; last_position_seconds: number }>();
  for (const p of progressRecords) {
    progressMap.set(p.video_id, {
      is_completed: p.is_completed === 1 || p.is_completed === true,
      last_position_seconds: p.last_position_seconds,
    });
  }

  // Build global sequence for lock checking
  const globalSequence = videos.map((v: any) => v.id);

  // Build tree with locked/completed flags
  return sections.map((section: any) => {
    const sectionVideos = videos
      .filter((v: any) => v.section_id === section.id)
      .map((v: any) => {
        const idx = globalSequence.indexOf(v.id);
        const prevId = idx > 0 ? globalSequence[idx - 1] : null;
        const prereqProgress = prevId ? progressMap.get(prevId) : null;
        const locked = prevId !== null && !prereqProgress?.is_completed;
        const progress = progressMap.get(v.id);

        return {
          id: v.id,
          title: v.title,
          order_index: v.order_index,
          duration_seconds: v.duration_seconds,
          is_completed: progress?.is_completed ?? false,
          locked,
        };
      });

    return {
      id: section.id,
      title: section.title,
      order_index: section.order_index,
      videos: sectionVideos,
    };
  });
}

export async function getFirstUnlockedVideo(subjectId: number, userId: number): Promise<number | null> {
  const sections = await db('sections')
    .where({ subject_id: subjectId })
    .orderBy('order_index')
    .select('id');

  if (sections.length === 0) return null;

  const sectionIds = sections.map((s: any) => s.id);
  const videos = await db('videos')
    .whereIn('section_id', sectionIds)
    .orderBy(['section_id', 'order_index'])
    .select('id');

  if (videos.length === 0) return null;

  // First video is always unlocked
  const firstVideoId = videos[0].id;

  // Find first video that isn't completed yet (for resume)
  const progressRecords = await db('video_progress')
    .where({ user_id: userId })
    .whereIn('video_id', videos.map((v: any) => v.id))
    .select('video_id', 'is_completed');

  const completedIds = new Set(
    progressRecords
      .filter((p: any) => p.is_completed === 1 || p.is_completed === true)
      .map((p: any) => p.video_id)
  );

  for (const v of videos) {
    if (!completedIds.has(v.id)) {
      return v.id;
    }
  }

  return firstVideoId;
}
