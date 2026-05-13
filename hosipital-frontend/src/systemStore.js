// systemStore.js — session, auth state & appointment draft store
const USER_KEY  = "healthnest_user";
const TOKEN_KEY = "healthnest_token";
const DRAFT_KEY = "healthnest_appt_draft";

// ── Session ────────────────────────────────────────────
export function setSession(data) {
  if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
  const user = data?.user ?? (data?.token ? null : data);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isLoggedIn() {
  return !!(localStorage.getItem(TOKEN_KEY) || getCurrentUser());
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(DRAFT_KEY);
}

// ── Appointment Draft ──────────────────────────────────
export function saveAppointmentDraft(draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getAppointmentDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAppointmentDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
