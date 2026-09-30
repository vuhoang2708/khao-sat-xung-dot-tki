import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Brain, Scale, Shield, Sparkles, Target, Users, Zap, CheckCircle2 } from 'lucide-react';

interface ResearchPageProps {
  onBackToSurvey: () => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ onBackToSurvey }) => {
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
        <span className="text-xs text-slate-400 font-mono">TKI Scientific Research Dossier</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden glass-card-glow rounded-3xl p-6 sm:p-10 border border-indigo-500/30 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <BookOpen className="w-4 h-4" />
          <span>Nền Tảng Khoa Học & Phương Pháp Luận TKI</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Bản Chất Khoa Học Của Mô Hình Xung Đột Thomas-Kilmann (1974)
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Phân tích cơ chế triệt tiêu thiên lệch mong muốn xã hội (Social Desirability Bias), 2 chiều kích hành vi độc lập và sự kết hợp cùng Trí tuệ cảm xúc (EI) & Giao tiếp trắc ẩn (NVC).
        </p>
      </div>

      {/* Section 1: Lịch sử ra đời & Sự khác biệt */}
      <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-indigo-300 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span>1. Bối Cảnh Lịch Sử & Tính Độc Lập Với Thang Đo Tính Cách Cố Định</span>
        </h2>
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            Công cụ <strong>TKI (Thomas-Kilmann Conflict Mode Instrument)</strong> được công bố vào năm 1974 bởi Tiến sĩ Kenneth W. Thomas và Ralph H. Kilmann. Khác biệt hoàn toàn với các thang đo tính cách cố định (như MBTI hay Big Five vốn coi tính cách là bất biến), TKI tập trung vào việc <strong>đo lường tần suất hành vi tương đối</strong> trong các tình huống xung đột thực tế.
          </p>
          <p>
            Xung đột trong mô hình TKI được định nghĩa rất khách quan: <em>&quot;Bất kỳ tình huống nào mà trong đó mối quan tâm hoặc lợi ích của hai bên dường như không thể dung hòa&quot;</em>. Không có phong cách nào là tốt tuyệt đối hay xấu tuyệt đối; sự hiệu quả phụ thuộc 100% vào khả năng nhận diện bối cảnh và điều chỉnh linh hoạt hành vi của người lãnh đạo.
          </p>
        </div>
      </div>

      {/* Section 2: Phương pháp luận triệt tiêu Social Desirability Bias */}
      <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <span>2. Phương Pháp Luận Triệt Tiêu Thiên Lệch Mong Muốn Xã Hội (Social Desirability Bias)</span>
        </h2>
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            Trước năm 1974, các công cụ khảo sát xung đột cũ đều thất bại vì mắc phải <strong>Social Desirability Bias</strong> (người làm bài luôn có xu hướng chọn những câu nghe có vẻ đạo đức, lý tưởng như &quot;Hợp tác&quot; và né tránh những câu nghe có vẻ tiêu cực như &quot;Né tránh&quot; hoặc &quot;Cạnh tranh&quot;). Mức độ sai lệch này ở các công cụ cũ lên tới <strong>hơn 90%</strong>.
          </p>
          <p>
            Thomas và Kilmann đã giải quyết triệt để vấn đề này bằng thiết kế <strong>30 Cặp Phát Biểu Lựa Chọn Bắt Buộc (Forced-Choice Pairs)</strong>. Mỗi cặp phát biểu được chuẩn hóa để có độ hấp dẫn tâm lý tương đương nhau. Người làm bài buộc phải chọn một câu mô tả chân thật nhất hành vi thực tế của mình thay vì chọn câu để &quot;làm đẹp hình ảnh&quot;. Thiết kế đột phá này giúp giảm thiểu thiên lệch xuống mức thấp kỷ lục: <strong>chỉ còn 17%</strong>.
          </p>
        </div>
      </div>

      {/* Section 3: 2 Chiều kích & 5 Phương thức */}
      <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-emerald-300 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <span>3. Hai Chiều Kích Tọa Độ Độc Lập</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Sự Quyết Đoán (Assertiveness - Trục Tung Y)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mức độ một cá nhân cố gắng thỏa mãn các mối quan tâm, mục tiêu và quyền lợi của chính mình. Người có độ quyết đoán cao kiên định bảo vệ lập trường và ra quyết định dứt khoát.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Sự Hợp Tác (Cooperativeness - Trục Hoành X)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mức độ một cá nhân cố gắng thỏa mãn các mối quan tâm và nhu cầu của đối phương. Người có tính hợp tác cao ưu tiên bảo vệ mối quan hệ, lắng nghe và tìm kiếm sự đồng thuận.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: 8 Thuộc tính bối cảnh để chọn phong cách */}
      <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-purple-300 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          <span>4. 8 Thuộc Tính Bối Cảnh Quyết Định Sự Phù Hợp Của Phong Cách Xung Đột</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { title: 'Tầm quan trọng của vấn đề', desc: 'Sống còn hay chỉ là chuyện thứ yếu, vụn vặt?' },
            { title: 'Tầm quan trọng của quan hệ', desc: 'Mối quan hệ chiến lược lâu dài hay giao dịch một lần?' },
            { title: 'Áp lực thời gian', desc: 'Cần hành động khẩn cấp tức thì hay có thời gian phân tích sâu?' },
            { title: 'Mức độ quyền lực tương quan', desc: 'Bạn có quyền hạn cao hơn, thấp hơn hay ngang bằng đối phương?' },
            { title: 'Mức độ phức tạp', desc: 'Vấn đề đơn giản dễ phân chia hay phức tạp đa tầng?' },
            { title: 'Mức độ tin cậy lẫn nhau', desc: 'Hai bên có nền tảng tin tưởng hay đang nghi kỵ đề phòng?' },
            { title: 'Năng lực cam kết của đối phương', desc: 'Đối phương có thiện chí thực thi giải pháp cùng thắng hay không?' },
            { title: 'Mức độ căng thẳng cảm xúc', desc: 'Các bên đang bình tĩnh đối thoại hay đang quá tải giận dữ?' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200">{idx + 1}. {item.title}</div>
              <p className="text-slate-400 text-[11px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
