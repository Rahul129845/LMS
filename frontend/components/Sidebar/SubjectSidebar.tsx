'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  subjectId: number;
  subjectTitle: string;
}

export function SubjectSidebar({ subjectId, subjectTitle }: Props) {
  const { tree, loading } = useSidebarStore();
  const pathname = usePathname();

  if (loading) {
    return (
      <div style={{ padding: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
        Loading course...
      </div>
    );
  }

  const totalVideos = tree.reduce((acc, s) => acc + s.videos.length, 0);
  const completedVideos = tree.reduce((acc, s) => acc + s.videos.filter(v => v.is_completed).length, 0);
  const percent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Subject header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          {subjectTitle}
        </h2>
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>{completedVideos}/{totalVideos} lessons</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Sections & Videos */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '8px 8px' }}>
        {tree.map((section) => (
          <div key={section.id} style={{ marginBottom: '12px' }}>
            <div style={{
              padding: '8px 12px',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              color: 'var(--text-muted)', textTransform: 'uppercase',
            }}>
              {section.title}
            </div>
            {section.videos.map((video) => {
              const href = `/subjects/${subjectId}/video/${video.id}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={video.id}
                  href={video.locked ? '#' : href}
                  className={`sidebar-video-item ${isActive ? 'active' : ''} ${video.locked ? 'locked' : ''}`}
                  onClick={(e) => { if (video.locked) e.preventDefault(); }}
                >
                  {/* Icon */}
                  <span style={{ fontSize: '14px', flexShrink: 0 }}>
                    {video.locked ? '🔒' : video.is_completed ? '✅' : '▶️'}
                  </span>
                  {/* Title */}
                  <span style={{
                    flex: 1, fontSize: '13px', lineHeight: 1.3,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {video.title}
                  </span>
                  {/* Duration */}
                  {video.duration_seconds && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {formatDuration(video.duration_seconds)}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
