export interface Document {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  type: 'pdf' | 'txt' | 'docx';
  size: number;
}

export interface Conflict {
  id: string;
  type: 'contradiction' | 'overlap' | 'inconsistency';
  severity: 'high' | 'medium' | 'low';
  documents: string[];
  description: string;
  suggestions: string[];
  conflictingText: {
    document: string;
    text: string;
    context: string;
  }[];
}

export interface Report {
  id: string;
  generatedAt: Date;
  documents: string[];
  conflicts: Conflict[];
  totalConflicts: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  status: 'completed' | 'processing' | 'failed';
}

export interface UsageStats {
  documentsAnalyzed: number;
  reportsGenerated: number;
  totalBilling: number;
  currentMonthBilling: number;
  lastAnalysis: Date | null;
}

export interface ExternalSource {
  id: string;
  name: string;
  url: string;
  lastChecked: Date;
  hasUpdates: boolean;
  conflicts?: Conflict[];
}