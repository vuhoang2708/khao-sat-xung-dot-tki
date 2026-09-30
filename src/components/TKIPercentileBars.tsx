import React from 'react';
import { TKIMode, TKIAssessmentResult } from '../types/tki';
import { TKI_PROFILES } from '../data/tkiProfiles';
import { BarChart3, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TKIPercentileBarsProps {
  result: TKIAssessmentResult;
}

export const TKIPercentileBars: React.FC<TKIPercentileBarsProps> = ({ result }) => {
  const { scores, overusedModes, underusedModes } = result;

  const modeKeys: TKIMode[] = [
    'competing',
    'collaborating',
    'compromising',
    'avoiding',
    'accommodating',
  ];

  return (
    <div className="w-full rounded-2xl glass-card p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Thang Đo Phân Vị Chuẩn Hóa (Percentile Norms)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Đối chiếu điểm số thô với chuẩn mực phân vị dân số (Trang 5 PDF gốc)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <div className="w-2.5 h-2.5 rounded bg-slate-700" />
            <span>Thấp (0-25%)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/40" />
            <span>Trung bình (25-75%)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <div className="w-2.5 h-2.5 rounded bg-amber-500/40" />
            <span>Cao (75-100%)</span>
          </div>
        </div>
      </div>

      {/* 5 Percentile Rows */}
      <div className="space-y-4">
        {modeKeys.map((mode) => {
          const score = scores[mode];
          const profile = TKI_PROFILES[mode];
          const isHigh = score.percentileLevel === 'high';
          const isLow = score.percentileLevel === 'low';

          // Marker position: 0 to 12 mapped to 0% to 100%
          const markerPercent = (score.rawScore / 12) * 100;

          return (
            <div
              key={mode}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: profile.color.accent }}
                  />
                  <span className="font-bold text-sm text-slate-100">
                    {profile.vietnameseName} ({profile.code})
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    — {profile.dimensions.winLoseRatio}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white font-mono">
                    {score.rawScore} / 12 điểm
                  </span>

                  {isHigh && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Cao (&gt;75%)</span>
                    </span>
                  )}
                  {isLow && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Thấp (&lt;25%)</span>
                    </span>
                  )}
                  {!isHigh && !isLow && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Trung bình</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 3-Band Track with Needle Marker */}
              <div className="relative w-full h-3 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
                {/* Band 1: Low (approx 25%) */}
                <div className="h-full bg-slate-800/80 border-r border-slate-700" style={{ width: '25%' }} />
                {/* Band 2: Medium (approx 50%) */}
                <div className="h-full bg-emerald-950/40 border-r border-slate-700" style={{ width: '50%' }} />
                {/* Band 3: High (approx 25%) */}
                <div className="h-full bg-amber-950/40" style={{ width: '25%' }} />

                {/* Needle Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff] -translate-x-1/2 transition-all duration-700 ease-out"
                  style={{ left: `${markerPercent}%` }}
                />
              </div>

              {/* Norm Description Note */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{score.normDescription}</span>
                <span className="text-slate-500 font-mono text-[10px]">
                  Tỷ lệ: {score.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
