// Static demo data. Each customer has a `salesforceContactId` populated
// after `sf data import tree` runs. Until then these are empty strings
// and the "View in Salesforce" link is hidden.

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type Customer = {
  id: string;
  salesforceContactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  joinedYear: number;
  loyaltyTier: LoyaltyTier;
  lifetimeValue: number;
  lastPurchaseDate: string;
  preferredStore: string;
  npsScore: number;
  returnRate: number;
  marketingConsent: boolean;
  topCategory: string;
  avatarHue: number; // 0–360, used for monogram tile color
  signals: {
    churnRisk: 'Low' | 'Medium' | 'High';
    upsellAffinity: string;
    backInStock?: string;
    lastTouch: string;
  };
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  date: string;
  items: { sku: string; name: string; qty: number; price: number }[];
  status: 'Fulfilled' | 'Processing' | 'Returned' | 'Exchanged';
  total: number;
  channel: 'Online' | 'Store' | 'Stylist';
};

export type StoreKpi = {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
};

// ----- Customers -----

export const customers: Customer[] = [
  {
    id: 'cust-001',
    salesforceContactId: '0037100000SrfrwAAB',
    firstName: 'Amara',
    lastName: 'Okonkwo',
    email: 'amara.o@example.com',
    phone: '+1 (213) 555-0184',
    city: 'Los Angeles',
    state: 'CA',
    joinedYear: 2021,
    loyaltyTier: 'Platinum',
    lifetimeValue: 12480,
    lastPurchaseDate: '2026-05-09',
    preferredStore: 'Melrose Flagship',
    npsScore: 9,
    returnRate: 0.08,
    marketingConsent: true,
    topCategory: 'Dresses',
    avatarHue: 28,
    signals: {
      churnRisk: 'Low',
      upsellAffinity: 'Resort 26 — Linen Sets',
      backInStock: 'Serita Dress (Ivory, S)',
      lastTouch: 'Opened "New Dresses" email · 2d ago',
    },
  },
  {
    id: 'cust-002',
    salesforceContactId: '0037100000SrfrxAAB',
    firstName: 'Priya',
    lastName: 'Raman',
    email: 'priya.raman@example.com',
    phone: '+1 (415) 555-0142',
    city: 'San Francisco',
    state: 'CA',
    joinedYear: 2022,
    loyaltyTier: 'Gold',
    lifetimeValue: 6320,
    lastPurchaseDate: '2026-03-22',
    preferredStore: 'Online',
    npsScore: 7,
    returnRate: 0.22,
    marketingConsent: true,
    topCategory: 'Bags',
    avatarHue: 14,
    signals: {
      churnRisk: 'Medium',
      upsellAffinity: 'Sculpted Mini in Mocha',
      lastTouch: 'Returned 2 items · 11d ago',
    },
  },
  {
    id: 'cust-003',
    salesforceContactId: '0037100000SrfryAAB',
    firstName: 'Eloise',
    lastName: 'Bertrand',
    email: 'eloise.b@example.com',
    phone: '+1 (646) 555-0117',
    city: 'New York',
    state: 'NY',
    joinedYear: 2020,
    loyaltyTier: 'Platinum',
    lifetimeValue: 18960,
    lastPurchaseDate: '2026-04-30',
    preferredStore: 'SoHo Boutique',
    npsScore: 10,
    returnRate: 0.05,
    marketingConsent: true,
    topCategory: 'Swim',
    avatarHue: 195,
    signals: {
      churnRisk: 'Low',
      upsellAffinity: 'Capri Capsule — Crochet Set',
      lastTouch: 'In-store visit · Stylist Maria · 22d ago',
    },
  },
  {
    id: 'cust-004',
    salesforceContactId: '0037100000SrfrzAAB',
    firstName: 'Maya',
    lastName: 'Schwartz',
    email: 'maya.s@example.com',
    phone: '+1 (305) 555-0166',
    city: 'Miami',
    state: 'FL',
    joinedYear: 2024,
    loyaltyTier: 'Silver',
    lifetimeValue: 1840,
    lastPurchaseDate: '2026-02-14',
    preferredStore: 'Online',
    npsScore: 6,
    returnRate: 0.35,
    marketingConsent: false,
    topCategory: 'Tops',
    avatarHue: 340,
    signals: {
      churnRisk: 'High',
      upsellAffinity: 'Beachwear — Resort 26',
      lastTouch: 'No engagement · 96d',
    },
  },
  {
    id: 'cust-005',
    salesforceContactId: '0037100000Srfs0AAB',
    firstName: 'Thandi',
    lastName: 'Mokoena',
    email: 'thandi.m@example.com',
    phone: '+1 (310) 555-0193',
    city: 'Santa Monica',
    state: 'CA',
    joinedYear: 2023,
    loyaltyTier: 'Gold',
    lifetimeValue: 4720,
    lastPurchaseDate: '2026-05-15',
    preferredStore: 'Melrose Flagship',
    npsScore: 9,
    returnRate: 0.1,
    marketingConsent: true,
    topCategory: 'Shoes',
    avatarHue: 60,
    signals: {
      churnRisk: 'Low',
      upsellAffinity: 'Eos Heels — Bone',
      lastTouch: 'Added 3 items to wishlist · 4d ago',
    },
  },
  {
    id: 'cust-006',
    salesforceContactId: '0037100000Srfs1AAB',
    firstName: 'Greta',
    lastName: 'Lindqvist',
    email: 'greta.l@example.com',
    phone: '+1 (212) 555-0173',
    city: 'New York',
    state: 'NY',
    joinedYear: 2022,
    loyaltyTier: 'Gold',
    lifetimeValue: 5980,
    lastPurchaseDate: '2026-01-08',
    preferredStore: 'SoHo Boutique',
    npsScore: 5,
    returnRate: 0.18,
    marketingConsent: true,
    topCategory: 'Dresses',
    avatarHue: 280,
    signals: {
      churnRisk: 'High',
      upsellAffinity: 'Spring drop — Sculptural Knits',
      lastTouch: 'Opened nothing · 134d',
    },
  },
];

// ----- Orders -----

export const orders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: '#CG-58219',
    customerId: 'cust-001',
    date: '2026-05-09',
    status: 'Fulfilled',
    total: 1290,
    channel: 'Online',
    items: [
      { sku: 'DR-SERITA-IVR-S', name: 'Serita Dress · Ivory · S', qty: 1, price: 798 },
      { sku: 'BG-SCULPT-MNI-MCA', name: 'Sculpted Mini Bag · Mocha', qty: 1, price: 492 },
    ],
  },
  {
    id: 'ord-002',
    orderNumber: '#CG-57044',
    customerId: 'cust-001',
    date: '2026-04-02',
    status: 'Fulfilled',
    total: 642,
    channel: 'Store',
    items: [{ sku: 'TP-LINEN-WHT-M', name: 'Linen Camisole · White · M', qty: 2, price: 321 }],
  },
  {
    id: 'ord-003',
    orderNumber: '#CG-56711',
    customerId: 'cust-002',
    date: '2026-03-22',
    status: 'Returned',
    total: 1190,
    channel: 'Online',
    items: [{ sku: 'BG-CRESC-CGN-OS', name: 'Crescent Bag · Cognac', qty: 1, price: 1190 }],
  },
  {
    id: 'ord-004',
    orderNumber: '#CG-58400',
    customerId: 'cust-003',
    date: '2026-04-30',
    status: 'Fulfilled',
    total: 2240,
    channel: 'Stylist',
    items: [
      { sku: 'SW-CAPRI-CRO-S', name: 'Capri Crochet Set · S', qty: 1, price: 1240 },
      { sku: 'DR-SOLEIL-SND-S', name: 'Soleil Dress · Sand · S', qty: 1, price: 1000 },
    ],
  },
  {
    id: 'ord-005',
    orderNumber: '#CG-58812',
    customerId: 'cust-005',
    date: '2026-05-15',
    status: 'Fulfilled',
    total: 880,
    channel: 'Store',
    items: [{ sku: 'SH-EOS-BNE-37', name: 'Eos Heels · Bone · 37', qty: 1, price: 880 }],
  },
  {
    id: 'ord-006',
    orderNumber: '#CG-54320',
    customerId: 'cust-006',
    date: '2026-01-08',
    status: 'Fulfilled',
    total: 1560,
    channel: 'Online',
    items: [{ sku: 'DR-AURA-BLK-M', name: 'Aura Dress · Black · M', qty: 1, price: 1560 }],
  },
];

// ----- Today / Store KPIs -----

export const todayKpis: StoreKpi[] = [
  { label: 'Today\'s Revenue', value: '$48,210', delta: '+12.4%', trend: 'up' },
  { label: 'Active Customers', value: '184', delta: '+8', trend: 'up' },
  { label: 'AOV', value: '$612', delta: '−3.1%', trend: 'down' },
  { label: 'Avg. NPS · 30d', value: '8.4', delta: '+0.3', trend: 'up' },
];

export const todayPriorities = [
  {
    id: 'pri-1',
    customerId: 'cust-004',
    title: 'Re-engage Maya Schwartz before she lapses',
    why: '96 days since last engagement · Silver tier · Resort 26 launched today',
  },
  {
    id: 'pri-2',
    customerId: 'cust-001',
    title: 'Notify Amara — Serita Dress restocked in her size',
    why: 'Platinum · Wishlisted item back in Ivory S at Melrose',
  },
  {
    id: 'pri-3',
    customerId: 'cust-006',
    title: 'Win-back outreach to Greta Lindqvist',
    why: 'Gold tier · 134d silent · Spring sculptural knits match her history',
  },
];
