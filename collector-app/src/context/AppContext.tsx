import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Material, Recycler, Lot, DraftLot, AppNotification, CollectorProfile } from '../types';
import { lotApiService } from '../services/api';

interface AppContextType {
  materials: Material[];
  recyclers: Recycler[];
  lots: Lot[];
  draftLot: DraftLot;
  notifications: AppNotification[];
  collectorProfile: CollectorProfile;
  setDraftMaterial: (materialId: string) => void;
  setDraftWeight: (weight: number) => void;
  setDraftRecycler: (recyclerId: string) => void;
  createLotFromDraft: () => Promise<Lot | null>;
  fetchLotFromBackend: (lotId: string) => Promise<Lot | null>;
  completeHandover: (lotId: string, verifiedWeight: number) => Lot | null;
  getLotById: (lotId: string) => Lot | undefined;
  resetDraft: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  totalEarnings: number;
  totalVerifiedWeight: number;
  completedLotsCount: number;
  unreadNotificationsCount: number;
}

const LOTS_STORAGE_KEY = '@sahi_value_collector_lots';
const NOTIFS_STORAGE_KEY = '@sahi_value_collector_notifications';

const MOCK_MATERIALS: Material[] = [
  {
    id: 'm-pcb',
    name: 'Printed Circuit Boards (PCBs)',
    officialName: 'Printed Circuit Boards (PCBs)',
    displayName: {
      en: 'Printed Circuit Boards (PCBs)',
      hi: 'मदरबोर्ड व पीसीबी (PCBs)',
      mr: 'मदरबोर्ड व पीसीबी (PCBs)',
    },
    category: 'High Value Precious Metals',
    pricePerKg: 320,
    iconName: 'Cpu',
    description: 'Motherboards, RAMs, GPU cards, telecom boards rich in Gold, Silver & Copper.',
    sampleItems: ['Desktop Motherboards', 'Server Cards', 'RAM Modules', 'Phone PCBs'],
    co2SavedPerKg: 4.8,
    metalRecoveryRate: '96% Recovery',
    badge: 'High Value',
    color: '#059669',
  },
  {
    id: 'm-copper',
    name: 'Heavy Copper Cables & Wires',
    officialName: 'Heavy Copper Cables & Wires',
    displayName: {
      en: 'Heavy Copper Cables & Wires',
      hi: 'कॉपर केबल व तार',
      mr: 'कॉपर केबल व तार',
    },
    category: 'Pure Non-Ferrous',
    pricePerKg: 450,
    iconName: 'Zap',
    description: 'Stripped or insulated thick power cables, transformer copper coils & armature wire.',
    sampleItems: ['Industrial Cables', 'Transformer Coils', 'AC Compressor Wires'],
    co2SavedPerKg: 6.2,
    metalRecoveryRate: '98% Copper',
    badge: 'Top Demand',
    color: '#ea580c',
  },
  {
    id: 'm-battery',
    name: 'Lithium & Lead-Acid Batteries',
    officialName: 'Lithium & Lead-Acid Batteries',
    displayName: {
      en: 'Lithium & Lead-Acid Batteries',
      hi: 'लिथियम व लेड बैटरियां',
      mr: 'लिथियम व लेड बॅटऱ्या',
    },
    category: 'Hazardous Energy Storage',
    pricePerKg: 110,
    iconName: 'BatteryCharging',
    description: 'UPS batteries, e-rickshaw batteries, phone lithium-ion cells & laptop batteries.',
    sampleItems: ['Inverter Batteries', 'Laptop Batteries', 'Li-ion Cells'],
    co2SavedPerKg: 3.5,
    metalRecoveryRate: '91% Lead & Cobalt',
    badge: 'Eco Priority',
    color: '#10b981',
  },
  {
    id: 'm-mixed',
    name: 'Mixed IT Equipment & Laptops',
    officialName: 'Mixed IT Equipment & Laptops',
    displayName: {
      en: 'Mixed IT Equipment & Laptops',
      hi: 'आईटी हार्डवेयर व लैपटॉप',
      mr: 'आयटी हार्डवेअर व लॅपटॉप',
    },
    category: 'General E-Waste',
    pricePerKg: 85,
    iconName: 'Monitor',
    description: 'Old laptops, desktop towers, set-top boxes, routers, printers & office hardware.',
    sampleItems: ['Laptop Chassis', 'CPUs', 'Routers', 'Printers'],
    co2SavedPerKg: 2.9,
    metalRecoveryRate: '88% Mixed Metal',
    color: '#2563eb',
  },
  {
    id: 'm-monitors',
    name: 'Monitors & CRT Display Units',
    officialName: 'Monitors & CRT Display Units',
    displayName: {
      en: 'Monitors & CRT Display Units',
      hi: 'मॉनिटर व स्क्रीन',
      mr: 'मॉनिटर व स्क्रीन',
    },
    category: 'Glass & Lead Waste',
    pricePerKg: 45,
    iconName: 'Tv',
    description: 'LCD panels, LED monitors, CRT television chassis and glass housing.',
    sampleItems: ['Old CRT TVs', 'Computer Monitors', 'Display Modules'],
    co2SavedPerKg: 1.8,
    metalRecoveryRate: '75% Glass/Lead',
    color: '#4f46e5',
  },
  {
    id: 'm-appliances',
    name: 'Home Appliances & Scrap Body',
    officialName: 'Home Appliances & Scrap Body',
    displayName: {
      en: 'Home Appliances & Scrap Body',
      hi: 'घरेलू उपकरण व स्क्रैप',
      mr: 'घरगुती उपकरणे व स्क्रॅप',
    },
    category: 'Ferrous & Plastic Blend',
    pricePerKg: 35,
    iconName: 'HardDrive',
    description: 'Washing machine motors, refrigerator coils, microwave bodies & metal scrap.',
    sampleItems: ['Fridge Motors', 'Microwaves', 'Washing Machines'],
    co2SavedPerKg: 1.4,
    metalRecoveryRate: '82% Steel & Motors',
    color: '#64748b',
  },
];

const MOCK_RECYCLERS: Recycler[] = [
  {
    id: 'rec-1',
    name: 'EcoRecycle Green Tech Solutions',
    officialName: 'EcoRecycle Green Tech Solutions',
    displayName: {
      en: 'EcoRecycle Green Tech Solutions',
      hi: 'इको-रीसायकल ग्रीन टेक सॉल्यूशंस',
      mr: 'इको-रिसायकल ग्रीन टेक सोल्यूशन्स',
    },
    distance: '1.8 km away',
    rating: 4.9,
    reviewsCount: 342,
    address: 'Plot 42, Industrial Area Phase 1, New Delhi',
    rateBonusPercent: 0,
    cpcbAuthorized: true,
    phone: '+91 98765 43210',
    isMockData: true,
  },
  {
    id: 'rec-2',
    name: 'Attero E-Waste Recycling Hub',
    officialName: 'Attero E-Waste Recycling Hub',
    displayName: {
      en: 'Attero E-Waste Recycling Hub',
      hi: 'अटेरो ई-वेस्ट रीसायकलिंग हब',
      mr: 'अटेरो ई-वेस्ट रिसायकलिंग हब',
    },
    distance: '3.4 km away',
    rating: 4.8,
    reviewsCount: 518,
    address: 'GIDC Tech Zone, Okhla Phase 3, New Delhi',
    rateBonusPercent: 0,
    cpcbAuthorized: true,
    phone: '+91 98123 45678',
    isMockData: true,
  },
  {
    id: 'rec-3',
    name: 'SahiMetal Resources & Smelters',
    officialName: 'SahiMetal Resources & Smelters',
    displayName: {
      en: 'SahiMetal Resources & Smelters',
      hi: 'सहीमेटल रिसोर्सेज एंड स्मेल्टर्स',
      mr: 'सहीमेटल रिसोर्सेस अँड स्मेल्टर्स',
    },
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

const INITIAL_LOTS: Lot[] = [
  {
    id: 'SV-2026-8942',
    material: MOCK_MATERIALS[0],
    declaredWeight: 15,
    estimatedPayout: 4800,
    recycler: MOCK_RECYCLERS[0],
    verifiedWeight: 15,
    finalPayout: 4800, // 15 kg * 320 = 4,800
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
    qrCodeData: 'SAHI-LOT-SV-2026-8942',
    verificationPin: '4892',
    paymentMode: 'INSTANT_UPI',
    utrNumber: 'UPI/20260920/987410293',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Settlement Completed! ₹4,800 Released',
    message: 'Your e-waste lot SV-2026-8942 was physically weighed at 15.0 kg and verified by EcoRecycle Hub. Payment transferred via UPI.',
    date: '2 hours ago',
    read: false,
    type: 'SETTLEMENT',
    lotId: 'SV-2026-8942',
  },
  {
    id: 'notif-2',
    title: 'Benchmark Rate Updated',
    message: 'CPCB benchmark rate for Heavy Copper Cables increased to ₹450/kg in Delhi NCR.',
    date: '1 day ago',
    read: false,
    type: 'PRICE_UPDATE',
  },
  {
    id: 'notif-3',
    title: 'CPCB Safety Compliance Reminder',
    message: 'Remember to segregate lithium-ion batteries from general scrap before handover for safety.',
    date: '3 days ago',
    read: true,
    type: 'COMPLIANCE',
  },
];

const MOCK_PROFILE: CollectorProfile = {
  name: 'Kajas Collector',
  officialName: 'Rahul Kumar',
  displayName: {
    en: 'Rahul Kumar',
    hi: 'राहुल कुमार',
    mr: 'राहुल कुमार',
  },
  phone: '+91 98765 12345',
  zone: 'Okhla / Mayapuri Zone, Delhi NCR',
  upiId: 'collector@upi',
  verified: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials] = useState<Material[]>(MOCK_MATERIALS);
  const [recyclers] = useState<Recycler[]>(MOCK_RECYCLERS);
  const [collectorProfile] = useState<CollectorProfile>(MOCK_PROFILE);

  const [lots, setLots] = useState<Lot[]>(INITIAL_LOTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [draftLot, setDraftLot] = useState<DraftLot>({
    materialId: MOCK_MATERIALS[0].id,
    declaredWeight: 10,
    recyclerId: MOCK_RECYCLERS[0].id,
  });

  // Load stored lots and notifications ONCE during startup
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedLots = await AsyncStorage.getItem(LOTS_STORAGE_KEY);
        if (savedLots) {
          const parsed = JSON.parse(savedLots);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLots(parsed);
          }
        }
        const savedNotifs = await AsyncStorage.getItem(NOTIFS_STORAGE_KEY);
        if (savedNotifs) {
          const parsedNotifs = JSON.parse(savedNotifs);
          if (Array.isArray(parsedNotifs)) {
            setNotifications(parsedNotifs);
          }
        }
      } catch (e) {
        // Storage load fallback
      }
    };
    loadStorageData();
  }, []);

  // Save lots to storage
  const saveLots = useCallback(async (updatedLots: Lot[]) => {
    setLots(updatedLots);
    try {
      await AsyncStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(updatedLots));
    } catch (e) {
      // Save error ignored
    }
  }, []);

  // Save notifications to storage
  const saveNotifications = useCallback(async (updatedNotifs: AppNotification[]) => {
    setNotifications(updatedNotifs);
    try {
      await AsyncStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updatedNotifs));
    } catch (e) {
      // Save error ignored
    }
  }, []);

  const setDraftMaterial = useCallback((materialId: string) => {
    setDraftLot((prev) => ({ ...prev, materialId }));
  }, []);

  const setDraftWeight = useCallback((declaredWeight: number) => {
    setDraftLot((prev) => ({ ...prev, declaredWeight }));
  }, []);

  const setDraftRecycler = useCallback((recyclerId: string) => {
    setDraftLot((prev) => ({ ...prev, recyclerId }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraftLot({
      materialId: materials[0].id,
      declaredWeight: 10,
      recyclerId: recyclers[0].id,
    });
  }, [materials, recyclers]);

  const createLotFromDraft = useCallback(async (): Promise<Lot | null> => {
    const mat = materials.find((m) => m.id === draftLot.materialId) || materials[0];
    const rec = recyclers.find((r) => r.id === draftLot.recyclerId) || recyclers[0];
    const declaredWeight = draftLot.declaredWeight || 10;
    const estimatedPayout = Math.round(mat.pricePerKg * declaredWeight);

    let backendLotId = `SV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    let initialStatus: any = 'PENDING_ACCEPTANCE';

    try {
      // Map material string ID (e.g. 'm-pcb') to integer ID
      const matIdMap: Record<string, number> = {
        'm-pcb': 1,
        'm-copper': 2,
        'm-battery': 3,
        'm-appliances': 4,
        'm-mixed': 1,
        'm-monitors': 1,
      };
      const recIdMap: Record<string, number> = {
        'rec-1': 1,
        'rec-2': 2,
        'rec-3': 1,
      };

      const numericMatId = matIdMap[mat.id] || 1;
      const numericRecId = recIdMap[rec.id] || 1;

      const backendRes = await lotApiService.createLot({
        material_id: numericMatId,
        declared_weight: declaredWeight,
        recycler_id: numericRecId,
      });

      if (backendRes && backendRes.lot_id) {
        backendLotId = backendRes.lot_id;
        initialStatus = backendRes.status || 'PENDING_ACCEPTANCE';
      }
    } catch (err) {
      // Local fallback if server unreachable
    }

    const newLot: Lot = {
      id: backendLotId,
      material: mat,
      declaredWeight,
      estimatedPayout,
      recycler: rec,
      verifiedWeight: null,
      finalPayout: null,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      completedAt: null,
      qrCodeData: `SAHI-LOT-${backendLotId}`,
      verificationPin: backendLotId.slice(-4),
    };

    const updatedLots = [newLot, ...lots];
    saveLots(updatedLots);
    return newLot;
  }, [draftLot, materials, recyclers, lots, saveLots]);

  const fetchLotFromBackend = useCallback(async (lotId: string): Promise<Lot | null> => {
    try {
      const res = await lotApiService.getLotDetails(lotId);
      if (res && res.lot_id) {
        const mat = materials.find((m) => m.id === `m-${res.material_id}`) || materials[0];
        const rec = recyclers.find((r) => r.id === `rec-${res.recycler_id}`) || recyclers[0];

        const updatedLot: Lot = {
          id: res.lot_id,
          material: mat,
          declaredWeight: res.declared_weight,
          estimatedPayout: res.estimated_value,
          recycler: rec,
          verifiedWeight: res.verified_weight || null,
          finalPayout: res.final_amount || null,
          status: res.status as any,
          createdAt: res.created_at,
          completedAt: res.completed_at || null,
          qrCodeData: `SAHI-LOT-${res.lot_id}`,
          verificationPin: res.lot_id.slice(-4),
        };

        setLots((prevLots) => {
          const index = prevLots.findIndex((l) => l.id === res.lot_id || l.id === lotId);
          if (index >= 0) {
            const newArr = [...prevLots];
            newArr[index] = updatedLot;
            return newArr;
          }
          return [updatedLot, ...prevLots];
        });

        return updatedLot;
      }
    } catch (e) {
      // Fallback
    }
    return null;
  }, [materials, recyclers]);

  // CRITICAL BUSINESS RULE:
  // Final payment MUST ALWAYS be calculated using Verified Weight * Material Rate!
  const completeHandover = useCallback((lotId: string, verifiedWeight: number): Lot | null => {
    let updatedLotResult: Lot | null = null;

    const updatedLots = lots.map((l) => {
      if (l.id === lotId) {
        // STRICT RULE: Final Payment = Verified Weight * Material Rate
        const calculatedFinalPayout = Math.round(l.material.pricePerKg * verifiedWeight);

        const updated: Lot = {
          ...l,
          verifiedWeight, // Physical verified weight entered by recycler
          finalPayout: calculatedFinalPayout,
          status: 'COMPLETED' as const,
          completedAt: new Date().toISOString(),
          paymentMode: 'INSTANT_UPI' as const,
          utrNumber: `UPI/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/${Math.floor(100000 + Math.random() * 900000)}`,
        };
        updatedLotResult = updated;
        return updated;
      }
      return l;
    });

    if (updatedLotResult) {
      saveLots(updatedLots);

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `Settlement Paid: ₹${(updatedLotResult as Lot).finalPayout?.toLocaleString('en-IN')}`,
        message: `Verified weight recorded: ${(updatedLotResult as Lot).verifiedWeight} kg. Funds transferred directly to your UPI ID.`,
        date: 'Just now',
        read: false,
        type: 'SETTLEMENT',
        lotId: (updatedLotResult as Lot).id,
      };
      saveNotifications([newNotif, ...notifications]);
    }

    return updatedLotResult;
  }, [lots, notifications, saveLots, saveNotifications]);

  const getLotById = useCallback((lotId: string): Lot | undefined => {
    return lots.find((l) => l.id === lotId);
  }, [lots]);

  const markNotificationRead = useCallback((id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  }, [notifications, saveNotifications]);

  const markAllNotificationsRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  }, [notifications, saveNotifications]);

  const completedLots = useMemo(() => lots.filter((l) => l.status === 'COMPLETED'), [lots]);
  const totalEarnings = useMemo(() => completedLots.reduce((acc, curr) => acc + (curr.finalPayout || 0), 0), [completedLots]);
  const totalVerifiedWeight = useMemo(() => completedLots.reduce((acc, curr) => acc + (curr.verifiedWeight || 0), 0), [completedLots]);
  const completedLotsCount = completedLots.length;
  const unreadNotificationsCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const contextValue = useMemo(() => ({
    materials,
    recyclers,
    lots,
    draftLot,
    notifications,
    collectorProfile,
    setDraftMaterial,
    setDraftWeight,
    setDraftRecycler,
    createLotFromDraft,
    fetchLotFromBackend,
    completeHandover,
    getLotById,
    resetDraft,
    markNotificationRead,
    markAllNotificationsRead,
    totalEarnings,
    totalVerifiedWeight,
    completedLotsCount,
    unreadNotificationsCount,
  }), [
    materials,
    recyclers,
    lots,
    draftLot,
    notifications,
    collectorProfile,
    setDraftMaterial,
    setDraftWeight,
    setDraftRecycler,
    createLotFromDraft,
    fetchLotFromBackend,
    completeHandover,
    getLotById,
    resetDraft,
    markNotificationRead,
    markAllNotificationsRead,
    totalEarnings,
    totalVerifiedWeight,
    completedLotsCount,
    unreadNotificationsCount,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
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
