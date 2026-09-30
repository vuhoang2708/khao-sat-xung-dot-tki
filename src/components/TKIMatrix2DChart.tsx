import React from 'react';
import { TKIMode, TKIAssessmentResult } from '../types/tki';
import { TKI_PROFILES } from '../data/tkiProfiles';
import { Target, Sparkles } from 'lucide-react';

interface TKIMatrix2DChartProps {
  result: TKIAssessmentResult;
}

export const TKIMatrix2DChart: React.FC<TKIMatrix2DChartProps> = ({ result }) => {
  const { matrixCoords, dominantMode, scores } = result;

  // Coordinate mapping for SVG or absolute CSS positioning (0 to 100%)
  // X: Cooperativeness (0% to 100%)
  // Y: Assertiveness (100% at top, 0% at bottom)
  const pinX = Math.min(92, Math.max(8, matrixCoords.cooperativeness));
  const pinY = Math.min(92, Math.max(8, 100 - matrixCoords.assertiveness));

  const modesInfo = [
    {
      id: 'competing' as TKIMode,
      label: 'CẠNH TRANH',
      sub: 'Win - Lose',
      pos: 'top-3 left-3',
      score: scores.competing.rawScore,
      color: 'from-red-500/20 to-red-600/5 border-red-500/30 text-red-400',
      activeBorder: 'border-red-500 ring-2 ring-red-500/40',
    },
    {
      id: 'collaborating' as TKIMode,
      label: 'HỢP TÁC',
      sub: 'Win - Win',
      pos: 'top-3 right-3 text-right',
      score: scores.collaborating.rawScore,
      color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/40',
    },
    {
      id: 'compromising' as TKIMode,
      label: 'THỎA HIỆP',
      sub: 'Mỗi bên lùi một bước',
      pos: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
      score: scores.compromising.rawScore,
      color: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/40',
    },
    {
      id: 'avoiding' as TKIMode,
      label: 'NÉ TRÁNH',
      sub: 'Trì hoãn / Lose - Lose',
      pos: 'bottom-3 left-3',
      score: scores.avoiding.rawScore,
      color: 'from-slate-500/20 to-slate-600/5 border-slate-500/30 text-slate-400',
      activeBorder: 'border-slate-400 ring-2 ring-slate-400/40',
    },
    {
      id: 'accommodating' as TKIMode,
      label: 'NHƯỢNG BỘ',
      sub: 'Ưu tiên hòa khí / Lose - Win',
      pos: 'bottom-3 right-3 text-right',
      score: scores.accommodating.rawScore,
      color: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30 text-indigo-400',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/40',
    },
  ];

  return (
    <div className="w-full rounded-2xl glass-card p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Ma Trận 2 Chiều TKI (Thomas-Kilmann Grid)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Tọa độ phong cách của bạn dựa trên 2 trục: Quyết đoán (Tung) × Hợp tác (Hoành)
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Vị trí trọng tâm phản ánh xu hướng ứng xử tự nhiên</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[420px] rounded-2xl bg-slate-950/80 border border-slate-800/80 p-6 overflow-hidden">
        {/* Background Quadrant Lines */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 divide-x divide-y divide-slate-800/60 pointer-events-none" />
        
        {/* Axis Labels */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          ▲ Sự Quyết Đoán Cao (Assertive)
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-500 tracking-wider uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          ▼ Sự Quyết Đoán Thấp (Unassertive)
        </div>
        <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 origin-left text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          ◄ Ít Hợp Tác
        </div>
        <div className="absolute top-1/2 right-2 -translate-y-1/2 rotate-90 origin-right text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          Hợp Tác Cao ►
        </div>

        {/* 5 Mode Anchors */}
        {modesInfo.map((m) => {
          const isDominant = dominantMode === m.id;
          return (
            <div
              key={m.id}
              className={`absolute ${m.pos} p-2.5 sm:p-3 rounded-xl border bg-gradient-to-br transition-all duration-300 max-w-[140px] sm:max-w-[170px] ${
                m.color
              } ${isDominant ? m.activeBorder + ' shadow-lg' : ''}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-extrabold text-[11px] sm:text-xs tracking-wide">
                  {m.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/80 font-mono font-bold">
                  {m.score}/12
                </span>
              </div>
              <div className="text-[10px] text-slate-300 opacity-80 leading-tight mt-0.5">
                {m.sub}
              </div>
              {isDominant && (
                <span className="inline-block mt-1 text-[9px] font-bold text-indigo-300 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/40">
                  ★ Chủ đạo
                </span>
              )}
            </div>
          );
        })}

        {/* User Centroid Pin */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out group cursor-pointer"
          style={{ left: `${pinX}%`, top: `${pinY}%` }}
        >
          {/* Outer Pulsing Rings */}
          <div className="absolute -inset-3 bg-indigo-500/30 rounded-full animate-ping opacity-75 pointer-events-none" />
          <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full blur-sm opacity-80" />

          {/* Pin Core */}
          <div className="relative w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-extrabold text-xs">
            {result.userProfile.fullName ? result.userProfile.fullName[0].toUpperCase() : '★'}
          </div>

          {/* Hover Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/50 text-[11px] text-slate-200 shadow-xl opacity-90 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            <div className="font-bold text-indigo-300">
              {result.userProfile.fullName || 'Tọa độ của bạn'}
            </div>
            <div className="text-[10px] text-slate-400">
              Quyết đoán: {matrixCoords.assertiveness}% • Hợp tác: {matrixCoords.cooperativeness}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
