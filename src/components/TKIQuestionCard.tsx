import React, { useEffect } from 'react';
import { TKIQuestionItem } from '../types/tki';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Check } from 'lucide-react';

interface TKIQuestionCardProps {
  question: TKIQuestionItem;
  questionIndex: number;
  totalQuestions: number;
  selectedOption?: 'A' | 'B';
  onSelectOption: (questionId: number, option: 'A' | 'B') => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

export const TKIQuestionCard: React.FC<TKIQuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onPrevious,
  onNext,
  onSubmit,
  canSubmit,
}) => {
  // Keyboard navigation: 'A' or '1' selects A, 'B' or '2' selects B, ArrowLeft previous, ArrowRight next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 'a' || e.key === 'A' || e.key === '1') {
        onSelectOption(question.id, 'A');
      } else if (e.key === 'b' || e.key === 'B' || e.key === '2') {
        onSelectOption(question.id, 'B');
      } else if (e.key === 'ArrowLeft') {
        onPrevious();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question.id, onSelectOption, onPrevious, onNext]);

  return (
    <div className="w-full rounded-2xl glass-card-glow p-5 sm:p-8 border border-indigo-500/20 shadow-2xl space-y-6 animate-fadeIn">
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            CÂU {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs text-slate-400">Lựa chọn bắt buộc (A hoặc B)</span>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Bấm phím A/B hoặc 1/2 trên bàn phím</span>
        </div>
      </div>

      {/* Prompt Instruction */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-200 leading-relaxed">
          Trong một tình huống xung đột hoặc bất đồng ý kiến tại nơi làm việc, phát biểu nào mô tả chân thực nhất phản xạ của bạn?
        </h3>
      </div>

      {/* Two Choice Cards (A & B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Option A */}
        <div
          onClick={() => onSelectOption(question.id, 'A')}
          className={`p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${
            selectedOption === 'A'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.01]'
              : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedOption === 'A'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-300 group-hover:bg-indigo-950 group-hover:text-indigo-300'
              }`}>
                Phương án A
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                Phím: [A] hoặc [1]
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {question.options.A.text}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 group-hover:text-slate-300">
              {selectedOption === 'A' ? 'Đã lựa chọn phương án này' : 'Nhấp để chọn'}
            </span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              selectedOption === 'A' ? 'bg-indigo-500 text-white' : 'border border-slate-700'
            }`}>
              {selectedOption === 'A' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Option B */}
        <div
          onClick={() => onSelectOption(question.id, 'B')}
          className={`p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${
            selectedOption === 'B'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.01]'
              : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedOption === 'B'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-300 group-hover:bg-indigo-950 group-hover:text-indigo-300'
              }`}>
                Phương án B
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                Phím: [B] hoặc [2]
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {question.options.B.text}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 group-hover:text-slate-300">
              {selectedOption === 'B' ? 'Đã lựa chọn phương án này' : 'Nhấp để chọn'}
            </span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              selectedOption === 'B' ? 'bg-indigo-500 text-white' : 'border border-slate-700'
            }`}>
              {selectedOption === 'B' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <button
          onClick={onPrevious}
          disabled={questionIndex === 0}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            questionIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-600'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Câu trước</span>
        </button>

        {questionIndex < totalQuestions - 1 ? (
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>Câu tiếp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg ${
              canSubmit
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white hover:opacity-95 shadow-emerald-600/30 animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Hoàn Tất & Xem Báo Cáo (30/30)</span>
          </button>
        )}
      </div>
    </div>
  );
};
