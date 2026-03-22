'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Spinner } from '../common/Spinner';

interface AiPanelProps {
  videoTitle: string;
  videoDescription: string | null;
}

export function AiPanel({ videoTitle, videoDescription }: AiPanelProps) {
  const [activeTab, setActiveTab] = useState<'summarize' | 'ask' | 'quiz'>('summarize');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tab states
  const [summary, setSummary] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<string | null>(null);

  const contextText = `${videoTitle}: ${videoDescription || ''}`;

  const handleSummarize = async () => {
    if (!videoDescription) {
       setError("No description available to summarize.");
       return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/api/ai/summarize', { text: videoDescription });
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to summarize text");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/api/ai/ask', { 
        question, 
        context: contextText 
      });
      setAnswer(data.answer);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to get an answer");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/api/ai/quiz', { 
        topic: videoTitle, 
        context: contextText 
      });
      setQuiz(data.quiz);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginTop: '32px',
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      {/* Header Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.02)'
      }}>
        {(['summarize', 'ask', 'quiz'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: activeTab === tab ? 'transparent' : 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            {tab === 'ask' ? 'Ask a Question' : tab === 'quiz' ? 'Generate Quiz' : 'Summarize'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '24px' }}>
        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Summarize Tab */}
        {activeTab === 'summarize' && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '15px' }}>
              Want a quick overview? Generate an AI summary of this lesson's description.
            </p>
            {!summary ? (
              <button 
                onClick={handleSummarize} 
                disabled={loading || !videoDescription}
                className="btn-primary"
              >
                {loading ? <Spinner /> : 'Generate Summary'}
              </button>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--accent)', fontFamily: 'Outfit, sans-serif' }}>✨ AI Summary</h4>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{summary}</p>
              </div>
            )}
            {!videoDescription && <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px' }}>This video has no description to summarize.</p>}
          </div>
        )}

        {/* Ask Tab */}
        {activeTab === 'ask' && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '15px' }}>
              Ask any question about this lesson. The AI will answer based on the context.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input 
                type="text" 
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="e.g. What is the main topic?"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-dark)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
              />
              <button onClick={handleAsk} disabled={loading || !question.trim()} className="btn-primary">
                {loading ? <Spinner /> : 'Ask AI'}
              </button>
            </div>
            {answer && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--accent)', fontFamily: 'Outfit, sans-serif' }}>🤖 AI Answer</h4>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{answer}</p>
              </div>
            )}
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '15px' }}>
              Test your knowledge! Generate practice questions based on this lesson.
            </p>
            {!quiz ? (
              <button 
                onClick={handleGenerateQuiz} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? <Spinner /> : 'Generate Quiz Questions'}
              </button>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <h4 style={{ marginBottom: '16px', color: 'var(--accent)', fontFamily: 'Outfit, sans-serif' }}>🧠 Test Your Knowledge</h4>
                 <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                   {quiz}
                 </div>
              </div>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px' }}>
              Note: AI-generated questions can sometimes be inaccurate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
