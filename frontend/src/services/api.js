const isDev = import.meta.env.DEV;
const API_BASE = isDev ? '/api' : '/api';

async function fetchJson(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json();
  if (!data.success && res.status >= 400) throw new Error(data.error || 'Request failed');
  return data;
}

// Schemes API
export const schemesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/schemes?${query}`);
  },
  getById: (id) => fetchJson(`/schemes/${id}`),
  search: (q, params = {}) => {
    const query = new URLSearchParams({ q, ...params }).toString();
    return fetchJson(`/schemes/search?${query}`);
  },
  getByState: (state) => fetchJson(`/schemes/state/${state}`),
  getByCategory: (cat) => fetchJson(`/schemes/category/${cat}`),
  getCategories: () => fetchJson('/schemes/categories'),
  getStates: () => fetchJson('/schemes/states'),
};

// Recommendation API
export const recommendAPI = {
  getRecommendations: (profile) => fetchJson('/recommend', {
    method: 'POST',
    body: JSON.stringify(profile)
  }),
  quickCheck: (profile) => fetchJson('/recommend/quick', {
    method: 'POST',
    body: JSON.stringify(profile)
  }),
};

// Chat API
export const chatAPI = {
  sendMessage: (message, sessionId) => fetchJson('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId })
  }),
  getHistory: (sessionId) => fetchJson(`/chat/history?sessionId=${sessionId}`),
};

// OCR API
export const ocrAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    const res = await fetch(`${API_BASE}/ocr/scan`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },
  autofill: (ocrText) => fetchJson('/ocr/autofill', {
    method: 'POST',
    body: JSON.stringify({ ocrText })
  }),
};

// Location API
export const locationAPI = {
  getSchemesByCoords: (lat, lon) => fetchJson(`/location/schemes?lat=${lat}&lon=${lon}`),
  getStates: () => fetchJson('/location/states'),
};

// User API
export const userAPI = {
  register: (data) => fetchJson('/users/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  login: (phone) => fetchJson('/users/login', {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),
  updateProfile: (data) => fetchJson('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getNotifications: (userId) => fetchJson(`/users/notifications?userId=${userId || ''}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => fetchJson('/analytics/dashboard'),
};
