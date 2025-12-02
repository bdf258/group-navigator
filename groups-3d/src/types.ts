import { Dayjs } from 'dayjs';

export type Priority = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9';

export type NodeShape = 'box' | 'sphere' | 'cone' | 'cylinder' | 'torus' | 'dodecahedron' | 'octahedron' | 'icosahedron';

export interface Person {
  id: string;
  name: string;
  shape: NodeShape;
}

export interface Group {
  id: string;
  name: string;
  yIndex: number;
}

export type FileAction = 'paid' | 'pending' | 'rejected';

export interface FileNode {
  id: string;
  name: string;
  groupId: string;
  personId: string;
  date: string; // ISO String (Date + Time)
  action: FileAction;
  priority: Priority;
}

export interface GeneratedData {
  people: Person[];
  groups: Group[];
  files: FileNode[];
  startDate: Dayjs;
}

export type ViewMode = 'front' | 'top' | 'side';

export interface FilterState {
  groupId: string | null;
  priority: Priority | null;
  date: string | null; // ISO Date String (YYYY-MM-DD)
}