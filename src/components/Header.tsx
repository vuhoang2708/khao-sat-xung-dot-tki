import React from 'react';
import { RotateCcw, ShieldAlert, Sparkles, BookOpen, Lightbulb, Compass, User } from 'lucide-react';
import { AssessmentMode } from '../types/tki';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  onReset: () => void;
  userName?: string;
  mode: AssessmentMode;
  currentView: 'survey' | 'research' | 'roadmap';
  onNavigateView: (view: 'survey' | 'research' | 'roadmap') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps,
  isCompleted,
  onReset,
  userName,
  mode,
  currentView,
  onNavigateView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onNavigateView('survey')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                TKI CONFLICT MODE
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                EI & NVC 1974
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Hồ Sơ Phong Cách Ứng Xử Xung Đột (Thomas-Kilmann)
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onNavigateView('survey')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'survey'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Làm Khảo Sát</span>
          </button>
          <button
            onClick={() => onNavigateView('research')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'research'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cơ Sở Khoa Học</span>
          </button>
          <button
            onClick={() => onNavigateView('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'roadmap'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Ứng Dụng Thực Tiễn</span>
          </button>
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {userName && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium text-slate-200 max-w-[100px] sm:max-w-[140px] truncate">
                {userName}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                mode === 'cloud_sync' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {mode === 'cloud_sync' ? 'Cloud Sync' : 'Ẩn danh'}
              </span>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={onReset}
            title="Làm lại bài khảo sát từ đầu"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Làm lại</span>
          </button>
        </div>
      </div>
    </header>
  );
};
