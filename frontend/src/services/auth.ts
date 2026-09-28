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

export interface RecyclerRegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  facility_name: string;
  authorization_number: string;
  location: string;
  pickup_available?: boolean;
}

export interface BackendLot {
  id: number;
  lot_id: string;
  collector_id: number;
  recycler_id: number;
  material_id: number;
  declared_weight: number;
  verified_weight?: number | null;
  rate: number;
  estimated_value: number;
  final_amount?: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  verified_at?: string | null;
  completed_at?: string | null;
  collector?: UserProfile | null;
  material?: {
    id: number;
    name: string;
    category: string;
    rate: number;
    unit: string;
  } | null;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registerRecycler: async (payload: RecyclerRegisterPayload): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register/recycler', {
      method: 'POST',
      body: JSON.stringify({
        pickup_available: true,
        ...payload,
      }),
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

  getMyLots: async (): Promise<BackendLot[]> => {
    return apiRequest<BackendLot[]>('/recyclers/me/lots', {
      method: 'GET',
    });
  },

  acceptLot: async (lotId: string): Promise<BackendLot> => {
    return apiRequest<BackendLot>(`/lots/${lotId}/accept`, {
      method: 'POST',
    });
  },

  rejectLot: async (lotId: string): Promise<BackendLot> => {
    return apiRequest<BackendLot>(`/lots/${lotId}/reject`, {
      method: 'POST',
    });
  },

  verifyLotWeight: async (lotId: string, verifiedWeight: number): Promise<BackendLot> => {
    return apiRequest<BackendLot>(`/lots/${lotId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ verified_weight: verifiedWeight }),
    });
  },

  completeLot: async (lotId: string, paymentMethod: string = 'UPI'): Promise<BackendLot> => {
    return apiRequest<BackendLot>(`/lots/${lotId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ payment_method: paymentMethod }),
    });
  },
};
