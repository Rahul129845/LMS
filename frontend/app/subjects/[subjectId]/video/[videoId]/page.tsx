'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import { useSidebarStore } from '@/store/sidebarStore';
import { Spinner } from '@/components/common/Spinner';
import Link from 'next/link';

interface VideoData {
  id: number;
  title: string;
  description: string | null;
  youtube_url: string;
  duration_seconds: number | null;
  section_title: string;
  subject_id: number;
  subject_title: string;
  previous_video_id: number | null;
  next_video_id: number | null;
  locked: boolean;
  unlock_reason: string | null;
}

export default function VideoPage() {
  const params = useParams();
  const subjectId = String(params['subjectId']);
  const videoId = parseInt(String(params['videoId']));
  const router = useRouter();
  const { markVideoCompleted, fetchTree } = useSidebarStore();

  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startPosition, setStartPosition] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCompleted(false);

    apiClient.get(`/api/videos/${videoId}`)
      .then(async ({ data }) => {
        setVideo(data);
        if (!data.locked) {
          try {
            const { data: progress } = await apiClient.get(`/api/progress/videos/${videoId}`);
            setStartPosition(progress.last_position_seconds || 0);
          } catch { setStartPosition(0); }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [videoId]);

  const handleCompleted = () => {
    if (!video) return;
    setCompleted(true);
    markVideoCompleted(videoId);
    fetchTree(parseInt(subjectId));

    // Auto-navigate to next video after 2 seconds
    if (video.next_video_id) {
      setTimeout(() => {
        router.push(`/subjects/${subjectId}/video/${video.next_video_id}`);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Spinner />
      </div>
    );
  }

  if (!video) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Video not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href={`/subjects/${subjectId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{video.subject_title}</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{video.section_title}</span>
      </div>

      {/* Locked State */}
      {video.locked ? (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
            Lesson Locked
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '380px', margin: '0 auto' }}>
            {video.unlock_reason || 'Complete the previous lesson to unlock this one.'}
          </p>
          {video.previous_video_id && (
            <Link href={`/subjects/${subjectId}/video/${video.previous_video_id}`}>
              <button className="btn-primary" style={{ marginTop: '24px' }}>
                ← Go to Previous Lesson
              </button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Completion Banner */}
          {completed && (
            <div style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '12px',
              padding: '14px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '20px' }}>🎉</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>
                Lesson completed! {video.next_video_id ? 'Loading next lesson...' : 'You\'ve finished this course!'}
              </span>
            </div>
          )}

          {/* Video Player */}
          <VideoPlayer
            key={videoId}
            videoId={videoId}
            youtubeUrl={video.youtube_url}
            startPositionSeconds={startPosition}
            onCompleted={handleCompleted}
          />

          {/* Meta */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'var(--accent-glow)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'var(--accent)'
              }}>
                {video.section_title}
              </span>
              {video.duration_seconds && (
                <span style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                  borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'var(--text-secondary)'
                }}>
                  ⏱ {Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
              {video.title}
            </h1>
            {video.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
                {video.description}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '12px' }}>
            {video.previous_video_id ? (
              <Link href={`/subjects/${subjectId}/video/${video.previous_video_id}`} style={{ flex: 1 }}>
                <button className="btn-secondary" style={{ width: '100%' }}>← Previous</button>
              </Link>
            ) : <div style={{ flex: 1 }} />}

            {video.next_video_id ? (
              <Link href={`/subjects/${subjectId}/video/${video.next_video_id}`} style={{ flex: 1 }}>
                <button className="btn-primary" style={{ width: '100%' }}>Next →</button>
              </Link>
            ) : (
              <div style={{
                flex: 1, padding: '12px', background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px',
                textAlign: 'center', color: '#10b981', fontWeight: 600, fontSize: '14px'
              }}>
                🎓 Course Complete!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
