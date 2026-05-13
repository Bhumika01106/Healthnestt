// api.js — all backend API calls used across the app
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("healthnest_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Request failed (${res.status})`);
  return data;
}

// ── Auth ───────────────────────────────────────────────
export const authApi = {
  login:    (payload) => request("/api/auth/login",    { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  logout:   ()        => request("/api/auth/logout",   { method: "POST" }).catch(() => {}),
  me:       ()        => request("/api/auth/me"),
};

// ── Appointments ───────────────────────────────────────
export const appointmentsApi = {
  list:    ()            => request("/api/appointments"),           // Dashboard & MyAppointments
  getAll:  ()            => request("/api/appointments"),           // alias
  getById: (id)          => request(`/api/appointments/${id}`),
  create:  (payload)     => request("/api/appointments",            { method: "POST",   body: JSON.stringify(payload) }),
  update:  (id, payload) => request(`/api/appointments/${id}`,      { method: "PUT",    body: JSON.stringify(payload) }),
  cancel:  (id)          => request(`/api/appointments/${id}`,      { method: "DELETE" }),
};

// ── Catalog (doctors & departments) ───────────────────
export const catalogApi = {
  doctors:        () => request("/api/doctors"),
  departments:    () => request("/api/departments"),
  getDoctors:     () => request("/api/doctors"),       // alias
  getDepartments: () => request("/api/departments"),   // alias
};

// ── Profile ────────────────────────────────────────────
export const profileApi = {
  get:             ()        => request("/api/profile"),
  update:          (payload) => request("/api/profile",          { method: "PUT", body: JSON.stringify(payload) }),
  changePassword:  (payload) => request("/api/profile/password", { method: "PUT", body: JSON.stringify(payload) }),
};
