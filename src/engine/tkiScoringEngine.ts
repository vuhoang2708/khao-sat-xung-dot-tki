import {
  TKIMode,
  TKICode,
  PercentileLevel,
  ModeScore,
  TKIAssessmentResult,
  UserProfile,
  UserAnswerRecord,
} from '../types/tki';
import { QUESTIONS_30 } from '../data/questions30';

// Norms definition from PDF Page 5
interface NormRange {
  lowMax: number;
  medMax: number;
  lowDesc: string;
  medDesc: string;
  highDesc: string;
}

const TKI_NORMS: Record<TKIMode, NormRange> = {
  competing: {
    lowMax: 3,
    medMax: 8,
    lowDesc: 'Thấp (Điểm 0 - 3): Ít khi dùng quyền lực để giải quyết',
    medDesc: 'Trung bình (Điểm 4 - 8): Hành vi quyết đoán vừa phải',
    highDesc: 'Cao (Điểm 9 - 12): Lạm dụng phong cách quyền lực áp đặt',
  },
  collaborating: {
    lowMax: 5,
    medMax: 9,
    lowDesc: 'Thấp (Điểm 0 - 5): Bỏ lỡ cơ hội đột phá cùng thắng',
    medDesc: 'Trung bình (Điểm 6 - 9): Hành vi tích hợp lý tưởng',
    highDesc: 'Cao (Điểm 10 - 12): Tốn nhiều thời gian và năng lượng',
  },
  compromising: {
    lowMax: 4,
    medMax: 9,
    lowDesc: 'Thấp (Điểm 0 - 4): Thiếu linh hoạt trong đàm phán chia sẻ',
    medDesc: 'Trung bình (Điểm 5 - 9): Hành vi đàm phán thực tế, ôn hòa',
    highDesc: 'Cao (Điểm 10 - 12): Thỏa hiệp vội vã, giải pháp chưa tối ưu',
  },
  avoiding: {
    lowMax: 4,
    medMax: 8,
    lowDesc: 'Thấp (Điểm 0 - 4): Dễ bị cuốn vào các tranh cãi không cần thiết',
    medDesc: 'Trung bình (Điểm 5 - 8): Hành vi phòng thủ và hoãn binh lành mạnh',
    highDesc: 'Cao (Điểm 9 - 12): Né tránh mâu thuẫn hệ thống kéo dài',
  },
  accommodating: {
    lowMax: 2,
    medMax: 7,
    lowDesc: 'Thấp (Điểm 0 - 2): Khó thừa nhận nhượng bộ, dễ bị xem là cứng nhắc',
    medDesc: 'Trung bình (Điểm 3 - 7): Hành vi nhường nhịn và xoa dịu ôn hòa',
    highDesc: 'Cao (Điểm 8 - 12): Dễ chịu thiệt thòi hoặc tích tụ ấm ức',
  },
};

const MODE_CODES: Record<TKIMode, TKICode> = {
  competing: 'CP',
  collaborating: 'CL',
  compromising: 'CO',
  avoiding: 'AV',
  accommodating: 'AC',
};

const ALL_MODES: TKIMode[] = [
  'competing',
  'collaborating',
  'compromising',
  'avoiding',
  'accommodating',
];

export function calculateTKIAssessment(
  answersMap: Record<number, 'A' | 'B'>,
  userProfile: UserProfile
): TKIAssessmentResult {
  const rawCounts: Record<TKIMode, number> = {
    competing: 0,
    collaborating: 0,
    compromising: 0,
    avoiding: 0,
    accommodating: 0,
  };

  const answerRecords: UserAnswerRecord[] = [];
  let totalScore = 0;

  QUESTIONS_30.forEach((q) => {
    const selected = answersMap[q.id];
    if (selected && q.options[selected]) {
      const opt = q.options[selected];
      rawCounts[opt.mode] += 1;
      totalScore += 1;

      answerRecords.push({
        questionId: q.id,
        selectedOption: selected,
        selectedText: opt.text,
        mode: opt.mode,
        code: opt.code,
      });
    }
  });

  const scores: Record<TKIMode, ModeScore> = {} as Record<TKIMode, ModeScore>;
  const overusedModes: TKIMode[] = [];
  const underusedModes: TKIMode[] = [];

  ALL_MODES.forEach((mode) => {
    const raw = rawCounts[mode];
    const norm = TKI_NORMS[mode];
    let level: PercentileLevel = 'medium';
    let label = 'Trung bình (Phân vị 25% - 75%)';
    let normDesc = norm.medDesc;

    if (raw <= norm.lowMax) {
      level = 'low';
      label = 'Thấp (Phân vị 0% - 25%)';
      normDesc = norm.lowDesc;
      underusedModes.push(mode);
    } else if (raw > norm.medMax) {
      level = 'high';
      label = 'Cao (Phân vị 75% - 100%)';
      normDesc = norm.highDesc;
      overusedModes.push(mode);
    }

    const percentage = Math.round((raw / 30) * 100);

    scores[mode] = {
      mode,
      code: MODE_CODES[mode],
      rawScore: raw,
      maxScore: 12,
      percentage,
      percentileLevel: level,
      percentileLabel: label,
      normDescription: normDesc,
    };
  });

  // Sort by rawScore descending
  // Tie-breaker priority: collaborating > competing > compromising > accommodating > avoiding
  const tieBreakerOrder: Record<TKIMode, number> = {
    collaborating: 5,
    competing: 4,
    compromising: 3,
    accommodating: 2,
    avoiding: 1,
  };

  const sortedModes = [...ALL_MODES].sort((a, b) => {
    if (scores[b].rawScore !== scores[a].rawScore) {
      return scores[b].rawScore - scores[a].rawScore;
    }
    return tieBreakerOrder[b] - tieBreakerOrder[a];
  });

  const dominantMode = sortedModes[0];
  const secondaryMode = sortedModes[1];

  // 2D Matrix Centroid Coordinates (Assertiveness Y, Cooperativeness X)
  // Max potential weighted sum is 12 + 12 + 6 = 30
  const assertivenessRaw =
    scores.competing.rawScore * 1.0 +
    scores.collaborating.rawScore * 1.0 +
    scores.compromising.rawScore * 0.5;

  const cooperativenessRaw =
    scores.collaborating.rawScore * 1.0 +
    scores.accommodating.rawScore * 1.0 +
    scores.compromising.rawScore * 0.5;

  // Scale to 0 - 100%
  const assertiveness = Math.min(100, Math.max(0, Math.round((assertivenessRaw / 24) * 100)));
  const cooperativeness = Math.min(100, Math.max(0, Math.round((cooperativenessRaw / 24) * 100)));

  return {
    dominantMode,
    secondaryMode,
    scores,
    totalScore,
    userProfile,
    answers: answersMap,
    answerRecords,
    completedAt: new Date().toISOString(),
    overusedModes,
    underusedModes,
    matrixCoords: {
      assertiveness,
      cooperativeness,
    },
  };
}
