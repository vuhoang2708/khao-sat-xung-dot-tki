import { TKIAssessmentResult } from '../types/tki';

// Google Apps Script Webhook URL chính thức của Delivering Happiness (đồng bộ về Google Sheets CRM & Leads_Directory)
export const WEBHOOK_URL =
  ((import.meta as any).env?.VITE_WEBHOOK_URL as string) ||
  'https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec';

export async function submitTKIAssessmentData(result: TKIAssessmentResult): Promise<boolean> {
  const resultSummary = `Chủ đạo: ${result.dominantMode} (Bổ trợ: ${result.secondaryMode || 'N/A'}) • Điểm: Cạnh tranh=${result.scores.competing.rawScore}, Hợp tác=${result.scores.collaborating.rawScore}, Thỏa hiệp=${result.scores.compromising.rawScore}, Tránh né=${result.scores.avoiding.rawScore}, Nhượng bộ=${result.scores.accommodating.rawScore}`;

  const payload = {
    action: 'sync_survey_completion',
    email: (result.userProfile.email || '').trim().toLowerCase(),
    survey_type: 'TKI',
    result_summary: resultSummary,
    result_url: typeof window !== 'undefined' ? window.location.href : '',
    fullName: result.userProfile.fullName,
    organization: result.userProfile.organizationOrRole,
    mode: result.userProfile.mode,
    dominantMode: result.dominantMode,
    secondaryMode: result.secondaryMode,
    scores: result.scores,
    matrixCoords: result.matrixCoords,
    overusedModes: result.overusedModes,
    underusedModes: result.underusedModes,
    answers: result.answers,
    completedAt: result.completedAt,
  };

  // 1. Luôn lưu bản sao dự phòng vào LocalStorage
  try {
    const history = JSON.parse(localStorage.getItem('tki_assessment_history') || '[]');
    history.push(payload);
    localStorage.setItem('tki_assessment_history', JSON.stringify(history));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }

  // 2. Nếu ở chế độ ẩn danh hoàn toàn không có email, không gọi webhook
  if (result.userProfile.mode === 'local_anonymous' && !result.userProfile.email) {
    return true;
  }

  // 3. Thực hiện gửi Webhook POST đồng bộ lên Google Sheets
  try {
    if (WEBHOOK_URL && !WEBHOOK_URL.includes('placeholder')) {
      const resp = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });
      const text = await resp.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      // Auto-heal: nếu chưa có Lead trong CRM Hub, tự động đăng ký và đồng bộ lại
      if (data && data.error === 'LEAD_NOT_FOUND') {
        try {
          const regPayload = {
            action: 'register_or_request_link',
            email: payload.email,
            full_name: payload.fullName || 'Học viên DHM',
            phone: '0900000000',
            survey_type: 'TKI'
          };
          await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(regPayload),
            redirect: 'follow'
          });

          const retryResp = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
            redirect: 'follow'
          });
          const retryText = await retryResp.text();
          data = JSON.parse(retryText);
        } catch (retryErr) {
          console.warn('Auto-heal lead registration notice:', retryErr);
        }
      }

      return Boolean(data && data.success);
    }
    return true;
  } catch (error) {
    console.error('Webhook submission error:', error);
    return false;
  }
}
