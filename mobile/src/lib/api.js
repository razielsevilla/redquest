const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) ||
  DEFAULT_API_BASE_URL;

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = body?.error || body?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return body;
}

export async function registerUser(payload) {
  return requestJson('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return requestJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
