'use client';
import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { Spinner } from '@/components/common/Spinner';
import Link from 'next/link';

interface SubjectProgress {
  id: number;
  title: string;
  total_videos: number;
  completed_videos: number;
  percent_complete: number;
  last_video_id: number | null;
}

interface Subject {
  id: number;
  title: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [progressList, setProgressList] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await apiClient.get('/api/subjects', { params: { pageSize: 50 } });
        const subjects: Subject[] = data.subjects || [];

        const progressData = await Promise.all(
          subjects.map(async (s) => {
            try {
              const { data: p } = await apiClient.get(`/api/progress/subjects/${s.id}`);
              return { id: s.id, title: s.title, ...p };
            } catch {
              return { id: s.id, title: s.title, total_videos: 0, completed_videos: 0, percent_complete: 0, last_video_id: null };
            }
          })
        );
        setProgressList(progressData.filter((p) => p.total_videos > 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalCompleted = progressList.reduce((acc, p) => acc + p.completed_videos, 0);
  const totalVideos = progressList.reduce((acc, p) => acc + p.total_videos, 0);

  return (
    <AuthGuard>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div className="glass" style={{ borderRadius: '20px', padding: '32px', marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 700, color: 'white', flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700 }}>{user?.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{user?.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>{totalCompleted}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lessons Completed</div>
          </div>
        </div>

        {/* Progress Overview */}
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
          📊 My Learning Progress
        </h2>

        {loading ? (
          <Spinner />
        ) : progressList.length === 0 ? (
          <div className="glass" style={{ borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              You haven't started any courses yet.
            </p>
            <Link href="/">
              <button className="btn-primary" style={{ marginTop: '20px' }}>Browse Courses</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {progressList.map((p) => (
              <div key={p.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{p.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {p.completed_videos} / {p.total_videos} lessons completed
                    </p>
                  </div>
                  <div style={{
                    background: p.percent_complete === 100 ? 'rgba(16,185,129,0.15)' : 'var(--accent-glow)',
                    color: p.percent_complete === 100 ? '#10b981' : 'var(--accent)',
                    border: `1px solid ${p.percent_complete === 100 ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                    borderRadius: '20px', padding: '4px 14px',
                    fontSize: '13px', fontWeight: 700,
                  }}>
                    {p.percent_complete}%
                  </div>
                </div>
                <div className="progress-bar" style={{ marginBottom: '12px' }}>
                  <div className="progress-bar-fill" style={{ width: `${p.percent_complete}%` }} />
                </div>
                <Link href={p.last_video_id ? `/subjects/${p.id}/video/${p.last_video_id}` : `/subjects/${p.id}`}>
                  <button className="btn-secondary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                    {p.percent_complete === 100 ? '🎓 Review Course' : '▶️ Continue Learning'}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
