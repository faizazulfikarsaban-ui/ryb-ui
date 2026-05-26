export type WoundCategory = 'PROTEKSI' | 'DEBRIDEMENT' | 'NEKREKTOMI';

export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: string;
  uploadTime: string;
  red: number;
  yellow: number;
  black: number;
  dominantText: string;
  category: WoundCategory;
  notes: string;
  action: string;
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface SystemConfig {
  autoSave: boolean;
  defaultTemplate: string;
  enableAlerts: boolean;
}
