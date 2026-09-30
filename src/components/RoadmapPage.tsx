import React from 'react';
import { ArrowLeft, Lightbulb, Users, ShieldAlert, Award, Briefcase, TrendingUp } from 'lucide-react';

interface RoadmapPageProps {
  onBackToSurvey: () => void;
  onNavigateToResearch: () => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onBackToSurvey, onNavigateToResearch }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 animate-fadeIn text-slate-100">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBackToSurvey}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Quay Lại Bài Khảo Sát</span>
        </button>
        <button
          onClick={onNavigateToResearch}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
        >
          Xem Tài Liệu Cơ Sở Khoa Học ➔
        </button>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden glass-card-glow rounded-3xl p-6 sm:p-10 border border-amber-500/30 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <Lightbulb className="w-4 h-4" />
          <span>Chiến Lược Vận Dụng Trong Thực Tế</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Ứng Dụng Thực Tiễn Của TKI Trong Doanh Nghiệp
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Chuyển hóa xung đột từ rào cản phá hoại thành động lực thúc đẩy đổi mới, xây dựng văn hóa an toàn tâm lý và gia tăng hiệu suất đội ngũ.
        </p>
      </div>

      {/* 4 Practical Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            1. Phát Triển Năng Lực Lãnh Đạo & Điều Hành
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Giúp các cấp quản lý nhận diện phong cách mặc định của bản thân dưới áp lực. Tránh việc một nhà lãnh đạo chỉ quen dùng Cạnh tranh (áp đặt) hoặc chỉ biết Nhượng bộ (mất uy tín điều hành).
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            2. Xây Dựng Bản Đồ Xung Đột Đội Ngũ (Team Conflict Map)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Khi tất cả thành viên trong nhóm cùng làm khảo sát, người quản lý sẽ có bức tranh toàn cảnh: Nhóm có bị quá nhiều người Cạnh tranh gây bất hòa? Hay quá nhiều người Né tránh khiến các vấn đề quan trọng bị bỏ ngỏ?
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            3. Đàm Phán Kinh Doanh & Quản Lý Đối Tác
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ứng dụng linh hoạt giữa Thỏa hiệp (đạt thỏa thuận nhanh với đối tác ngang sức) và Hợp tác (đồng sáng tạo giá trị mới với khách hàng chiến lược lâu dài).
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            4. Quản Trị Khủng Hoảng Cảm Xúc Nội Bộ
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kết hợp 4 bước Giao tiếp trắc ẩn (NVC) để chuyển hóa mâu thuẫn cá nhân thành cuộc đối thoại tìm kiếm nhu cầu cốt lõi, khôi phục niềm tin và hàn gắn mối quan hệ.
          </p>
        </div>
      </div>
    </div>
  );
};
