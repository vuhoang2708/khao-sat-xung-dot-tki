import React, { useState } from 'react';
import { TKIAssessmentResult, TKIMode } from '../types/tki';
import { TKI_PROFILES } from '../data/tkiProfiles';
import { Sparkles, HeartHandshake, Brain, Lightbulb, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface TKIDeepDiveProps {
  result: TKIAssessmentResult;
}

export const TKIDeepDive: React.FC<TKIDeepDiveProps> = ({ result }) => {
  const { dominantMode, secondaryMode, overusedModes, underusedModes } = result;
  const dominantProfile = TKI_PROFILES[dominantMode];
  const secondaryProfile = TKI_PROFILES[secondaryMode];

  const [activeTab, setActiveTab] = useState<'dominant' | 'secondary' | 'einvc' | 'collaboration'>('dominant');

  return (
    <div className="w-full rounded-2xl glass-card p-5 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('dominant')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'dominant'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Phong Cách Chủ Đạo: {dominantProfile.vietnameseName}</span>
        </button>

        <button
          onClick={() => setActiveTab('secondary')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'secondary'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>Phong Cách Phụ: {secondaryProfile.vietnameseName}</span>
        </button>

        <button
          onClick={() => setActiveTab('einvc')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'einvc'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
              : 'text-purple-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Tự Vấn Cảm Xúc (EI) & Giao Tiếp Trắc Ẩn (NVC)</span>
        </button>

        <button
          onClick={() => setActiveTab('collaboration')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'collaboration'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Bí Quyết Phối Hợp Nhóm</span>
        </button>
      </div>

      {/* Tab 1: Dominant Style Deep Dive */}
      {activeTab === 'dominant' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PHONG CÁCH CHỦ ĐẠO
              </span>
              <span className="text-xs text-slate-400">
                {dominantProfile.dimensions.winLoseRatio}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {dominantProfile.vietnameseName} ({dominantProfile.englishName})
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {dominantProfile.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Điểm Mạnh & Năng Lực Cốt Lõi</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {dominantProfile.strengths.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="leading-relaxed">{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to use */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Bối Cảnh Nên Kích Hoạt Tối Ưu</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {dominantProfile.whenToUse.map((wt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span className="leading-relaxed">{wt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Overuse / Underuse Warning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Nguy Cơ Tiềm Ẩn Khi Lạm Dụng (&gt;75%)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {dominantProfile.overuseRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="leading-relaxed">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Lời Khuyên Giao Tiếp Hiệu Quả</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {dominantProfile.communicationTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Secondary Style */}
      {activeTab === 'secondary' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PHONG CÁCH PHỤ / BỔ TRỢ
              </span>
              <span className="text-xs text-slate-400">
                {secondaryProfile.dimensions.winLoseRatio}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {secondaryProfile.vietnameseName} ({secondaryProfile.englishName})
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {secondaryProfile.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Điểm Mạnh Khi Kích Hoạt</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {secondaryProfile.strengths.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="leading-relaxed">{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Bối Cảnh Nên Linh Hoạt Sử Dụng</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {secondaryProfile.whenToUse.map((wt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span className="leading-relaxed">{wt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: EI & NVC Reflection (Trang 5 PDF) */}
      {activeTab === 'einvc' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overuse & Underuse Summary */}
          {(overusedModes.length > 0 || underusedModes.length > 0) && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 text-xs text-slate-200 space-y-2">
              <div className="font-bold text-indigo-300 flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Nhận Định Phân Vị Hành Vi Của Bạn:</span>
              </div>
              {overusedModes.length > 0 && (
                <p>
                  ⚠️ <strong>Phong cách vượt ngưỡng (&gt;75%):</strong>{' '}
                  <span className="text-amber-400 font-semibold">
                    {overusedModes.map((m) => TKI_PROFILES[m].vietnameseName).join(', ')}
                  </span>{' '}
                  — Bạn có xu hướng lạm dụng như một phản xạ tự động dưới áp lực.
                </p>
              )}
              {underusedModes.length > 0 && (
                <p>
                  🛡️ <strong>Phong cách dưới ngưỡng (&lt;25%):</strong>{' '}
                  <span className="text-cyan-400 font-semibold">
                    {underusedModes.map((m) => TKI_PROFILES[m].vietnameseName).join(', ')}
                  </span>{' '}
                  — Bạn có thể đang có rào cản tâm lý hoặc e ngại khi kích hoạt phong cách này.
                </p>
              )}
            </div>
          )}

          {/* EI 3 Self-Reflection Pillars */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-purple-300 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>3 Trụ Cột Tự Vấn Rèn Luyện Trí Tuệ Cảm Xúc (EI)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 space-y-2">
                <div className="font-bold text-amber-400 text-sm">1. Hành vi vượt ngưỡng (&gt;75%)</div>
                <p className="text-slate-300 leading-relaxed">
                  • Có phải tôi đang lạm dụng phong cách này như một phản xạ vô điều kiện không?<br/>
                  • Dưới áp lực căng thẳng, tôi thường bị kích hoạt cảm xúc gì (nóng giận, sợ mất kiểm soát hay quá tải)?<br/>
                  • Làm thế nào để dừng lại 3 giây trước khi phản xạ theo thói quen cũ?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 space-y-2">
                <div className="font-bold text-cyan-400 text-sm">2. Hành vi dưới ngưỡng (&lt;25%)</div>
                <p className="text-slate-300 leading-relaxed">
                  • Có rào cản tâm lý hoặc nỗi sợ nào khiến tôi né tránh sử dụng phương thức này?<br/>
                  • Tôi có đang sợ sự đối đầu trực diện hoặc sợ làm mất lòng người khác không?<br/>
                  • Khi nhu cầu chưa được đáp ứng, tôi có dám đưa ra yêu cầu cụ thể thay vì im lặng cam chịu?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 space-y-2">
                <div className="font-bold text-emerald-400 text-sm">3. Rèn luyện chế độ Hợp Tác (CL)</div>
                <p className="text-slate-300 leading-relaxed">
                  • Tôi đã đánh giá đúng 8 thuộc tính bối cảnh (thời gian, mức độ tin cậy...) trước khi bắt đầu chưa?<br/>
                  • Tôi đã tách biệt Quan sát khách quan khỏi Phán xét chủ quan chưa?<br/>
                  • Tôi đã gọi tên đúng Nhu cầu cốt lõi của đối phương và của chính mình chưa?
                </p>
              </div>
            </div>
          </div>

          {/* 4 Steps NVC Framework */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 space-y-4">
            <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Khung 4 Bước Giao Tiếp Trắc Ẩn (Nonviolent Communication - NVC) Khi Xảy Ra Xung Đột</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold w-max text-[10px]">
                  BƯỚC 1: QUAN SÁT
                </div>
                <div className="font-bold text-slate-100">Observation (Không phán xét)</div>
                <p className="text-slate-400 leading-relaxed">
                  Nêu dữ liệu thực tế cụ thể: ai, cái gì, khi nào. Tuyệt đối không dùng các từ phóng đại ("luôn luôn", "không bao giờ") hoặc gán nhãn phẩm chất.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold w-max text-[10px]">
                  BƯỚC 2: CẢM XÚC
                </div>
                <div className="font-bold text-slate-100">Feelings (Gọi tên chân thật)</div>
                <p className="text-slate-400 leading-relaxed">
                  Bày tỏ cảm xúc thật của bản thân (lo lắng, thất vọng, áp lực) thay vì biến thành suy nghĩ công kích ("Tôi cảm thấy bạn coi thường tôi").
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold w-max text-[10px]">
                  BƯỚC 3: NHU CẦU
                </div>
                <div className="font-bold text-slate-100">Needs (Nhu cầu cốt lõi)</div>
                <p className="text-slate-400 leading-relaxed">
                  Xác định nhu cầu sâu kín chung của con người: sự an toàn, sự tôn trọng, sự rõ ràng, tiến độ, hoặc sự tin cậy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold w-max text-[10px]">
                  BƯỚC 4: ĐỀ NGHỊ
                </div>
                <div className="font-bold text-slate-100">Requests (Yêu cầu hành động)</div>
                <p className="text-slate-400 leading-relaxed">
                  Đưa ra đề xuất cụ thể, khả thi, bằng ngôn ngữ tích cực và sẵn sàng đón nhận câu trả lời "Không" mà không trừng phạt.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Collaboration Tips */}
      {activeTab === 'collaboration' && (
        <div className="space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-slate-200">
            Hướng Dẫn Tương Tác Giữa {dominantProfile.vietnameseName} Và Các Phong Cách Khác:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dominantProfile.collaborationTips.map((tip) => {
              const target = TKI_PROFILES[tip.targetMode];
              return (
                <div
                  key={tip.targetMode}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: target.color.accent }}
                    />
                    <span className="font-bold text-xs text-white">
                      Khi làm việc với người thiên về {target.vietnameseName} ({target.englishName}):
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-4 border-l-2 border-slate-800">
                    {tip.advice}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
