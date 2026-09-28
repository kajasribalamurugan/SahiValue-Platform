export const API_BASE_URL = ((import.meta as any).env && (import.meta as any).env.VITE_API_URL)
  ? (import.meta as any).env.VITE_API_URL
  : 'http://127.0.0.1:8001/api';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sahivalue_recycler_access_token',
  USER_DATA: 'sahivalue_recycler_user_data',
};

export interface ApiError {
  status: number;
  message: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.replace(/^\/?(api\/)?/, '');
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred.';
      if (response.status === 401) {
        errorMessage = responseData?.detail || 'Invalid phone number or password.';
      } else if (response.status === 409) {
        errorMessage = responseData?.detail || 'This account or phone number is already registered.';
      } else if (response.status === 422) {
        errorMessage = responseData?.detail || 'Invalid input details. Please check all fields.';
      } else if (responseData?.detail) {
        errorMessage = typeof responseData.detail === 'string'
          ? responseData.detail
          : JSON.stringify(responseData.detail);
      }

      const error: ApiError = {
        status: response.status,
        message: errorMessage,
      };
      throw error;
    }

    return responseData as T;
  } catch (err: any) {
    if (err.status) {
      throw err;
    }
    const networkError: ApiError = {
      status: 0,
      message: 'Unable to connect to SAHI VALUE backend server.',
    };
    throw networkError;
  }
}
