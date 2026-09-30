import { TKIAssessmentResult } from '../types/tki';

export const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz_tki_placeholder/exec';

export async function submitTKIAssessmentData(result: TKIAssessmentResult): Promise<boolean> {
  const payload = {
    fullName: result.userProfile.fullName,
    email: result.userProfile.email,
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

  // Always save local backup
  try {
    const history = JSON.parse(localStorage.getItem('tki_assessment_history') || '[]');
    history.push(payload);
    localStorage.setItem('tki_assessment_history', JSON.stringify(history));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }

  // If in local_anonymous mode, do not call webhook
  if (result.userProfile.mode === 'local_anonymous') {
    return true;
  }

  // Attempt Webhook POST
  try {
    if (WEBHOOK_URL && !WEBHOOK_URL.includes('placeholder')) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }
    return true;
  } catch (error) {
    console.error('Webhook submission error:', error);
    return false;
  }
}
