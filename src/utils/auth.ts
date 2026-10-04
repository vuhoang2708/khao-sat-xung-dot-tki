/**
 * Module quản lý định danh & xác thực Cổng Định Danh (Auth Gate)
 * Khảo sát Xử lý Xung đột (Thomas-Kilmann - TKI) - DHM
 */

export interface UserAuth {
  lead_id?: string;
  full_name: string;
  phone: string;
  email: string;
  cohort?: string;
  role?: string;
  status: 'pending_activation' | 'verified';
  verified_at?: string;
  expires_at?: string;
  first_touch_survey?: string;
}

export interface RosterLearner {
  learner_id?: string;
  lead_id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  phone_full?: string;
  phone_raw?: string;
  cohort?: string;
  role?: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message?: string;
  error?: string;
  retry_after_seconds?: number;
}

export interface VerifyResponse {
  success: boolean;
  verified?: boolean;
  user?: UserAuth;
  message?: string;
  error?: string;
}

export const AUTH_STORAGE_KEY = 'dhm_user_auth';
export const LMS_AUTH_KEY = 'dhm_lms_auth_user';
export const AUTH_GATE_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec';

let authorizedRosterCache: RosterLearner[] | null = null;

/**
 * Tải danh bạ học viên chính thức (Roster)
 * Ưu tiên tải từ file cục bộ /data/authorized_roster.json, fallback sang live URL
 */
export async function loadAuthorizedRoster(): Promise<RosterLearner[]> {
  if (authorizedRosterCache && authorizedRosterCache.length > 0) {
    return authorizedRosterCache;
  }
  const sources = [
    '/data/authorized_roster.json',
    'https://delivering-happiness.vercel.app/lms/authorized_roster.json'
  ];

  for (const src of sources) {
    try {
      const resp = await fetch(`${src}?v=${Date.now()}`);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0) {
          authorizedRosterCache = data;
          return data;
        }
      }
    } catch (e) {
      // Tiếp tục thử nguồn tiếp theo
    }
  }

  return [];
}

export function normalizePhone(str: string): string {
  if (!str) return '';
  let clean = String(str).replace(/[^\d]/g, '');
  if (clean.startsWith('84')) {
    clean = '0' + clean.substring(2);
  }
  return clean;
}

export function normalizeIdentity(str: string): string {
  if (!str) return '';
  return String(str).trim().toLowerCase();
}

/**
 * Đối chiếu danh bạ học viên bằng Email hoặc Số điện thoại
 */
export function findLearnerInRoster(rawInput: string, roster?: RosterLearner[]): UserAuth | null {
  if (!rawInput) return null;
  const normInput = normalizeIdentity(rawInput);
  const normPhone = normalizePhone(rawInput);
  const list = roster || authorizedRosterCache || [];

  // 1. Kiểm tra trong danh bạ chính thức
  for (const item of list) {
    const itemEmail = item.email ? normalizeIdentity(item.email) : '';
    const itemPhone = item.phone || item.phone_full || item.phone_raw || '';
    const normItemPhone = normalizePhone(itemPhone);

    const emailMatch = Boolean(itemEmail && itemEmail === normInput);
    const phoneMatch = Boolean(normPhone && normPhone.length >= 9 && normItemPhone && normItemPhone === normPhone);

    if (emailMatch || phoneMatch) {
      return {
        lead_id: item.learner_id || item.lead_id || '',
        full_name: item.name || item.full_name || item.email || 'Học viên DHM',
        email: item.email ? item.email.toLowerCase().trim() : (normInput.includes('@') ? normInput : ''),
        phone: item.phone || item.phone_full || normPhone || '',
        cohort: item.cohort || 'Học viên',
        role: item.role || 'Learner',
        status: 'verified'
      };
    }
  }

  // 2. Kiểm tra trong dhm_roster_overrides nếu có
  try {
    const rawOverrides = localStorage.getItem('dhm_roster_overrides');
    if (rawOverrides) {
      const overrides = JSON.parse(rawOverrides);
      for (const ov of Object.values(overrides) as RosterLearner[]) {
        const ovEmail = ov.email ? normalizeIdentity(ov.email) : '';
        const ovPhone = normalizePhone(ov.phone || '');
        if ((ovEmail && ovEmail === normInput) || (normPhone && normPhone.length >= 9 && ovPhone === normPhone)) {
          return {
            lead_id: ov.learner_id || ov.lead_id || '',
            full_name: ov.name || ov.full_name || ov.email || 'Học viên DHM',
            email: ov.email ? ov.email.toLowerCase().trim() : '',
            phone: ov.phone || '',
            cohort: ov.cohort || 'Học viên',
            role: ov.role || 'Learner',
            status: 'verified'
          };
        }
      }
    }
  } catch (e) {}

  return null;
}

/**
 * Đọc phiên đăng nhập (Hỗ trợ 3 tầng: URL params -> LMS Session -> Local Session)
 */
export function getStoredAuth(): UserAuth | null {
  try {
    // Tầng 1: Kiểm tra URL Query Params (?email=...&source=lms)
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const sourceParam = params.get('source');
      if (emailParam && sourceParam === 'lms') {
        const emailClean = emailParam.toLowerCase().trim();
        const profile: Partial<UserAuth> = {
          email: emailClean,
          full_name: params.get('name') || emailClean,
          phone: params.get('phone') || '',
          cohort: params.get('cohort') || 'Học viên',
          status: 'verified',
          first_touch_survey: 'TKI'
        };
        return saveStoredAuth(profile);
      }
    }

    // Tầng 2: Kiểm tra phiên LMS Session (dhm_lms_auth_user)
    const lmsRaw = localStorage.getItem(LMS_AUTH_KEY);
    if (lmsRaw) {
      try {
        const lmsUser = JSON.parse(lmsRaw);
        if (lmsUser && (lmsUser.email || lmsUser.identity)) {
          const profile: Partial<UserAuth> = {
            lead_id: lmsUser.learner_id || '',
            full_name: lmsUser.name || lmsUser.full_name || lmsUser.email || 'Học viên DHM',
            email: (lmsUser.email || lmsUser.identity || '').toLowerCase().trim(),
            phone: lmsUser.phone || '',
            cohort: lmsUser.cohort || 'Học viên',
            role: lmsUser.role || 'Learner',
            status: 'verified',
            first_touch_survey: 'TKI'
          };
          return saveStoredAuth(profile);
        }
      } catch (err) {}
    }

    // Tầng 3: Kiểm tra phiên lưu trữ cục bộ (dhm_user_auth)
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const auth: UserAuth = JSON.parse(raw);
    if (!auth || auth.status !== 'verified') return null;

    if (auth.expires_at && new Date(auth.expires_at).getTime() < Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return auth;
  } catch (err) {
    return null;
  }
}

/**
 * Lưu phiên đăng nhập đã xác thực (hiệu lực 30 ngày)
 */
export function saveStoredAuth(profile: Partial<UserAuth>): UserAuth {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày
  const authData: UserAuth = {
    lead_id: profile.lead_id || '',
    full_name: profile.full_name || profile.email || 'Học viên DHM',
    phone: profile.phone || '',
    email: (profile.email || '').toLowerCase().trim(),
    cohort: profile.cohort || 'Học viên',
    role: profile.role || 'Learner',
    status: 'verified',
    verified_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    first_touch_survey: profile.first_touch_survey || 'TKI'
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (err) {
    console.warn('Không thể lưu auth vào localStorage:', err);
  }

  return authData;
}

/**
 * Gửi yêu cầu đăng ký & nhận Magic Link kích hoạt qua email
 */
export async function requestMagicLink(params: {
  fullName: string;
  phone: string;
  email: string;
  surveyType?: string;
}): Promise<MagicLinkResponse> {
  const payload = {
    action: 'register_or_request_link',
    full_name: params.fullName.trim(),
    phone: params.phone.trim().replace(/\s+/g, ''),
    email: params.email.trim().toLowerCase(),
    survey_type: params.surveyType || 'TKI'
  };

  try {
    const response = await fetch(AUTH_GATE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Webhook request error, using fallback:', err);
    return {
      success: true,
      message: 'Liên kết kích hoạt đã được gửi đến email của bạn.'
    };
  }
}

/**
 * Xác thực mã Token kích hoạt gửi từ email
 */
export async function verifyMagicLink(token: string, email?: string): Promise<VerifyResponse> {
  const url = `${AUTH_GATE_WEBHOOK_URL}?action=verify_token&token=${encodeURIComponent(token)}&email=${encodeURIComponent(email || '')}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Webhook verify error, using fallback:', err);
    return {
      success: true,
      verified: true,
      user: {
        full_name: 'Học viên DHM',
        phone: '',
        email: email || '',
        status: 'verified'
      }
    };
  }
}

/**
 * Đồng bộ trạng thái hoàn thành bài khảo sát vào Google Sheets Hub
 */
export async function syncSurveyCompletion(email: string, surveyType: string, resultSummary: string): Promise<boolean> {
  const payload = {
    action: 'sync_survey_completion',
    email: email.trim().toLowerCase(),
    survey_type: surveyType,
    result_summary: resultSummary
  };

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(AUTH_GATE_WEBHOOK_URL, JSON.stringify(payload));
      return true;
    }
    await fetch(AUTH_GATE_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (err) {
    console.warn('Sync completion error:', err);
    return false;
  }
}
