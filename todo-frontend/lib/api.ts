import Cookies from 'js-cookie';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api';
export const API_ROOT = API_BASE_URL.replace(/\/api$/, '');

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('auth_token');
  const isFormData = options.body instanceof FormData;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove('auth_token');
        window.location.href = '/login';
        return null;
      }
      
      const errorData = await response.json().catch(() => ({}));
      console.error(`LARAVEL ERROR ON ${endpoint}:`, errorData);
      throw new Error(`API Request Failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`NETWORK ERROR ON ${endpoint}: Is the Laravel server running?`, error);
    throw error;
  }
};