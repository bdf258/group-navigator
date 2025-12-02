import { create } from 'zustand';
import type { ViewMode, FileNode, Priority, FilterState } from './types';

interface Dimensions {
  dayWidth: number;
  groupHeight: number;
  priorityDepth: number;
}

interface StoreState {
  // Navigation State
  scrollX: number;
  scrollY: number;
  
  viewMode: ViewMode;
  pixelsPerUnit: number;
  dimensions: Dimensions;

  // Selection / Filter State
  selectedFile: FileNode | null;
  filters: FilterState;

  // Actions
  setScrollX: (val: number) => void;
  setScrollY: (val: number) => void;
  setViewMode: (mode: ViewMode) => void;
  
  // Selection Actions
  selectFile: (file: FileNode | null) => void;
  
  // Filter Actions
  setFilterGroup: (groupId: string | null) => void;
  setFilterPriority: (priority: Priority | null) => void;
  setFilterDate: (date: string | null) => void;
  clearFilters: () => void;
}

export const useStore = create<StoreState>((set) => ({
  scrollX: 0,
  scrollY: 0,
  
  viewMode: 'front', 
  pixelsPerUnit: 50, 

  dimensions: {
    dayWidth: 4,     
    groupHeight: 4, 
    priorityDepth: 8, 
  },

  selectedFile: null,
  filters: {
    groupId: null,
    priority: null,
    date: null
  },

  setScrollX: (val) => set({ scrollX: val }),
  setScrollY: (val) => set({ scrollY: val }),
  setViewMode: (mode) => set({ viewMode: mode }),

  selectFile: (file) => set({ selectedFile: file }),
  
  setFilterGroup: (groupId) => set((state) => ({ 
    filters: { ...state.filters, groupId: state.filters.groupId === groupId ? null : groupId },
    selectedFile: null 
  })),
  
  setFilterPriority: (priority) => set((state) => ({ 
    filters: { ...state.filters, priority: state.filters.priority === priority ? null : priority },
    selectedFile: null
  })),
  
  setFilterDate: (date) => set((state) => ({ 
    filters: { ...state.filters, date: state.filters.date === date ? null : date },
    selectedFile: null
  })),

  clearFilters: () => set({ 
    filters: { groupId: null, priority: null, date: null },
    selectedFile: null 
  })
}));