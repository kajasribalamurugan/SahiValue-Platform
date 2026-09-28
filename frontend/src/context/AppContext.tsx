import React, { createContext, useContext, useState, useEffect } from 'react';
import { Material, Recycler, Lot, DraftLot, UserRole } from '../types';

interface AppContextType {
  materials: Material[];
  recyclers: Recycler[];
  lots: Lot[];
  draftLot: DraftLot;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  setDraftMaterial: (materialId: string) => void;
  setDraftWeight: (weight: number) => void;
  setDraftRecycler: (recyclerId: string) => void;
  createLotFromDraft: () => Lot | null;
  completeHandover: (lotId: string, verifiedWeight: number) => Lot | null;
  getLotById: (lotId: string) => Lot | undefined;
  resetDraft: () => void;
  totalEarnings: number;
  totalVerifiedWeight: number;
  completedLotsCount: number;
}

const MOCK_MATERIALS: Material[] = [
  {
    id: 'm-pcb',
    name: 'Printed Circuit Boards (PCBs)',
    category: 'High Value Precious Metals',
    pricePerKg: 320,
    iconName: 'Cpu',
    description: 'Motherboards, RAMs, GPU cards, telecom boards rich in Gold, Silver & Copper.',
    sampleItems: ['Desktop Motherboards', 'Server Cards', 'RAM Modules', 'Phone PCBs'],
    co2SavedPerKg: 4.8,
    metalRecoveryRate: '96% Recovery',
    badge: 'High Value',
    color: 'from-amber-500/20 to-emerald-500/20 border-amber-500/40',
  },
  {
    id: 'm-copper',
    name: 'Heavy Copper Cables & Wires',
    category: 'Pure Non-Ferrous',
    pricePerKg: 450,
    iconName: 'Zap',
    description: 'Stripped or insulated thick power cables, transformer copper coils & armature wire.',
    sampleItems: ['Industrial Cables', 'Transformer Coils', 'AC Compressor Wires'],
    co2SavedPerKg: 6.2,
    metalRecoveryRate: '98% Copper',
    badge: 'Top Demand',
    color: 'from-orange-500/20 to-amber-500/20 border-orange-500/40',
  },
  {
    id: 'm-battery',
    name: 'Lithium & Lead-Acid Batteries',
    category: 'Hazardous Energy Storage',
    pricePerKg: 110,
    iconName: 'BatteryCharging',
    description: 'UPS batteries, e-rickshaw batteries, phone lithium-ion cells & laptop batteries.',
    sampleItems: ['Inverter Batteries', 'Laptop Batteries', 'Li-ion Cells'],
    co2SavedPerKg: 3.5,
    metalRecoveryRate: '91% Lead & Cobalt',
    badge: 'Eco Priority',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
  },
  {
    id: 'm-mixed',
    name: 'Mixed IT Equipment & Laptops',
    category: 'General E-Waste',
    pricePerKg: 85,
    iconName: 'Monitor',
    description: 'Old laptops, desktop towers, set-top boxes, routers, printers & office hardware.',
    sampleItems: ['Laptop Chassis', 'CPUs', 'Routers', 'Printers'],
    co2SavedPerKg: 2.9,
    metalRecoveryRate: '88% Mixed Metal',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
  },
  {
    id: 'm-monitors',
    name: 'Monitors & CRT Display Units',
    category: 'Glass & Lead Waste',
    pricePerKg: 45,
    iconName: 'Tv',
    description: 'LCD panels, LED monitors, CRT television chassis and glass housing.',
    sampleItems: ['Old CRT TVs', 'Computer Monitors', 'Display Modules'],
    co2SavedPerKg: 1.8,
    metalRecoveryRate: '75% Glass/Lead',
    color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40',
  },
  {
    id: 'm-appliances',
    name: 'Home Appliances & Scrap Body',
    category: 'Ferrous & Plastic Blend',
    pricePerKg: 35,
    iconName: 'HardDrive',
    description: 'Washing machine motors, refrigerator coils, microwave bodies & metal scrap.',
    sampleItems: ['Fridge Motors', 'Microwaves', 'Washing Machines'],
    co2SavedPerKg: 1.4,
    metalRecoveryRate: '82% Steel & Motors',
    color: 'from-slate-500/20 to-zinc-500/20 border-slate-500/40',
  },
];

// Mock Authorized Recycler data for prototype demo
const MOCK_RECYCLERS: Recycler[] = [
  {
    id: 'rec-1',
    name: 'EcoRecycle Green Tech Solutions',
    distance: '1.8 km away',
    rating: 4.9,
    reviewsCount: 342,
    address: 'Plot 42, Industrial Area Phase 1, New Delhi',
    rateBonusPercent: 5, // +5% bonus on rate
    cpcbAuthorized: true,
    phone: '+91 98765 43210',
    isMockData: true,
  },
  {
    id: 'rec-2',
    name: 'Attero E-Waste Recycling Hub',
    distance: '3.4 km away',
    rating: 4.8,
    reviewsCount: 518,
    address: 'GIDC Tech Zone, Okhla Phase 3, New Delhi',
    rateBonusPercent: 3,
    cpcbAuthorized: true,
    phone: '+91 98123 45678',
    isMockData: true,
  },
  {
    id: 'rec-3',
    name: 'SahiMetal Resources & Smelters',
    distance: '5.1 km away',
    rating: 4.7,
    reviewsCount: 189,
    address: 'Sector 8, Mayapuri Industrial Area, New Delhi',
    rateBonusPercent: 0,
    cpcbAuthorized: true,
    phone: '+91 99887 76655',
    isMockData: true,
  },
];

// Initial sample completed lot for demo preview
const INITIAL_LOTS: Lot[] = [
  {
    id: 'SV-2026-8942',
    material: MOCK_MATERIALS[0], // PCB
    declaredWeight: 15,
    estimatedPayout: 4800,
    recycler: MOCK_RECYCLERS[0],
    verifiedWeight: 15,
    finalPayout: 5040, // 15 * 320 * 1.05
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
    qrCodeData: 'SAHI-LOT-SV-2026-8942',
    verificationPin: '4892',
    paymentMode: 'INSTANT_UPI',
    utrNumber: 'UPI/20260920/987410293',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials] = useState<Material[]>(MOCK_MATERIALS);
  const [recyclers] = useState<Recycler[]>(MOCK_RECYCLERS);
  const [lots, setLots] = useState<Lot[]>(() => {
    const saved = localStorage.getItem('sahi_value_lots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_LOTS;
      }
    }
    return INITIAL_LOTS;
  });

  const [draftLot, setDraftLot] = useState<DraftLot>({
    materialId: MOCK_MATERIALS[0].id,
    declaredWeight: 10,
    recyclerId: MOCK_RECYCLERS[0].id,
  });

  const [activeRole, setActiveRole] = useState<UserRole>('collector');

  useEffect(() => {
    localStorage.setItem('sahi_value_lots', JSON.stringify(lots));
  }, [lots]);

  const setDraftMaterial = (materialId: string) => {
    setDraftLot((prev) => ({ ...prev, materialId }));
  };

  const setDraftWeight = (declaredWeight: number) => {
    setDraftLot((prev) => ({ ...prev, declaredWeight }));
  };

  const setDraftRecycler = (recyclerId: string) => {
    setDraftLot((prev) => ({ ...prev, recyclerId }));
  };

  const resetDraft = () => {
    setDraftLot({
      materialId: MOCK_MATERIALS[0].id,
      declaredWeight: 10,
      recyclerId: MOCK_RECYCLERS[0].id,
    });
  };

  const createLotFromDraft = (): Lot | null => {
    const material = materials.find((m) => m.id === draftLot.materialId) || materials[0];
    const recycler = recyclers.find((r) => r.id === draftLot.recyclerId) || recyclers[0];
    const declaredWeight = Math.max(1, draftLot.declaredWeight || 1);

    const basePrice = material.pricePerKg * declaredWeight;
    const bonusMultiplier = 1 + (recycler.rateBonusPercent || 0) / 100;
    const estimatedPayout = Math.round(basePrice * bonusMultiplier);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const lotId = `SV-2026-${randomSuffix}`;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const newLot: Lot = {
      id: lotId,
      material,
      declaredWeight,
      estimatedPayout,
      recycler,
      verifiedWeight: null,
      finalPayout: null,
      status: 'PENDING_HANDOVER',
      createdAt: new Date().toISOString(),
      completedAt: null,
      qrCodeData: `SAHI-LOT-${lotId}`,
      verificationPin: pin,
    };

    setLots((prev) => [newLot, ...prev]);
    return newLot;
  };

  const completeHandover = (lotId: string, verifiedWeight: number): Lot | null => {
    const targetLot = lots.find((l) => l.id === lotId);
    if (!targetLot) return null;

    const material = targetLot.material;
    const recycler = targetLot.recycler;
    const validVerifiedWeight = Math.max(0.1, verifiedWeight);

    // CRITICAL BUSINESS RULE:
    // Final payout MUST strictly use verifiedWeight physically weighed by recycler
    const baseAmount = material.pricePerKg * validVerifiedWeight;
    const bonusMultiplier = 1 + (recycler.rateBonusPercent || 0) / 100;
    const finalPayout = Math.round(baseAmount * bonusMultiplier);

    const utrRandom = Math.floor(100000000 + Math.random() * 900000000);

    const updatedLot: Lot = {
      ...targetLot,
      verifiedWeight: validVerifiedWeight,
      finalPayout,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      paymentMode: 'INSTANT_UPI',
      utrNumber: `UPI/20260922/${utrRandom}`,
    };

    setLots((prev) => prev.map((l) => (l.id === lotId ? updatedLot : l)));
    return updatedLot;
  };

  const getLotById = (lotId: string): Lot | undefined => {
    return lots.find((l) => l.id === lotId);
  };

  // Aggregated metrics for Collector Earnings Dashboard
  const completedLots = lots.filter((l) => l.status === 'COMPLETED');
  const totalEarnings = completedLots.reduce((acc, l) => acc + (l.finalPayout || 0), 0);
  const totalVerifiedWeight = completedLots.reduce((acc, l) => acc + (l.verifiedWeight || 0), 0);
  const completedLotsCount = completedLots.length;

  return (
    <AppContext.Provider
      value={{
        materials,
        recyclers,
        lots,
        draftLot,
        activeRole,
        setActiveRole,
        setDraftMaterial,
        setDraftWeight,
        setDraftRecycler,
        createLotFromDraft,
        completeHandover,
        getLotById,
        resetDraft,
        totalEarnings,
        totalVerifiedWeight,
        completedLotsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
