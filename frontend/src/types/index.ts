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
  | 'CREATED'
  | (string & {});

export interface Material {
  id: string;
  name: string;
  officialName?: string;
  displayName?: Record<'en' | 'hi' | 'mr', string>;
  category: string;
  pricePerKg: number;
  iconName: string;
  description: string;
  sampleItems: string[];
  co2SavedPerKg: number; // in kg
  metalRecoveryRate: string; // e.g. '94% Gold/Copper'
  badge?: string;
  color: string;
}

export interface Recycler {
  id: string;
  name: string;
  officialName?: string;
  displayName?: Record<'en' | 'hi' | 'mr', string>;
  distance: string;
  rating: number;
  reviewsCount: number;
  address: string;
  rateBonusPercent: number; // e.g. 5 for +5% bonus rate
  cpcbAuthorized: boolean;
  phone: string;
  isMockData: boolean;
}

export interface Lot {
  id: string;
  material: Material;
  declaredWeight: number; // in kg - entered by collector
  estimatedPayout: number; // calculated from declared weight
  recycler: Recycler;
  verifiedWeight: number | null; // in kg - entered by recycler physically
  finalPayout: number | null; // strictly calculated using verified weight
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
