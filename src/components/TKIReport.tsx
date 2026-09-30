import React, { useState } from 'react';
import { TKIAssessmentResult, TKIMode } from '../types/tki';
import { TKI_PROFILES } from '../data/tkiProfiles';
import { TKIMatrix2DChart } from './TKIMatrix2DChart';
import { TKIRadarChart } from './TKIRadarChart';
import { TKIPercentileBars } from './TKIPercentileBars';
import { TKIDeepDive } from './TKIDeepDive';
import { Download, RotateCcw, Cloud, CheckCircle2, ChevronDown, ChevronUp, Sparkles, FileText, User } from 'lucide-react';

interface TKIReportProps {
  result: TKIAssessmentResult;
  onReset: () => void;
  onExportPDF: () => void;
  isExporting: boolean;
  webhookStatus: 'idle' | 'loading' | 'success' | 'error';
  onSyncCloud: (name: string, email: string, organization: string) => void;
}

export const TKIReport: React.FC<TKIReportProps> = ({
  result,
  onReset,
  onExportPDF,
  isExporting,
  webhookStatus,
  onSyncCloud,
}) => {
  const { dominantMode, secondaryMode, scores, userProfile, answerRecords } = result;
  const dominant = TKI_PROFILES[dominantMode];
  const secondary = TKI_PROFILES[secondaryMode];

  const [showAnswerBreakdown, setShowAnswerBreakdown] = useState<boolean>(false);
  const [syncName, setSyncName] = useState<string>(userProfile.fullName || '');
  const [syncEmail, setSyncEmail] = useState<string>(userProfile.email || '');
  const [syncOrg, setSyncOrg] = useState<string>(userProfile.organizationOrRole || '');

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Executive Hero Banner */}
      <div className="w-full rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-2xl space-y-6">
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-white uppercase tracking-wider">
              KẾT QUẢ KHẢO SÁT CHUẨN TKI
            </span>
            <span className="text-xs text-slate-400">
              Hoàn tất 30/30 câu • {new Date(result.completedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onExportPDF}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang xuất PDF...' : 'Xuất Báo Cáo PDF'}</span>
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 space-y-4">
          <div className="text-xs font-semibold text-slate-400">
            Hồ sơ cá nhân: <strong className="text-slate-100">{userProfile.fullName || 'Ẩn danh'}</strong>
            {userProfile.organizationOrRole && ` • ${userProfile.organizationOrRole}`}
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">
              PHONG CÁCH ỨNG XỬ XUNG ĐỘT CHỦ ĐẠO
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {dominant.vietnameseName} ({dominant.englishName})
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {dominant.tagline}. Điểm thô: <strong className="text-white font-mono">{scores[dominantMode].rawScore}/12</strong> ({scores[dominantMode].percentileLabel.split(' ')[0]}).
            </p>
          </div>

          {/* 2 Badges: Dominant & Secondary */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/50 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-slate-300">Chủ đạo:</span>
              <span className="font-bold text-white">{dominant.vietnameseName} ({scores[dominantMode].rawScore} điểm)</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-slate-300">Bổ trợ:</span>
              <span className="font-bold text-white">{secondary.vietnameseName} ({scores[secondaryMode].rawScore} điểm)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Sync Status / Prompt if Anonymous */}
      {userProfile.mode === 'local_anonymous' && webhookStatus === 'idle' && (
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-100">Đang ở Chế độ Ẩn danh (Dữ liệu lưu an toàn trên máy).</span>
              <span className="text-slate-400 block sm:inline sm:ml-1">
                Bạn có muốn đồng bộ kết quả này về Google Sheets tổ chức để được tư vấn chuyên sâu không?
              </span>
            </div>
          </div>

          <button
            onClick={() => onSyncCloud(syncName, syncEmail, syncOrg)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-sm"
          >
            Đồng bộ kết quả ngay
          </button>
        </div>
      )}

      {webhookStatus === 'success' && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Dữ liệu khảo sát đã được lưu trữ và đồng bộ thành công vào Google Sheets!</span>
        </div>
      )}

      {/* Visualizations Section: 2D Matrix & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TKIMatrix2DChart result={result} />
        <TKIRadarChart result={result} />
      </div>

      {/* Percentile Norms Breakdown */}
      <TKIPercentileBars result={result} />

      {/* Deep Dive & EI/NVC Framework */}
      <TKIDeepDive result={result} />

      {/* Full 30 Questions Review Accordion */}
      <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowAnswerBreakdown(!showAnswerBreakdown)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-slate-100">
              Chi Tiết Lựa Chọn Của Bạn Cho Toàn Bộ 30 Câu Hỏi (Scoring Breakdown)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{showAnswerBreakdown ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {showAnswerBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAnswerBreakdown && (
          <div className="p-4 sm:p-6 border-t border-slate-800 space-y-3 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-2.5">
              {answerRecords.map((ans) => {
                const profile = TKI_PROFILES[ans.mode];
                return (
                  <div
                    key={ans.questionId}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-start sm:items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold shrink-0">
                        Câu {ans.questionId}
                      </span>
                      <span className="text-slate-300 leading-snug">
                        {ans.selectedText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                        Lựa chọn {ans.selectedOption}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded font-semibold text-white"
                        style={{ backgroundColor: profile.color.accent }}
                      >
                        {profile.vietnameseName} ({ans.code})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
