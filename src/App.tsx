import React, { useState, useEffect } from 'react';
import { UserProfile, TKIAssessmentResult } from './types/tki';
import { QUESTIONS_30 } from './data/questions30';
import { calculateTKIAssessment } from './engine/tkiScoringEngine';
import { submitTKIAssessmentData } from './utils/webhook';
import { exportReportToPDF } from './utils/pdfExport';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { ProgressBar } from './components/ProgressBar';
import { TKIQuestionCard } from './components/TKIQuestionCard';
import { TKIReport } from './components/TKIReport';
import { PDFExportView } from './components/PDFExportView';
import { ResearchPage } from './components/ResearchPage';
import { RoadmapPage } from './components/RoadmapPage';
import { BookOpen, Lightbulb } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'survey' | 'research' | 'roadmap'>(() => {
    if (window.location.hash === '#research') return 'research';
    if (window.location.hash === '#roadmap' || window.location.hash === '#ideas') return 'roadmap';
    return 'survey';
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tki_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('tki_user_profile');
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answersMap, setAnswersMap] = useState<Record<number, 'A' | 'B'>>(() => {
    const saved = localStorage.getItem('tki_answers_map');
    return saved ? JSON.parse(saved) : {};
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<TKIAssessmentResult | null>(() => {
    const saved = localStorage.getItem('tki_last_result');
    return saved ? JSON.parse(saved) : null;
  });

  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // URL Hash routing listener
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#research') {
        setCurrentView('research');
      } else if (window.location.hash === '#roadmap' || window.location.hash === '#ideas') {
        setCurrentView('roadmap');
      } else {
        setCurrentView('survey');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateView = (view: 'survey' | 'research' | 'roadmap') => {
    setCurrentView(view);
    if (view === 'research') {
      window.location.hash = '#research';
    } else if (view === 'roadmap') {
      window.location.hash = '#roadmap';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Persist answers
  useEffect(() => {
    if (Object.keys(answersMap).length > 0) {
      localStorage.setItem('tki_answers_map', JSON.stringify(answersMap));
    }
  }, [answersMap]);

  useEffect(() => {
    if (result) {
      localStorage.setItem('tki_last_result', JSON.stringify(result));
      setIsCompleted(true);
    }
  }, [result]);

  const handleStartOnboarding = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('tki_user_profile', JSON.stringify(profile));
    setIsOnboardingOpen(false);
  };

  const handleSelectOption = (questionId: number, option: 'A' | 'B') => {
    const nextAnswers = { ...answersMap, [questionId]: option };
    setAnswersMap(nextAnswers);

    // Auto advance smoothly after 250ms
    if (currentQuestionIndex < QUESTIONS_30.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => Math.min(prev + 1, QUESTIONS_30.length - 1));
      }, 250);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, QUESTIONS_30.length - 1));
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    const profile: UserProfile = userProfile || {
      fullName: 'Khách Ẩn Danh',
      email: '',
      organizationOrRole: '',
      mode: 'local_anonymous',
    };

    const calculated = calculateTKIAssessment(answersMap, profile);
    setResult(calculated);
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (profile.mode === 'cloud_sync') {
      setWebhookStatus('loading');
      const ok = await submitTKIAssessmentData(calculated);
      setWebhookStatus(ok ? 'success' : 'error');
    } else {
      setWebhookStatus('idle');
    }
  };

  const handleSyncCloud = async (name: string, email: string, org: string) => {
    if (!result) return;
    const updatedProfile: UserProfile = {
      fullName: name,
      email: email,
      organizationOrRole: org,
      mode: 'cloud_sync',
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('tki_user_profile', JSON.stringify(updatedProfile));

    const updatedResult: TKIAssessmentResult = {
      ...result,
      userProfile: updatedProfile,
    };
    setResult(updatedResult);

    setWebhookStatus('loading');
    const ok = await submitTKIAssessmentData(updatedResult);
    setWebhookStatus(ok ? 'success' : 'error');
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm lại bài khảo sát TKI từ đầu không?')) {
      setAnswersMap({});
      setResult(null);
      setIsCompleted(false);
      setCurrentQuestionIndex(0);
      localStorage.removeItem('tki_answers_map');
      localStorage.removeItem('tki_last_result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExportPDF = async () => {
    if (!result) return;
    setIsExportingPDF(true);
    try {
      const cleanName = (result.userProfile.fullName || 'Khach').replace(/\\s+/g, '_');
      const filename = `Ho_So_Xung_Dot_TKI_${cleanName}.pdf`;
      await exportReportToPDF('pdf-export-container', filename);
    } catch (err) {
      console.error('Lỗi xuất PDF:', err);
      alert('Không thể xuất PDF lúc này. Vui lòng thử lại.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const totalAnswered = Object.keys(answersMap).length;
  const canSubmit = totalAnswered === QUESTIONS_30.length;
  const currentQuestion = QUESTIONS_30[currentQuestionIndex];
  const currentMode = userProfile?.mode || 'local_anonymous';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentStep={totalAnswered}
        totalSteps={QUESTIONS_30.length}
        isCompleted={isCompleted}
        onReset={handleReset}
        userName={userProfile?.fullName}
        mode={currentMode}
        currentView={currentView}
        onNavigateView={handleNavigateView}
      />

      {/* Main Container */}
      <main className="flex-1 w-full">
        {currentView === 'research' ? (
          <ResearchPage onBackToSurvey={() => handleNavigateView('survey')} />
        ) : currentView === 'roadmap' ? (
          <RoadmapPage
            onBackToSurvey={() => handleNavigateView('survey')}
            onNavigateToResearch={() => handleNavigateView('research')}
          />
        ) : (
          <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
            {!isCompleted ? (
              <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
                <ProgressBar
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={QUESTIONS_30.length}
                  answersMap={answersMap}
                  onJumpToQuestion={handleJumpToQuestion}
                />

                <TKIQuestionCard
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={QUESTIONS_30.length}
                  selectedOption={answersMap[currentQuestion.id]}
                  onSelectOption={handleSelectOption}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSubmit={handleSubmit}
                  canSubmit={canSubmit}
                />

                {/* Helpful Hint */}
                <div className="text-center text-xs text-slate-400 space-y-2 pt-2">
                  <p>💡 Gợi ý: Hãy tin tưởng vào phản xạ trực giác đầu tiên của bạn để kết quả đo lường chân thực nhất!</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => handleNavigateView('research')}
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-4 text-xs font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Cơ sở Khoa học & Mô hình TKI 1974 ➔</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleNavigateView('roadmap')}
                      className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline underline-offset-4 text-xs font-medium"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Ứng Dụng Thực Tiễn Doanh Nghiệp ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              result && (
                <TKIReport
                  result={result}
                  onReset={handleReset}
                  onExportPDF={handleExportPDF}
                  isExporting={isExportingPDF}
                  webhookStatus={webhookStatus}
                  onSyncCloud={handleSyncCloud}
                />
              )
            )}
          </div>
        )}
      </main>

      {/* Hidden Printable PDF Canvas Element */}
      <div className="fixed left-[-9999px] top-[-9999px] overflow-hidden pointer-events-none" aria-hidden="true">
        {result && <PDFExportView result={result} />}
      </div>

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={isOnboardingOpen && currentView === 'survey'}
        onStart={handleStartOnboarding}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-2">
        <p>Hệ Thống Đánh Giá Phong Cách Ứng Xử Xung Đột Theo Chuẩn TKI (Thomas-Kilmann 1974) • Tích Hợp EI & NVC</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
          <button onClick={() => handleNavigateView('survey')} className="hover:text-indigo-400 transition-colors">
            📝 Làm Khảo Sát
          </button>
          <span>•</span>
          <button onClick={() => handleNavigateView('research')} className="hover:text-indigo-400 transition-colors font-medium text-indigo-400">
            🔬 Cơ Sở Khoa Học
          </button>
          <span>•</span>
          <button onClick={() => handleNavigateView('roadmap')} className="hover:text-amber-400 transition-colors font-medium text-amber-400">
            💡 Ứng Dụng Thực Tiễn
          </button>
        </div>
      </footer>
    </div>
  );
};
