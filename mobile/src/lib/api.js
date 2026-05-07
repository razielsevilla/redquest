import * as storage from './storage';
import Constants from 'expo-constants';

// Priority:
// 1. app.json extra.apiBaseUrl  — baked into the binary at build time (most reliable)
// 2. EXPO_PUBLIC_API_BASE_URL   — Metro env var replacement (works when set correctly)
// 3. Hardcoded Railway URL      — final fallback, never localhost
const RAILWAY_URL = 'https://redquest-production.up.railway.app';

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) ||
  RAILWAY_URL;

const AUTH_TOKEN_KEY = 'redquest.authToken';

async function requestJson(path, options = {}) {
  // Automatically inject JWT token
  const token = await storage.getItem(AUTH_TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = body?.error || body?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return body;
}

// ── AUTHENTICATION ──
export async function registerUser(payload) {
  return requestJson('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export async function loginUser(payload) {
  return requestJson('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

// ── USERS ──
export async function getMe() {
  return requestJson('/users/me', { method: 'GET' });
}

// ── HOSPITALS ──
export async function getHospitals() {
  return requestJson('/hospitals', { method: 'GET' });
}

// ── REQUESTS ──
export async function createRequest(payload) {
  return requestJson('/requests', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getRequestDetails(id) {
  return requestJson(`/requests/${id}`, { method: 'GET' });
}

export async function getMyRequests() {
  return requestJson('/requests/me', { method: 'GET' });
}


// ── QUESTS ──
export async function getActiveQuest() {
  return requestJson('/quests/active', { method: 'GET' });
}

export async function getQuestHistory() {
  return requestJson('/quests/history', { method: 'GET' });
}

export async function acceptQuest(id) {
  return requestJson(`/quests/${id}/accept`, { method: 'POST' });
}

export async function declineQuest(id) {
  return requestJson(`/quests/${id}/decline`, { method: 'POST' });
}

// ── CHECK-IN ──
export async function checkinSimulate(questId) {
  return requestJson('/checkin/simulate', { method: 'POST', body: JSON.stringify({ quest_id: questId }) });
}
