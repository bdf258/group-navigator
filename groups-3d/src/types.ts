import { Dayjs } from 'dayjs';

export interface Person {
  id: string;
  name: string;
  color: string;
  zIndex: number;
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
  date: string; // ISO String
  action: FileAction;
  color: string;
}

export interface GeneratedData {
  people: Person[];
  groups: Group[];
  files: FileNode[];
  startDate: Dayjs;
}

export type ViewMode = 'grid' | 'fly' | 'top' | 'side';