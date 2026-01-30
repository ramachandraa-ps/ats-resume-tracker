export interface AtsScoreBreakdown {
  score: number;
  maxScore: number;
  reason: string;
}

export interface ImprovementTip {
  type: 'critical' | 'important' | 'minor';
  text: string;
}

export interface SectionAnalysis {
  name: string;
  status: 'present' | 'missing' | 'incomplete';
  feedback: string;
}

export interface KeywordAnalysis {
  found: string[];
  missing: string[];
}

export interface AnalysisResult {
  overallScore: number; // 0-100
  summary: string;
  formatting: {
    score: number;
    issues: string[];
  };
  keywords: KeywordAnalysis;
  sections: SectionAnalysis[];
  improvements: ImprovementTip[];
}

export enum AnalysisState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
