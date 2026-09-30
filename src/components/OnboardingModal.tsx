import React, { useState } from 'react';
import { UserProfile, AssessmentMode } from '../types/tki';
import { Compass, ShieldCheck, Cloud, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onStart: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onStart }) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [mode, setMode] = useState<AssessmentMode>('local_anonymous');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      fullName: fullName.trim() || 'Học Viên Ẩn Danh',
      email: email.trim(),
      organizationOrRole: organization.trim() || 'Thành viên',
      mode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl glass-card-glow p-6 sm:p-8 text-slate-100 relative overflow-hidden border border-indigo-500/30 shadow-2xl">
        {/* Glow Header Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              Khảo Sát Xung Đột TKI (30 Câu)
            </h2>
            <p className="text-xs text-slate-400">
              Chuẩn Thomas-Kilmann 1974 • Tích hợp EI & NVC
            </p>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phương pháp luận Lựa chọn bắt buộc (Forced-Choice):</span>
          </div>
          <p className="leading-relaxed">
            Bạn sẽ trải qua <strong>30 cặp phát biểu (A hoặc B)</strong>. Mỗi phương án đã được chuẩn hóa để có độ hấp dẫn tâm lý ngang nhau, giúp triệt tiêu thiên lệch &quot;chọn câu nghe cho hay&quot;. Hãy nhớ về các bối cảnh bất đồng thực tế trong công việc để chọn câu mô tả chân thật nhất phản xạ của bạn.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Họ và tên của bạn <span className="text-slate-500 font-normal">(hoặc biệt danh)</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email <span className="text-slate-500 font-normal">(tùy chọn)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm placeholder-slate-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Vị trí / Đội ngũ <span className="text-slate-500 font-normal">(tùy chọn)</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="VD: Quản lý dự án"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mode Selection */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Chế độ bảo mật dữ liệu:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                onClick={() => setMode('local_anonymous')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  mode === 'local_anonymous'
                    ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 mt-0.5 shrink-0 ${mode === 'local_anonymous' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-semibold">Ẩn danh & Cục bộ</div>
                  <div className="text-[11px] text-slate-400 leading-snug">Chỉ lưu trên trình duyệt của bạn</div>
                </div>
              </div>

              <div
                onClick={() => setMode('cloud_sync')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  mode === 'cloud_sync'
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Cloud className={`w-4 h-4 mt-0.5 shrink-0 ${mode === 'cloud_sync' ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-semibold">Đồng bộ Đám mây</div>
                  <div className="text-[11px] text-slate-400 leading-snug">Lưu Google Sheets tổ chức</div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
            >
              <span>Bắt Đầu Khảo Sát (30 Câu)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
