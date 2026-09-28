import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../config/api';

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

  // Automatically attach Bearer token if present
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore storage errors
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
        errorMessage = responseData?.detail || 'Incorrect mobile number or password.';
      } else if (response.status === 409) {
        errorMessage = responseData?.detail || 'This mobile number is already registered.';
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
    // Network connectivity error
    const networkError: ApiError = {
      status: 0,
      message: 'Unable to connect to SAHI VALUE server. Please check your connection.',
    };
    throw networkError;
  }
}

export interface BackendLotCreatePayload {
  material_id: number;
  declared_weight: number;
  recycler_id?: number;
}

export interface BackendLotResponse {
  id: number;
  lot_id: string;
  collector_id: number;
  recycler_id?: number | null;
  material_id: number;
  declared_weight: number;
  verified_weight?: number | null;
  rate: number;
  estimated_value: number;
  final_amount?: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  collector?: any;
  recycler?: any;
  material?: any;
}

export const lotApiService = {
  createLot: async (payload: BackendLotCreatePayload): Promise<BackendLotResponse> => {
    return apiRequest<BackendLotResponse>('/lots', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getLotDetails: async (lotId: string): Promise<BackendLotResponse> => {
    return apiRequest<BackendLotResponse>(`/lots/${lotId}`, {
      method: 'GET',
    });
  },

  getCollectorLots: async (): Promise<BackendLotResponse[]> => {
    return apiRequest<BackendLotResponse[]>('/lots', {
      method: 'GET',
    });
  },
};
