'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, initialize, logout } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108,99,255,0.15)',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: '22px',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            🎓 LearnLMS
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Hi, {user?.name}
              </span>
              <Link href="/profile" style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Profile
              </Link>
              <button
                onClick={() => logout().then(() => window.location.href = '/')}
                className="btn-secondary"
                style={{ padding: '8px 20px', fontSize: '14px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
