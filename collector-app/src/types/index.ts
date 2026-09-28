export type UserRole = 'collector' | 'recycler';

export type LotStatus =
  | 'PENDING_ACCEPTANCE'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'AWAITING_HANDOVER'
  | 'HANDOVER_IN_PROGRESS'
  | 'PENDING_HANDOVER'
  | 'VERIFIED'
  | 'PAID'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'CREATED';

export type Language = 'en' | 'hi' | 'mr';

export interface Material {
  id: string;
  name: string;
  officialName?: string;
  displayName?: Record<Language, string>;
  category: string;
  pricePerKg: number;
  iconName: string;
  description: string;
  sampleItems: string[];
  co2SavedPerKg: number;
  metalRecoveryRate: string;
  badge?: string;
  color: string;
}

export interface Recycler {
  id: string;
  name: string;
  officialName?: string;
  displayName?: Record<Language, string>;
  distance: string;
  rating: number;
  reviewsCount: number;
  address: string;
  rateBonusPercent: number;
  cpcbAuthorized: boolean;
  phone: string;
  isMockData: boolean;
}

export interface Lot {
  id: string;
  material: Material;
  declaredWeight: number;
  estimatedPayout: number;
  recycler: Recycler;
  verifiedWeight: number | null;
  finalPayout: number | null;
  status: LotStatus;
  createdAt: string;
  completedAt: string | null;
  qrCodeData: string;
  verificationPin: string;
  paymentMode?: 'INSTANT_UPI' | 'DIRECT_BANK' | 'CASH';
  utrNumber?: string;
}

export interface DraftLot {
  materialId?: string;
  declaredWeight?: number;
  recyclerId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'SETTLEMENT' | 'PRICE_UPDATE' | 'COMPLIANCE' | 'SYSTEM';
  lotId?: string;
}

export interface CollectorProfile {
  name: string;
  officialName: string;
  displayName: Record<Language, string>;
  phone: string;
  zone: string;
  upiId: string;
  verified: boolean;
}
