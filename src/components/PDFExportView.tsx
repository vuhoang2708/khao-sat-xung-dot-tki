import React from 'react';
import { TKIAssessmentResult, TKIMode } from '../types/tki';
import { TKI_PROFILES } from '../data/tkiProfiles';
import { Target, Radar, CheckCircle2, AlertTriangle, HelpCircle, Brain, HeartHandshake, Sparkles } from 'lucide-react';

interface PDFExportViewProps {
  result: TKIAssessmentResult;
}

export const PDFExportView: React.FC<PDFExportViewProps> = ({ result }) => {
  const { dominantMode, secondaryMode, scores, userProfile, matrixCoords, completedAt } = result;
  const dominant = TKI_PROFILES[dominantMode];
  const secondary = TKI_PROFILES[secondaryMode];

  // Radar SVG constants
  const radarModes: TKIMode[] = ['competing', 'collaborating', 'compromising', 'accommodating', 'avoiding'];
  const radarSize = 220;
  const center = radarSize / 2;
  const maxRadius = 75;
  const maxScore = 12;
  const angles = [-Math.PI / 2, -Math.PI / 10, (3 * Math.PI) / 10, (7 * Math.PI) / 10, (11 * Math.PI) / 10];

  const getCoordinates = (angle: number, radius: number) => ({
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  });

  const gridLevels = [3, 6, 9, 12];
  const polygonPoints = radarModes
    .map((m, idx) => {
      const score = scores[m].rawScore;
      const r = (score / maxScore) * maxRadius;
      const c = getCoordinates(angles[idx], r);
      return `${c.x},${c.y}`;
    })
    .join(' ');

  // 2D Matrix Pin position
  const pinX = Math.min(90, Math.max(10, matrixCoords.cooperativeness));
  const pinY = Math.min(90, Math.max(10, 100 - matrixCoords.assertiveness));

  return (
    <div id="pdf-export-container" className="flex flex-col gap-10 bg-slate-950 text-slate-100 font-sans">
      {/* ========================================================================= */}
      {/* TRANG 1: TỔNG QUAN HỒ SƠ & TRỰC QUAN HÓA 2 BIỂU ĐỒ                       */}
      {/* ========================================================================= */}
      <div
        id="pdf-page-1"
        className="w-[794px] h-[1123px] p-8 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative box-border border border-slate-800"
      >
        {/* Top Header */}
        <div className="border-b-2 border-indigo-500/60 pb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BÁO CÁO ĐÁNH GIÁ CÁ NHÂN CHUẨN TKI (THOMAS-KILMANN 1974)</span>
            </div>
            <h1 className="text-xl font-black text-white mt-0.5 tracking-tight">
              HỒ SƠ PHONG CÁCH ỨNG XỬ KHI CÓ XUNG ĐỘT
            </h1>
            <p className="text-[10px] text-slate-400">
              Mô hình 5 Phương Thức Ứng Xử • Tích Hợp Trí Tuệ Cảm Xúc (EI) & Giao Tiếp Trắc Ẩn (NVC)
            </p>
          </div>

          <div className="text-right text-[11px] text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
            <div>Người thực hiện: <strong className="text-white">{userProfile.fullName || 'Khách ẩn danh'}</strong></div>
            {userProfile.organizationOrRole && <div>Vị trí: <span className="text-slate-300">{userProfile.organizationOrRole}</span></div>}
            <div className="text-[10px] text-slate-400 mt-0.5">Ngày xuất: {new Date(completedAt).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>

        {/* Dominant & Secondary Hero Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PHONG CÁCH CHỦ ĐẠO
            </span>
            <span className="text-xs font-mono font-bold text-indigo-300">
              Điểm thô: {scores[dominantMode].rawScore}/12 ({scores[dominantMode].percentileLabel.split(' ')[0]}) • {dominant.dimensions.winLoseRatio}
            </span>
          </div>

          <h2 className="text-lg font-black text-white">
            {dominant.vietnameseName} ({dominant.englishName})
          </h2>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {dominant.overview}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <span className="text-slate-400">Phong cách bổ trợ hàng hai:</span>
            <strong className="text-purple-300">{secondary.vietnameseName} ({scores[secondaryMode].rawScore}/12 điểm)</strong>
          </div>
        </div>

        {/* 2 Visual Charts Side-by-Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Chart 1: 2D Matrix */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ma Trận 2 Chiều TKI Grid</span>
              </h3>
              <span className="text-[10px] text-indigo-300 font-mono">
                {matrixCoords.assertiveness}% QĐ • {matrixCoords.cooperativeness}% HT
              </span>
            </div>

            {/* Matrix Box */}
            <div className="relative w-full h-[220px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden p-2 text-[10px]">
              {/* Axes Divider */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 divide-x divide-y divide-slate-800/80 pointer-events-none" />

              {/* Labels */}
              <div className="absolute top-1 left-2 text-[9px] font-bold text-red-400">
                CẠNH TRANH ({scores.competing.rawScore})
              </div>
              <div className="absolute top-1 right-2 text-[9px] font-bold text-emerald-400 text-right">
                HỢP TÁC ({scores.collaborating.rawScore})
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold text-amber-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-500/40 text-center">
                THỎA HIỆP ({scores.compromising.rawScore})
              </div>
              <div className="absolute bottom-1 left-2 text-[9px] font-bold text-slate-400">
                NÉ TRÁNH ({scores.avoiding.rawScore})
              </div>
              <div className="absolute bottom-1 right-2 text-[9px] font-bold text-indigo-400 text-right">
                NHƯỢNG BỘ ({scores.accommodating.rawScore})
              </div>

              {/* Centroid Pin */}
              <div
                className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${pinX}%`, top: `${pinY}%` }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-lg">
                  {userProfile.fullName ? userProfile.fullName[0].toUpperCase() : '★'}
                </div>
                <div className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] font-semibold text-white whitespace-nowrap mt-0.5">
                  Tọa độ của bạn
                </div>
              </div>

              {/* Axis markers */}
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 uppercase">
                ▲ Quyết đoán Cao
              </div>
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-slate-600 uppercase">
                ▼ Quyết đoán Thấp
              </div>
            </div>
          </div>

          {/* Chart 2: Radar 5-Axis */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5 text-purple-400" />
                <span>Biểu Đồ Radar 5 Chiều</span>
              </h3>
              <span className="text-[10px] text-slate-400">Tần suất 5 phong cách</span>
            </div>

            <div className="flex items-center justify-center h-[220px] bg-slate-950 rounded-xl border border-slate-800 relative">
              <svg width={radarSize} height={radarSize} className="overflow-visible">
                {/* Concentric Pentagons */}
                {gridLevels.map((lvl) => {
                  const r = (lvl / maxScore) * maxRadius;
                  const pts = angles
                    .map((a) => {
                      const c = getCoordinates(a, r);
                      return `${c.x},${c.y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={lvl}
                      points={pts}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray={lvl === 12 ? 'none' : '2 2'}
                    />
                  );
                })}

                {/* Axis lines */}
                {angles.map((a, i) => {
                  const c = getCoordinates(a, maxRadius);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={c.x}
                      y2={c.y}
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Filled Polygon */}
                <polygon
                  points={polygonPoints}
                  fill="#6366F1"
                  fillOpacity="0.35"
                  stroke="#818CF8"
                  strokeWidth="2"
                />

                {/* Nodes & Labels */}
                {radarModes.map((m, i) => {
                  const score = scores[m].rawScore;
                  const r = (score / maxScore) * maxRadius;
                  const nodeCoord = getCoordinates(angles[i], r);
                  const labelCoord = getCoordinates(angles[i], maxRadius + 14);
                  const p = TKI_PROFILES[m];

                  return (
                    <g key={m}>
                      <circle
                        cx={nodeCoord.x}
                        cy={nodeCoord.y}
                        r="3.5"
                        fill={m === dominantMode ? '#F59E0B' : '#818CF8'}
                        stroke="#0F172A"
                        strokeWidth="1.5"
                      />
                      <text
                        x={labelCoord.x}
                        y={labelCoord.y + 3}
                        fontSize="8"
                        fontWeight="bold"
                        fill={m === dominantMode ? '#FBBF24' : '#94A3B8'}
                        textAnchor="middle"
                      >
                        {p.vietnameseName.split(' ')[0]} ({score})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Bảng Tổng Hợp Điểm Thô & Thang Phân Vị Chuẩn Hóa
          </h3>
          <table className="w-full text-left text-[11px] border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
              <tr>
                <th className="p-2">Phương Thức Ứng Xử</th>
                <th className="p-2 text-center">Điểm Thô</th>
                <th className="p-2 text-center">Tỷ Lệ %</th>
                <th className="p-2 text-center">Thang Phân Vị</th>
                <th className="p-2">Nhận Định Chuẩn Mực Dân Số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(['competing', 'collaborating', 'compromising', 'avoiding', 'accommodating'] as const).map((m) => {
                const p = TKI_PROFILES[m];
                const s = scores[m];
                const isDom = m === dominantMode;
                return (
                  <tr key={m} className={isDom ? 'bg-indigo-950/40 font-semibold text-white' : 'text-slate-300'}>
                    <td className="p-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color.accent }} />
                      <span>{p.vietnameseName} ({p.code})</span>
                      {isDom && <span className="text-amber-400 text-[10px]">★ Chủ đạo</span>}
                    </td>
                    <td className="p-2 text-center font-mono font-bold">{s.rawScore} / 12</td>
                    <td className="p-2 text-center font-mono">{s.percentage}%</td>
                    <td className="p-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.percentileLevel === 'high' ? 'bg-red-500/20 text-red-300' :
                        s.percentileLevel === 'low' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {s.percentileLabel.split(' ')[0]}
                      </span>
                    </td>
                    <td className="p-2 text-[10px] text-slate-400">{s.normDescription}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-[10px] text-slate-500 italic">
            * Tổng điểm thô cả 5 phương thức luôn bằng chính xác 30 điểm (30 cặp phát biểu bắt buộc).
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[10px] text-slate-500">
          <span>Hệ Thống Đánh Giá TKI • Trang 1 / 3</span>
          <span>Bản quyền lý thuyết Thomas & Kilmann (1974) • Tích hợp EI & NVC</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TRANG 2: PHÂN TÍCH CHUYÊN SÂU PHONG CÁCH CHỦ ĐẠO & BỔ TRỢ                */}
      {/* ========================================================================= */}
      <div
        id="pdf-page-2"
        className="w-[794px] h-[1123px] p-8 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative box-border border border-slate-800"
      >
        {/* Top Header Mini */}
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between text-[11px]">
          <div className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PHÂN TÍCH CHUYÊN SÂU HỒ SƠ PHONG CÁCH XUNG ĐỘT</span>
          </div>
          <div className="text-slate-400">
            Người thực hiện: <strong className="text-white">{userProfile.fullName || 'Khách'}</strong>
          </div>
        </div>

        {/* Dominant Deep Dive Block */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                1. PHÂN TÍCH PHONG CÁCH CHỦ ĐẠO: {dominant.vietnameseName.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-indigo-400 font-bold">
                {scores[dominantMode].rawScore}/12 điểm ({scores[dominantMode].percentileLabel})
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {dominant.tagline}. {dominant.overview}
            </p>
          </div>

          {/* Strengths & Overuse Risks */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Strengths */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Điểm Mạnh Khi Vận Dụng</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {dominant.strengths.slice(0, 4).map((st, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="leading-snug">{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Overuse Risks */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Nguy Cơ Khi Lạm Dụng ({'>'}75%)</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {dominant.overuseRisks.slice(0, 4).map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="leading-snug">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coaching Questions */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Câu Hỏi Tự Vấn Khai Mở Cho Phong Cách Chủ Đạo</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300">
              {dominant.eiReflectionQuestions.slice(0, 2).map((q, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <span className="text-indigo-400 font-bold">Q{i+1}: </span>{q}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Deep Dive Block */}
        <div className="space-y-2.5">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                2. PHONG CÁCH BỔ TRỢ HÀNG HAI: {secondary.vietnameseName.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-purple-300 font-bold">
                {scores[secondaryMode].rawScore}/12 điểm ({scores[secondaryMode].percentileLabel})
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {secondary.overview}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">Thế mạnh bổ trợ:</strong>
              <p className="text-slate-300 leading-relaxed">{secondary.strengths[0]}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <strong className="text-amber-400 block mb-1">Cần lưu ý:</strong>
              <p className="text-slate-300 leading-relaxed">{secondary.overuseRisks[0]}</p>
            </div>
          </div>
        </div>

        {/* Visual Percentile Range Bars */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            3. Thang Đo Phân Vị So Sánh Chuẩn Mực Dân Số
          </h4>
          <div className="space-y-1.5 text-[10px]">
            {(['competing', 'collaborating', 'compromising', 'avoiding', 'accommodating'] as const).map((m) => {
              const p = TKI_PROFILES[m];
              const s = scores[m];
              const pct = (s.rawScore / 12) * 100;
              return (
                <div key={m} className="flex items-center gap-2">
                  <span className="w-24 text-slate-300 font-semibold truncate">{p.vietnameseName}</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: s.percentileLevel === 'high' ? '#EF4444' : s.percentileLevel === 'low' ? '#F59E0B' : '#10B981',
                      }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono font-bold text-white">{s.rawScore}/12</span>
                  <span className={`w-16 text-right font-semibold ${
                    s.percentileLevel === 'high' ? 'text-red-400' : s.percentileLevel === 'low' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {s.percentileLabel.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[10px] text-slate-500">
          <span>Hệ Thống Đánh Giá TKI • Trang 2 / 3</span>
          <span>Phân Tích Chuyên Sâu • Thomas & Kilmann (1974)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TRANG 3: ĐỊNH HƯỚNG TỰ VẤN EI, NVC & CHIẾN LƯỢC PHỐI HỢP ĐỒNG ĐỘI        */}
      {/* ========================================================================= */}
      <div
        id="pdf-page-3"
        className="w-[794px] h-[1123px] p-8 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative box-border border border-slate-800"
      >
        {/* Top Header Mini */}
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between text-[11px]">
          <div className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            <span>ĐỊNH HƯỚNG TỰ VẤN EI, NVC & CHIẾN LƯỢC PHỐI HỢP ĐỒNG ĐỘI</span>
          </div>
          <div className="text-slate-400">
            Người thực hiện: <strong className="text-white">{userProfile.fullName || 'Khách'}</strong>
          </div>
        </div>

        {/* Section 1: EI Self-Reflection */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 space-y-2">
          <h3 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>1. Khung Rèn Luyện Trí Tuệ Cảm Xúc (Emotional Intelligence - EI)</span>
          </h3>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Xung đột bắt nguồn từ các cảm xúc vô thức bị kích hoạt. Người có trí tuệ cảm xúc cao biết cách nhận diện phản ứng cơ thể trước khi buông lời phản bác.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <strong className="text-amber-300 block">Kỹ Thuật "Dừng Lại 3 Giây":</strong>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Khi cảm thấy tim đập nhanh hoặc muốn phản biện ngay, hãy hít thở sâu 3 giây để kích hoạt vỏ não trước trán (Prefrontal Cortex), chuyển quyền kiểm soát từ bản năng sang lý trí.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <strong className="text-indigo-300 block">Tự Vấn Nhận Thức Bản Thân:</strong>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                "Tôi đang cố gắng bảo vệ quan điểm hay đang thực sự muốn giải quyết công việc? Nhu cầu ẩn sau sự khó chịu này của tôi là gì?"
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: 4-Step NVC Framework */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5">
          <h3 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>2. Quy Trình 4 Bước Giao Tiếp Trắc Ẩn (NVC) Khi Xung Đột</span>
          </h3>
          <p className="text-[11px] text-slate-300">
            Chuyển hóa mâu thuẫn thành cơ hội Hợp tác (Collaborating) cùng thắng:
          </p>

          <div className="grid grid-cols-2 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Quan Sát (Observation)</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Nêu rõ hành vi hoặc sự việc thực tế một cách trung lập, tuyệt đối không kèm suy diễn hay phán xét.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Cảm Xúc (Feelings)</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Bộc lộ chân thật cảm xúc của mình (VD: "Tôi cảm thấy lo lắng khi tiến độ trễ") thay vì đổ lỗi cho đối phương.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Nhu Cầu (Needs)</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Làm rõ giá trị cốt lõi hoặc mong đợi của mình (sự an toàn, tính minh bạch, sự tôn trọng, chất lượng công việc).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Đề Nghị (Requests)</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Đưa ra đề xuất hành động cụ thể, khả thi, bằng câu hỏi cởi mở (VD: "Anh/chị thấy sao nếu ta cùng review lại số liệu vào sáng mai?").
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Team Collaboration Matrix */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-indigo-400" />
            <span>3. Bí Quyết Phối Hợp Đồng Đội Theo Phong Cách</span>
          </h3>

          <div className="space-y-1.5 text-[10px]">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <span className="font-bold text-red-400 w-28 shrink-0">• Khi gặp Cạnh tranh:</span>
              <span className="text-slate-300">Đi thẳng vào trọng tâm, chuẩn bị số liệu logic vững vàng, làm rõ các giới hạn rõ ràng.</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <span className="font-bold text-emerald-400 w-28 shrink-0">• Khi gặp Hợp tác:</span>
              <span className="text-slate-300">Hãy cởi mở chia sẻ bức tranh toàn cảnh, lắng nghe chân thành và cùng nhau kiến tạo giải pháp mới.</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <span className="font-bold text-amber-400 w-28 shrink-0">• Khi gặp Thỏa hiệp:</span>
              <span className="text-slate-300">Xác định các điểm mấu chốt không thể nhượng bộ, sẵn sàng chia sẻ lợi ích công bằng để chốt thỏa thuận.</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <span className="font-bold text-slate-400 w-28 shrink-0">• Khi gặp Né tránh:</span>
              <span className="text-slate-300">Tạo không gian an toàn, không dồn ép, cho họ thời gian suy nghĩ và chủ động mở lời trước.</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <span className="font-bold text-indigo-400 w-28 shrink-0">• Khi gặp Nhượng bộ:</span>
              <span className="text-slate-300">Chủ động hỏi ý kiến thật của họ, tránh vô tình lấn lướt sự nhẫn nhịn và lòng tốt của họ.</span>
            </div>
          </div>
        </div>

        {/* Page 3 Footer */}
        <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[10px] text-slate-500">
          <span>Hệ Thống Đánh Giá TKI • Trang 3 / 3</span>
          <span>Bản Quyền Khoa Học Thomas-Kilmann (1974) • Xuất Báo Cáo Tự Động</span>
        </div>
      </div>
    </div>
  );
};
