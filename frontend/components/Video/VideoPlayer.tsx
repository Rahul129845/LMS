'use client';
import { useEffect, useRef, useCallback } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { sendProgress, sendProgressImmediate } from '@/lib/progress';

interface VideoPlayerProps {
  videoId: number;
  youtubeUrl: string;
  startPositionSeconds?: number;
  onProgress?: (seconds: number) => void;
  onCompleted?: () => void;
}

function extractVideoId(url: string): string {
  // Handle full YouTube URLs or bare video IDs
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('v') || parsed.pathname.split('/').pop() || url;
  } catch {
    return url; // Assume it's already a bare video ID
  }
}

export function VideoPlayer({
  videoId,
  youtubeUrl,
  startPositionSeconds = 0,
  onProgress,
  onCompleted,
}: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const ytVideoId = extractVideoId(youtubeUrl);

  const clearTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTracking = useCallback(() => {
    clearTracking();
    intervalRef.current = setInterval(async () => {
      if (!playerRef.current) return;
      try {
        const currentTime = await playerRef.current.getCurrentTime();
        onProgress?.(Math.floor(currentTime));
        sendProgress(videoId, { last_position_seconds: Math.floor(currentTime) });
      } catch { /* player destroyed */ }
    }, 5000);
  }, [videoId, onProgress, clearTracking]);

  useEffect(() => {
    completedRef.current = false;
    return () => clearTracking();
  }, [videoId, clearTracking]);

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    if (startPositionSeconds > 0) {
      event.target.seekTo(startPositionSeconds - 2, true);
    }
  };

  const onStateChange = async (event: YouTubeEvent) => {
    const state = event.data;
    // PLAYING = 1
    if (state === 1) {
      startTracking();
    }
    // PAUSED = 2, ENDED = 0
    if (state === 2 || state === 0) {
      clearTracking();
      try {
        const currentTime = await playerRef.current?.getCurrentTime();
        if (currentTime) {
          sendProgress(videoId, { last_position_seconds: Math.floor(currentTime) });
        }
      } catch { /* ignore */ }
    }
    // ENDED = 0
    if (state === 0 && !completedRef.current) {
      completedRef.current = true;
      try {
        const duration = await playerRef.current?.getDuration();
        await sendProgressImmediate(videoId, {
          last_position_seconds: Math.floor(duration || 0),
          is_completed: true,
        });
      } catch { /* ignore */ }
      onCompleted?.();
    }
  };

  return (
    <div style={{
      width: '100%',
      background: '#000',
      borderRadius: '12px',
      overflow: 'hidden',
      aspectRatio: '16/9',
      position: 'relative',
    }}>
      <YouTube
        videoId={ytVideoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            start: startPositionSeconds > 2 ? startPositionSeconds - 2 : 0,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
