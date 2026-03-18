'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { Spinner } from '@/components/common/Spinner';

export default function SubjectPage() {
  const params = useParams();
  const subjectId = String(params['subjectId']);
  const router = useRouter();

  useEffect(() => {
    apiClient.get(`/api/subjects/${subjectId}/first-video`)
      .then(({ data }) => {
        router.replace(`/subjects/${subjectId}/video/${data.videoId}`);
      })
      .catch(() => {
        // No videos yet — stay on this page
      });
  }, [subjectId, router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner />
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '14px' }}>
          Loading your course...
        </p>
      </div>
    </div>
  );
}
