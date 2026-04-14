import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  icon: string;
  name: string;
  price: string;
  priceValue: number;
  description: string;
  badge?: string;
  featured?: boolean;
}

export interface Registration {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  bairro: string;
  products: string[];
  whatsappGroup: string;
  notes: string;
  date: string;
}

export interface TradeAd {
  id: string;
  type: 'oferta' | 'busca' | 'venda';
  name: string;
  whatsapp: string;
  stickerNumber: string;
  country: string;
  details: string;
  date: string;
}

export interface SiteSettings {
  storeName: string;
  storeSubtitle: string;
  logoEmoji: string;
  address: string;
  city: string;
  whatsappNumber: string;
  whatsappGroupLink: string;
}

interface SiteContextType {
  settings: SiteSettings;
  updateSettings: (s: Partial<SiteSettings>) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  registrations: Registration[];
  addRegistration: (r: Omit<Registration, 'id' | 'date'>) => void;
  deleteRegistration: (id: string) => void;
  tradeAds: TradeAd[];
  addTradeAd: (a: Omit<TradeAd, 'id' | 'date'>) => void;
  deleteTradeAd: (id: string) => void;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    icon: '🎴',
    name: 'Pacotinho de Figurinhas',
    price: 'R$ 7,00',
    priceValue: 7,
    description: 'Pacote com 7 figurinhas oficiais da Copa do Mundo 2026. Colecione e troque com os amigos!',
    badge: '⭐ Popular',
    featured: false,
  },
  {
    id: '2',
    icon: '📒',
    name: 'Álbum Capa Brochura (Cartão)',
    price: 'R$ 24,90',
    priceValue: 24.9,
    description: 'Álbum oficial com capa brochura em cartão. Ideal para começar sua coleção Copa 2026!',
    featured: false,
  },
  {
    id: '3',
    icon: '📕',
    name: 'Álbum Capa Dura (Padrão)',
    price: 'R$ 74,90',
    priceValue: 74.9,
    description: 'Álbum oficial com capa dura padrão. Durável e bonito para guardar sua coleção completa!',
    badge: '⭐ Mais Pedido',
    featured: true,
  },
  {
    id: '4',
    icon: '✨',
    name: 'Álbum Capa Dura (Dourada ou Prateada)',
    price: 'R$ 79,90',
    priceValue: 79.9,
    description: 'Edição especial com capa dura dourada ou prateada. Para o colecionador de verdade!',
    badge: '🏆 Premium',
    featured: false,
  },
];

const defaultSettings: SiteSettings = {
  storeName: 'SORVETES GURI - SYNC TEST',
  storeSubtitle: 'Turvo · Copa 2026 🏆',
  logoEmoji: '🍦',
  address: 'Praça 31 de Outubro',
  city: 'Turvo · Paraná',
  whatsappNumber: '554299222222',
  whatsappGroupLink: 'https://chat.whatsapp.com/LINK-DO-GRUPO',
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => loadFromStorage('site-settings', defaultSettings));
  const [products, setProductsState] = useState<Product[]>(() => loadFromStorage('site-products', defaultProducts));
  const [registrations, setRegistrations] = useState<Registration[]>(() => loadFromStorage('site-registrations', []));
  const [tradeAds, setTradeAds] = useState<TradeAd[]>(() => loadFromStorage('site-tradeads', []));

  useEffect(() => { localStorage.setItem('site-settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('site-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('site-registrations', JSON.stringify(registrations)); }, [registrations]);
  useEffect(() => { localStorage.setItem('site-tradeads', JSON.stringify(tradeAds)); }, [tradeAds]);

  const updateSettings = (s: Partial<SiteSettings>) => setSettings(prev => ({ ...prev, ...s }));
  const setProducts = (p: Product[]) => setProductsState(p);
  const addRegistration = (r: Omit<Registration, 'id' | 'date'>) => {
    setRegistrations(prev => [...prev, { ...r, id: crypto.randomUUID(), date: new Date().toISOString() }]);
  };
  const deleteRegistration = (id: string) => setRegistrations(prev => prev.filter(r => r.id !== id));
  const addTradeAd = (a: Omit<TradeAd, 'id' | 'date'>) => {
    setTradeAds(prev => [...prev, { ...a, id: crypto.randomUUID(), date: new Date().toISOString() }]);
  };
  const deleteTradeAd = (id: string) => setTradeAds(prev => prev.filter(a => a.id !== id));

  return (
    <SiteContext.Provider value={{ settings, updateSettings, products, setProducts, registrations, addRegistration, deleteRegistration, tradeAds, addTradeAd, deleteTradeAd }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
