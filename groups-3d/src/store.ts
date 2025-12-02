import { create } from 'zustand';
import type { ViewMode, FileNode } from './types';

interface Dimensions {
  dayWidth: number;
  groupHeight: number;
  personDepth: number;
}

interface StoreState {
  // Navigation State
  scrollX: number;
  scrollY: number; // Added vertical scroll state
  
  viewMode: ViewMode;
  pixelsPerUnit: number;
  dimensions: Dimensions;

  // Selection State
  selectedFile: FileNode | null;
  selectedPersonId: string | null;
  selectedGroupId: string | null;

  // Actions
  setScrollX: (val: number) => void;
  setScrollY: (val: number) => void; // Added setter
  setViewMode: (mode: ViewMode) => void;
  
  // Selection Actions
  selectFile: (file: FileNode | null) => void;
  selectPerson: (personId: string | null) => void;
  selectGroup: (groupId: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  scrollX: 0,
  scrollY: 0,
  
  viewMode: 'front', 
  pixelsPerUnit: 50, 

  dimensions: {
    dayWidth: 4,     
    groupHeight: 4, 
    personDepth: 8,  
  },

  selectedFile: null,
  selectedPersonId: null,
  selectedGroupId: null,

  setScrollX: (val) => set({ scrollX: val }),
  setScrollY: (val) => set({ scrollY: val }),
  setViewMode: (mode) => set({ viewMode: mode }),

  selectFile: (file) => set({ 
    selectedFile: file, 
    selectedPersonId: null,
    selectedGroupId: null
  }),
  selectPerson: (personId) => set({ 
    selectedPersonId: personId, 
    selectedFile: null,
    selectedGroupId: null
  }),
  selectGroup: (groupId) => set({
    selectedGroupId: groupId,
    selectedFile: null,
    selectedPersonId: null
  })
}));