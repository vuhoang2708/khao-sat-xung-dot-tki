export type TKIMode = 'competing' | 'collaborating' | 'compromising' | 'avoiding' | 'accommodating';

export type TKICode = 'CP' | 'CL' | 'CO' | 'AV' | 'AC';

export type PercentileLevel = 'low' | 'medium' | 'high';

export type AssessmentMode = 'local_anonymous' | 'cloud_sync';

export interface TKIQuestionOption {
  label: 'A' | 'B';
  text: string;
  mode: TKIMode;
  code: TKICode;
}

export interface TKIQuestionItem {
  id: number;
  options: {
    A: TKIQuestionOption;
    B: TKIQuestionOption;
  };
}

export interface UserProfile {
  fullName: string;
  email: string;
  organizationOrRole: string;
  mode: AssessmentMode;
}

export interface ModeScore {
  mode: TKIMode;
  code: TKICode;
  rawScore: number; // 0 - 12
  maxScore: number; // 12
  percentage: number; // rawScore / 30 * 100
  percentileLevel: PercentileLevel;
  percentileLabel: string; // Thấp (0-25%), Trung bình (25-75%), Cao (75-100%)
  normDescription: string;
}

export interface ModeProfile {
  id: TKIMode;
  code: TKICode;
  vietnameseName: string;
  englishName: string;
  tagline: string;
  icon: string;
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    glow: string;
  };
  dimensions: {
    assertiveness: 'Cao' | 'Vừa' | 'Thấp';
    cooperativeness: 'Cao' | 'Vừa' | 'Thấp';
    winLoseRatio: string;
  };
  overview: string;
  whenToUse: string[];
  strengths: string[];
  overuseRisks: string[]; // Rủi ro khi lạm dụng (>75%)
  underuseRisks: string[]; // Rủi ro khi thiếu hụt (<25%)
  eiReflectionQuestions: string[]; // Tự vấn trí tuệ cảm xúc
  nvcActionSteps: string[]; // 4 bước giao tiếp trắc ẩn NVC
  communicationTips: string[];
  collaborationTips: {
    targetMode: TKIMode;
    advice: string;
  }[];
}

export interface UserAnswerRecord {
  questionId: number;
  selectedOption: 'A' | 'B';
  selectedText: string;
  mode: TKIMode;
  code: TKICode;
}

export interface TKIAssessmentResult {
  dominantMode: TKIMode;
  secondaryMode: TKIMode;
  scores: Record<TKIMode, ModeScore>;
  totalScore: number;
  userProfile: UserProfile;
  answers: Record<number, 'A' | 'B'>;
  answerRecords: UserAnswerRecord[];
  completedAt: string;
  overusedModes: TKIMode[];
  underusedModes: TKIMode[];
  matrixCoords: {
    assertiveness: number; // 0 - 100
    cooperativeness: number; // 0 - 100
  };
}
