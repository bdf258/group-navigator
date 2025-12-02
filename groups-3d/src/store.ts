import { create } from 'zustand';
import type { ViewMode } from './types';

interface Dimensions {
  dayWidth: number;
  groupHeight: number;
  personDepth: number;
}

interface StoreState {
  // State
  scrollX: number;
  scrollY: number;
  scrollZ: number;
  zoomLevel: number;
  viewMode: ViewMode;
  pixelsPerUnit: number;
  dimensions: Dimensions;

  // Actions
  setScrollX: (val: number) => void;
  setScrollY: (val: number) => void;
  setScrollZ: (val: number) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useStore = create<StoreState>((set) => ({
  scrollX: 0,
  scrollY: 0,
  scrollZ: 10,
  
  zoomLevel: 1, 
  viewMode: 'grid', 
  
  pixelsPerUnit: 50, 

  dimensions: {
    dayWidth: 2,   
    groupHeight: 1.5, 
    personDepth: 5,   
  },

  setScrollX: (val) => set({ scrollX: val }),
  setScrollY: (val) => set({ scrollY: val }),
  setScrollZ: (val) => set({ scrollZ: val }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));