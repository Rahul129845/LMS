'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { Spinner } from '@/components/common/Spinner';

interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
}

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubjects = async (q?: string) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/api/subjects', { params: { q } });
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubjects(search || undefined);
  };

  const icons = ['⚡', '🐍', '🤖', '🎯', '☁️', '🔥', '💻', '🌐'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }} className="animate-fade-in-up">
        <div style={{
          display: 'inline-block', background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.3)', borderRadius: '50px',
          padding: '6px 18px', fontSize: '13px', color: '#a78bfa', marginBottom: '20px'
        }}>
          🎓 Learn at your own pace
        </div>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 800, lineHeight: 1.15, marginBottom: '20px'
        }}>
          <span className="gradient-text">Master Any Skill</span><br />
          <span style={{ color: 'var(--text-primary)' }}>with Expert-Led Courses</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '540px', margin: '0 auto 32px' }}>
          Watch curated YouTube lessons in strict sequence. Track your progress. Resume anytime.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto' }}>
          <input
            className="input-field"
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Search
          </button>
        </form>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '56px', flexWrap: 'wrap' }}>
        {[
          { label: 'Courses', value: subjects.length || '10+' },
          { label: 'Video Lessons', value: '200+' },
          { label: 'Students', value: '5K+' },
        ].map((s) => (
          <div key={s.label} className="glass" style={{ padding: '20px 32px', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Courses Grid */}
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700, marginBottom: '28px' }}>
        All Courses
      </h2>

      {loading ? (
        <Spinner />
      ) : subjects.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <p>No courses found. Check back soon!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {subjects.map((subject, i) => (
            <div key={subject.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Thumbnail */}
              <div style={{
                height: '160px',
                background: `linear-gradient(135deg, hsl(${(i * 40) % 360}, 70%, 30%), hsl(${(i * 40 + 40) % 360}, 60%, 20%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '56px',
              }}>
                {icons[i % icons.length]}
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>{subject.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px', height: '42px', overflow: 'hidden' }}>
                  {subject.description || 'A comprehensive course to master this technology.'}
                </p>
                <Link href={`/subjects/${subject.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <button className="btn-primary" style={{ width: '100%', fontSize: '14px' }}>
                    Start Learning →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
