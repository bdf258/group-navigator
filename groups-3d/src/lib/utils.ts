import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FileAction, Priority } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  p1: 'Critical',
  p2: 'Ultra High',
  p3: 'Very High',
  p4: 'High',
  p5: 'Moderate',
  p6: 'Low',
  p7: 'Very Low',
  p8: 'Minimal',
  p9: 'Trivial'
};

export function getNodeColor(action: FileAction, priority: Priority): string {
  // P1 gets the "Bright" (500/600) color.
  // All others get the "Dark" (900) color.
  
  const isHighest = priority === 'p1';

  const palette = {
    paid: {
      bright: '#22c55e', // Green 500
      dark: '#14532d',   // Green 900
    },
    pending: {
      bright: '#eab308', // Yellow 500
      dark: '#422006',   // Yellow 950/Brown 900
    },
    rejected: {
      bright: '#ef4444', // Red 500
      dark: '#7f1d1d',   // Red 900
    }
  };

  return isHighest ? palette[action].bright : palette[action].dark;
}