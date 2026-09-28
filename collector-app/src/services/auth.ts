import { apiRequest } from './api';

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  role: 'COLLECTOR' | 'RECYCLER';
  language: string;
  location?: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface CollectorRegisterPayload {
  name: string;
  phone: string;
  password: string;
  language: string;
  location?: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registerCollector: async (payload: CollectorRegisterPayload): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register/collector', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe: async (token?: string): Promise<UserProfile> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return apiRequest<UserProfile>('/auth/me', {
      method: 'GET',
      headers,
    });
  },
};
