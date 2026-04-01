const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const TIMEOUT_MS = 10000;

function buildUrl(endpoint, params) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request(method, endpoint, { body, params, headers: extraHeaders } = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const url = buildUrl(endpoint, params);

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Request timed out');
      timeoutError.code = 'ECONNABORTED';
      throw timeoutError;
    }
    throw err;
  }

  clearTimeout(timeoutId);

  const isLogoutRequest = endpoint.includes('/logout');

  // Handle 401 Unauthorized (token expired or invalid)
  if (response.status === 401 && !isLogoutRequest) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  if (isLogoutRequest && !response.ok) {
    console.warn('Logout request failed, but continuing with local logout');
  }

  // Parse response body
  let data = null;
  const contentType = response.headers.get('content-type');
  if (response.status !== 204) {
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = (await response.text()) || null;
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP error ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
}

const apiClient = {
  get: (endpoint, options = {}) => request('GET', endpoint, options),
  post: (endpoint, body, options = {}) => request('POST', endpoint, { ...options, body }),
  put: (endpoint, body, options = {}) => request('PUT', endpoint, { ...options, body }),
  patch: (endpoint, body, options = {}) => request('PATCH', endpoint, { ...options, body }),
  delete: (endpoint, options = {}) => request('DELETE', endpoint, options),
};

export default apiClient;