'use client';
import { create } from 'zustand';

interface VideoState {
  currentVideoId: number | null;
  youtubeUrl: string | null;
  duration: number | null;
  isPlaying: boolean;
  isCompleted: boolean;
  nextVideoId: number | null;
  prevVideoId: number | null;
  setVideo: (data: {
    videoId: number;
    youtubeUrl: string;
    duration: number | null;
    nextVideoId: number | null;
    prevVideoId: number | null;
  }) => void;
  setPlaying: (val: boolean) => void;
  setCompleted: (val: boolean) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideoId: null,
  youtubeUrl: null,
  duration: null,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,

  setVideo: (data) =>
    set({
      currentVideoId: data.videoId,
      youtubeUrl: data.youtubeUrl,
      duration: data.duration,
      nextVideoId: data.nextVideoId,
      prevVideoId: data.prevVideoId,
      isCompleted: false,
      isPlaying: false,
    }),

  setPlaying: (val) => set({ isPlaying: val }),
  setCompleted: (val) => set({ isCompleted: val }),
  reset: () =>
    set({
      currentVideoId: null,
      youtubeUrl: null,
      duration: null,
      isPlaying: false,
      isCompleted: false,
      nextVideoId: null,
      prevVideoId: null,
    }),
}));
