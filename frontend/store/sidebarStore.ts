'use client';
import { create } from 'zustand';
import apiClient from '@/lib/apiClient';

export interface SidebarVideo {
  id: number;
  title: string;
  order_index: number;
  duration_seconds: number | null;
  is_completed: boolean;
  locked: boolean;
}

export interface SidebarSection {
  id: number;
  title: string;
  order_index: number;
  videos: SidebarVideo[];
}

interface SidebarState {
  tree: SidebarSection[];
  loading: boolean;
  error: string | null;
  fetchTree: (subjectId: number) => Promise<void>;
  markVideoCompleted: (videoId: number) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  tree: [],
  loading: false,
  error: null,

  fetchTree: async (subjectId: number) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get(`/api/subjects/${subjectId}/tree`);
      set({ tree: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load course structure', loading: false });
    }
  },

  markVideoCompleted: (videoId: number) => {
    const { tree } = get();
    const updated = tree.map((section) => ({
      ...section,
      videos: section.videos.map((v) =>
        v.id === videoId ? { ...v, is_completed: true } : v
      ),
    }));
    set({ tree: updated });
  },
}));
