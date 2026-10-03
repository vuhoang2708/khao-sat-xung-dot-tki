import React, { useState, useEffect } from 'react';
import { UserAuth, requestMagicLink, verifyMagicLink, saveStoredAuth } from '../utils/auth';
import { Sparkles, Mail, User, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AuthGateModalProps {
  isOpen: boolean;
  onVerified: (auth: UserAuth) => void;
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({ isOpen, onVerified }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consentNghiDinh13, setConsentNghiDinh13] = useState(true);

  const [uiState, setUiState] = useState<'form' | 'waiting' | 'verifying' | 'success'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verifiedName, setVerifiedName] = useState('');

  // 1. Kiểm tra tham số URL ?token=...&action=verify ngay khi component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const emailParam = params.get('email');
    const action = params.get('action');

    if (token && (action === 'verify' || action === 'verify_token')) {
      setUiState('verifying');
      verifyMagicLink(token, emailParam || undefined)
        .then((res) => {
          if (res.success && res.user) {
            const auth = saveStoredAuth(res.user);
            setVerifiedName(auth.full_name || auth.email);
            setUiState('success');

            // Xóa query parameters khỏi URL để tránh kích hoạt lại khi reload
            try {
              const cleanUrl = window.location.pathname + window.location.hash;
              window.history.replaceState({}, document.title, cleanUrl);
            } catch (e) {}

            setTimeout(() => {
              onVerified(auth);
            }, 1200);
          } else {
            setUiState('form');
            setErrorMessage(res.message || 'Mã kích hoạt không hợp lệ hoặc đã hết hạn.');
          }
        })
        .catch(() => {
          setUiState('form');
          setErrorMessage('Lỗi kết nối khi xác thực mã kích hoạt.');
        });
    }
  }, [onVerified]);

  // 2. Đồng hồ đếm ngược 60 giây khi ở trạng thái chờ
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (uiState === 'waiting' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [uiState, countdown]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    const cleanPhone = phone.replace(/[\s.-]/g, '');
    if (!cleanPhone || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số).');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (!consentNghiDinh13) {
      setErrorMessage('Vui lòng đồng ý điều khoản xử lý dữ liệu theo Nghị định 13/2023/NĐ-CP để tiếp tục.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestMagicLink({
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        surveyType: 'TKI'
      });

      setIsSubmitting(false);
      if (res.success) {
        setUiState('waiting');
        setCountdown(res.retry_after_seconds || 60);
      } else {
        setErrorMessage(res.message || 'Không thể gửi email kích hoạt. Vui lòng thử lại.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Lỗi kết nối hệ thống. Vui lòng thử lại sau.');
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top decorative gradient bar */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Delivering Happiness &bull; Cổng Định Danh</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Xác Thực Học Viên 1-Chạm
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Nhập thông tin để mở khóa bài Khảo sát Ứng xử Xung đột (Thomas-Kilmann - TKI) và đồng bộ kết quả.
            </p>
          </div>

          {/* 1. TRẠNG THÁI FORM NHẬP THÔNG TIN */}
          {uiState === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Họ và tên <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Số điện thoại <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ví dụ: yourname@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              {/* Checkbox Nghị định 13 */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <input
                  type="checkbox"
                  id="consentTKI"
                  checked={consentNghiDinh13}
                  onChange={(e) => setConsentNghiDinh13(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 cursor-pointer"
                />
                <label htmlFor="consentTKI" className="text-[11px] text-slate-400 leading-snug cursor-pointer select-none">
                  Tôi đồng ý cung cấp thông tin để xác thực danh tính và nhận báo cáo phân tích theo Nghị định 13/2023/NĐ-CP.
                </label>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-500 active:scale-[0.98] transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi liên kết...</span>
                  </>
                ) : (
                  <span>Nhận Liên Kết Kích Hoạt Qua Email</span>
                )}
              </button>
            </form>
          )}

          {/* 2. TRẠNG THÁI CHỜ KÍCH HOẠT QUA EMAIL */}
          {uiState === 'waiting' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Kiểm Tra Hộp Thư Của Bạn!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Liên kết kích hoạt 1-chạm đã được gửi tới:<br />
                  <span className="font-semibold text-amber-400">{email}</span>
                </p>
              </div>
              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-slate-300 max-w-sm mx-auto text-left space-y-1">
                <p>&bull; Mở email và bấm nút <strong className="text-amber-400">"BẮT ĐẦU LÀM BÀI KHẢO SÁT NGAY"</strong>.</p>
                <p>&bull; Liên kết có hiệu lực trong 30 phút và chỉ sử dụng 1 lần.</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                    countdown > 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-md'
                  }`}
                >
                  {countdown > 0 ? `Gửi lại liên kết sau (${countdown}s)` : 'Gửi lại liên kết mới'}
                </button>
              </div>
            </div>
          )}

          {/* 3. TRẠNG THÁI ĐANG XÁC THỰC MÃ TỪ LINK */}
          {uiState === 'verifying' && (
            <div className="text-center py-8 space-y-3">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-white">Đang xác thực liên kết...</h3>
              <p className="text-xs text-slate-400">Vui lòng đợi hệ thống mở khóa bài khảo sát.</p>
            </div>
          )}

          {/* 4. TRẠNG THÁI KÍCH HOẠT THÀNH CÔNG */}
          {uiState === 'success' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-emerald-400">Kích Hoạt Thành Công!</h3>
              <p className="text-xs text-slate-300">
                Chào mừng <strong className="text-white">{verifiedName}</strong>. Đang mở khóa câu hỏi số 1...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
