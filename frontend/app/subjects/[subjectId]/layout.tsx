'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { SubjectSidebar } from '@/components/Sidebar/SubjectSidebar';
import { useSidebarStore } from '@/store/sidebarStore';
import apiClient from '@/lib/apiClient';
import { useState } from 'react';

interface Subject {
  id: number;
  title: string;
}

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const subjectId = parseInt(String(params['subjectId']));
  const { fetchTree } = useSidebarStore();
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchTree(subjectId);
    apiClient.get(`/api/subjects/${subjectId}`)
      .then(({ data }) => setSubject(data))
      .catch(console.error);
  }, [subjectId, fetchTree]);

  return (
    <AuthGuard>
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '300px',
          minWidth: '300px',
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          overflowY: 'auto',
        }}>
          <SubjectSidebar
            subjectId={subjectId}
            subjectTitle={subject?.title || ''}
          />
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
