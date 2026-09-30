import React from 'react';
import { TKIMode, TKIAssessmentResult } from '../types/tki';
import { TKI_PROFILES } from '../data/tkiProfiles';
import { Radar } from 'lucide-react';

interface TKIRadarChartProps {
  result: TKIAssessmentResult;
}

export const TKIRadarChart: React.FC<TKIRadarChartProps> = ({ result }) => {
  const { scores } = result;

  // 5 Modes in clockwise order:
  // 1. Competing (Top, angle = -90 deg)
  // 2. Collaborating (Top-Right, angle = -18 deg)
  // 3. Compromising (Bottom-Right, angle = 54 deg)
  // 4. Accommodating (Bottom-Left, angle = 126 deg)
  // 5. Avoiding (Top-Left, angle = 198 deg)
  const modes: TKIMode[] = [
    'competing',
    'collaborating',
    'compromising',
    'accommodating',
    'avoiding',
  ];

  const size = 340;
  const center = size / 2;
  const maxRadius = 115;
  const maxScore = 12;

  // Angles in radians
  const angles = [-Math.PI / 2, -Math.PI / 10, (3 * Math.PI) / 10, (7 * Math.PI) / 10, (11 * Math.PI) / 10];

  const getCoordinates = (angle: number, radius: number) => {
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Concentric polygon grids (scores: 3, 6, 9, 12)
  const gridLevels = [3, 6, 9, 12];

  // User polygon points
  const polygonPoints = modes
    .map((mode, idx) => {
      const score = scores[mode].rawScore;
      const r = (score / maxScore) * maxRadius;
      const coords = getCoordinates(angles[idx], r);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div className="w-full rounded-2xl glass-card p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Radar className="w-4 h-4 text-purple-400" />
            <span>Biểu Đồ Radar 5 Chiều TKI (Pentagon)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Trực quan hóa sự cân bằng tần suất giữa 5 phương thức ứng xử xung đột
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-2">
        {/* SVG Radar */}
        <div className="relative shrink-0">
          <svg
            width={size}
            height={size}
            className="overflow-visible drop-shadow-[0_4px_20px_rgba(99,102,241,0.15)]"
          >
            <defs>
              <linearGradient id="tkiRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Concentric Grid Pentagons */}
            {gridLevels.map((lvl) => {
              const r = (lvl / maxScore) * maxRadius;
              const pts = angles
                .map((a) => {
                  const c = getCoordinates(a, r);
                  return `${c.x},${c.y}`;
                })
                .join(' ');

              return (
                <g key={lvl}>
                  <polygon
                    points={pts}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={lvl === 12 ? 'none' : '2 2'}
                  />
                  <text
                    x={center + 4}
                    y={center - r + 3}
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {lvl}
                  </text>
                </g>
              );
            })}

            {/* 5 Radial Axis Lines */}
            {angles.map((a, idx) => {
              const c = getCoordinates(a, maxRadius);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={c.x}
                  y2={c.y}
                  stroke="#334155"
                  strokeWidth="1"
                />
              );
            })}

            {/* User Data Polygon */}
            <polygon
              points={polygonPoints}
              fill="url(#tkiRadarGrad)"
              stroke="#818CF8"
              strokeWidth="2.5"
            />

            {/* Points on vertices */}
            {modes.map((mode, idx) => {
              const score = scores[mode].rawScore;
              const r = (score / maxScore) * maxRadius;
              const c = getCoordinates(angles[idx], r);
              const profile = TKI_PROFILES[mode];

              return (
                <g key={mode}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="4.5"
                    fill={profile.color.accent}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* Outer Labels */}
            {modes.map((mode, idx) => {
              const c = getCoordinates(angles[idx], maxRadius + 24);
              const profile = TKI_PROFILES[mode];
              const isDominant = result.dominantMode === mode;

              return (
                <text
                  key={mode}
                  x={c.x}
                  y={c.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isDominant ? '#FFFFFF' : '#94A3B8'}
                  fontSize="11"
                  fontWeight={isDominant ? 'bold' : 'normal'}
                >
                  {profile.vietnameseName} ({scores[mode].rawScore})
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend Breakdown */}
        <div className="w-full max-w-sm space-y-2.5">
          {modes.map((mode) => {
            const profile = TKI_PROFILES[mode];
            const score = scores[mode];
            const isDominant = result.dominantMode === mode;

            return (
              <div
                key={mode}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  isDominant
                    ? 'bg-slate-900 border-indigo-500/50 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: profile.color.accent }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      {profile.vietnameseName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {profile.englishName} ({profile.code})
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-white">
                    {score.rawScore} / 12 điểm
                  </div>
                  <div className="text-[10px] text-indigo-400 font-medium">
                    {score.percentileLabel.split(' ')[0]} ({score.percentage}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
