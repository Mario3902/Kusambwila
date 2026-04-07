export interface DocumentVerification {
  biNumber?: string;
  biStatus: 'pending' | 'verified' | 'rejected';
  biVerifiedAt?: Date;
  propertyTitle?: string;
  propertyTitleStatus: 'pending' | 'verified' | 'rejected';
  propertyTitleVerifiedAt?: Date;
  addressProof?: string;
  addressProofStatus: 'pending' | 'verified' | 'rejected';
  isVerified: boolean;
  verificationScore: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  district: string;
  type: 'apartment' | 'house' | 'villa' | 'studio' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  video?: string;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  landlordAvatar?: string;
  featured: boolean;
  createdAt: Date;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  verification: DocumentVerification;
  financials: {
    monthlyRevenue: number;
    yearlyRevenue: number;
    occupancyRate: number;
    totalTenants: number;
    maintenanceCosts: number;
    netProfit: number;
    paymentHistory: PaymentRecord[];
  };
  priceHistory: { date: Date; price: number }[];
  zoneRank: 'premium' | 'high' | 'medium' | 'low' | 'affordable';
}

export interface PaymentRecord {
  id: string;
  date: Date;
  amount: number;
  tenant: string;
  status: 'paid' | 'pending' | 'overdue';
  method: 'transfer' | 'cash' | 'multicaixa';
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Moderno T3 na Talatona',
    description: 'Lindo apartamento com 3 quartos, sala ampla, cozinha equipada e 2 casas de banho. Condomínio fechado com segurança 24h, piscina e área de lazer.',
    price: 150000,
    location: 'Talatona, Luanda',
    district: 'Talatona',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1705858082848-2273a6ef2ec3?w=800',
      'https://images.unsplash.com/photo-1668089677938-b52086753f77?w=800',
      'https://images.unsplash.com/photo-1680210849773-f97a41c6b7ed?w=800',
    ],
    landlordName: 'Maria Costa',
    landlordPhone: '+244 923 456 789',
    landlordEmail: 'maria.costa@email.com',
    featured: true,
    createdAt: new Date('2026-03-15'),
    coordinates: { lat: -8.9094, lng: 13.1844 },
    amenities: ['Piscina', 'Segurança 24h', 'Estacionamento', 'Ginásio'],
    verification: {
      biNumber: '006543210LA042',
      biStatus: 'verified',
      biVerifiedAt: new Date('2026-03-10'),
      propertyTitle: 'Registo Predial #TP-2024-0891',
      propertyTitleStatus: 'verified',
      propertyTitleVerifiedAt: new Date('2026-03-12'),
      addressProofStatus: 'verified',
      isVerified: true,
      verificationScore: 95,
    },
    financials: {
      monthlyRevenue: 150000,
      yearlyRevenue: 1800000,
      occupancyRate: 100,
      totalTenants: 3,
      maintenanceCosts: 45000,
      netProfit: 1755000,
      paymentHistory: [
        { id: 'p1', date: new Date('2026-03-01'), amount: 150000, tenant: 'João M.', status: 'paid', method: 'multicaixa' },
        { id: 'p2', date: new Date('2026-02-01'), amount: 150000, tenant: 'João M.', status: 'paid', method: 'transfer' },
        { id: 'p3', date: new Date('2026-01-01'), amount: 150000, tenant: 'Ana P.', status: 'paid', method: 'multicaixa' },
      ],
    },
    priceHistory: [
      { date: new Date('2025-01-01'), price: 120000 },
      { date: new Date('2025-06-01'), price: 135000 },
      { date: new Date('2026-01-01'), price: 150000 },
    ],
    zoneRank: 'high',
  },
  {
    id: '2',
    title: 'Casa Luxuosa com Piscina - Miramar',
    description: 'Casa de luxo com 5 quartos suítes, piscina, jardim amplo, garagem para 3 carros. Acabamentos de primeira qualidade.',
    price: 450000,
    location: 'Miramar, Luanda',
    district: 'Miramar',
    type: 'house',
    bedrooms: 5,
    bathrooms: 5,
    area: 350,
    images: [
      'https://images.unsplash.com/photo-1703435525194-9d96cefa7f7c?w=800',
      'https://images.unsplash.com/photo-1678889284805-5c86fb1dba5a?w=800',
      'https://images.unsplash.com/photo-1730170787479-ca21524efb7c?w=800',
    ],
    landlordName: 'António Fernandes',
    landlordPhone: '+244 912 345 678',
    landlordEmail: 'antonio.f@email.com',
    featured: true,
    createdAt: new Date('2026-03-18'),
    coordinates: { lat: -8.8142, lng: 13.2302 },
    amenities: ['Piscina', 'Jardim', 'Garagem', 'Sistema Solar'],
    verification: {
      biNumber: '001234567LA032',
      biStatus: 'verified',
      biVerifiedAt: new Date('2026-03-15'),
      propertyTitle: 'Registo Predial #MP-2023-1245',
      propertyTitleStatus: 'verified',
      propertyTitleVerifiedAt: new Date('2026-03-16'),
      addressProofStatus: 'verified',
      isVerified: true,
      verificationScore: 98,
    },
    financials: {
      monthlyRevenue: 450000,
      yearlyRevenue: 5400000,
      occupancyRate: 92,
      totalTenants: 2,
      maintenanceCosts: 180000,
      netProfit: 5220000,
      paymentHistory: [
        { id: 'p4', date: new Date('2026-03-01'), amount: 450000, tenant: 'Empresa XYZ', status: 'paid', method: 'transfer' },
        { id: 'p5', date: new Date('2026-02-01'), amount: 450000, tenant: 'Empresa XYZ', status: 'paid', method: 'transfer' },
      ],
    },
    priceHistory: [
      { date: new Date('2025-01-01'), price: 380000 },
      { date: new Date('2025-06-01'), price: 420000 },
      { date: new Date('2026-01-01'), price: 450000 },
    ],
    zoneRank: 'premium',
  },
  {
    id: '3',
    title: 'Apartamento T2 Mobilado - Maianga',
    description: 'Apartamento mobilado e equipado, pronto para morar. Localização central com fácil acesso a transportes e serviços.',
    price: 85000,
    location: 'Maianga, Luanda',
    district: 'Maianga',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    images: [
      'https://images.unsplash.com/photo-1612968228487-11e7ae6df4ab?w=800',
      'https://images.unsplash.com/photo-1680210849773-f97a41c6b7ed?w=800',
      'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?w=800',
    ],
    landlordName: 'Isabel Santos',
    landlordPhone: '+244 934 567 890',
    landlordEmail: 'isabel.santos@email.com',
    featured: false,
    createdAt: new Date('2026-03-17'),
    coordinates: { lat: -8.8200, lng: 13.2417 },
    amenities: ['Mobilado', 'Ar Condicionado', 'Internet'],
    verification: {
      biNumber: '009876543LA051',
      biStatus: 'verified',
      biVerifiedAt: new Date('2026-03-14'),
      propertyTitle: 'Registo Predial #MG-2024-0456',
      propertyTitleStatus: 'verified',
      propertyTitleVerifiedAt: new Date('2026-03-15'),
      addressProofStatus: 'verified',
      isVerified: true,
      verificationScore: 88,
    },
    financials: {
      monthlyRevenue: 85000,
      yearlyRevenue: 1020000,
      occupancyRate: 85,
      totalTenants: 4,
      maintenanceCosts: 30000,
      netProfit: 990000,
      paymentHistory: [
        { id: 'p6', date: new Date('2026-03-01'), amount: 85000, tenant: 'Pedro L.', status: 'paid', method: 'cash' },
        { id: 'p7', date: new Date('2026-02-01'), amount: 85000, tenant: 'Pedro L.', status: 'pending', method: 'cash' },
      ],
    },
    priceHistory: [
      { date: new Date('2025-01-01'), price: 75000 },
      { date: new Date('2025-06-01'), price: 80000 },
      { date: new Date('2026-01-01'), price: 85000 },
    ],
    zoneRank: 'medium',
  },
  {
    id: '4',
    title: 'Villa de Luxo - Benfica',
    description: 'Villa exclusiva com design moderno, 4 suítes, piscina infinity, home cinema, e vista panorâmica. Para clientes exigentes.',
    price: 650000,
    location: 'Benfica, Luanda',
    district: 'Benfica',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 5,
    area: 450,
    images: [
      'https://images.unsplash.com/photo-1703435525194-9d96cefa7f7c?w=800',
      'https://images.unsplash.com/photo-1760904050658-e05a50a4d529?w=800',
      'https://images.unsplash.com/photo-1705858082848-2273a6ef2ec3?w=800',
    ],
    landlordName: 'Carlos Pereira',
    landlordPhone: '+244 945 678 901',
    landlordEmail: 'carlos.p@email.com',
    featured: true,
    createdAt: new Date('2026-03-19'),
    coordinates: { lat: -8.8500, lng: 13.2700 },
    amenities: ['Piscina Infinity', 'Home Cinema', 'Sistema Smart Home', 'Elevador Privado'],
    verification: {
      biNumber: '005551234LA028',
      biStatus: 'verified',
      biVerifiedAt: new Date('2026-03-17'),
      propertyTitle: 'Registo Predial #BF-2023-0789',
      propertyTitleStatus: 'verified',
      propertyTitleVerifiedAt: new Date('2026-03-18'),
      addressProofStatus: 'verified',
      isVerified: true,
      verificationScore: 97,
    },
    financials: {
      monthlyRevenue: 650000,
      yearlyRevenue: 7800000,
      occupancyRate: 75,
      totalTenants: 1,
      maintenanceCosts: 250000,
      netProfit: 7550000,
      paymentHistory: [
        { id: 'p8', date: new Date('2026-03-01'), amount: 650000, tenant: 'Diplomata A.B.', status: 'paid', method: 'transfer' },
      ],
    },
    priceHistory: [
      { date: new Date('2025-01-01'), price: 550000 },
      { date: new Date('2025-06-01'), price: 600000 },
      { date: new Date('2026-01-01'), price: 650000 },
    ],
    zoneRank: 'premium',
  },
  {
    id: '5',
    title: 'Apartamento T1 Novo - Kilamba',
    description: 'Apartamento novo nunca habitado, T1 com varanda, condomínio moderno com áreas verdes e segurança.',
    price: 65000,
    location: 'Kilamba, Luanda',
    district: 'Kilamba',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    images: [
      'https://images.unsplash.com/photo-1705858082848-2273a6ef2ec3?w=800',
      'https://images.unsplash.com/photo-1736007917095-88dd6bc641e5?w=800',
      'https://images.unsplash.com/photo-1680210849773-f97a41c6b7ed?w=800',
    ],
    landlordName: 'Fernanda Lima',
    landlordPhone: '+244 956 789 012',
    landlordEmail: 'fernanda.lima@email.com',
    featured: false,
    createdAt: new Date('2026-03-16'),
    coordinates: { lat: -9.0000, lng: 13.3000 },
    amenities: ['Novo', 'Condomínio Fechado', 'Varanda'],
    verification: {
      biNumber: '007778888LA060',
      biStatus: 'pending',
      propertyTitle: 'Registo Predial #KB-2025-0123',
      propertyTitleStatus: 'pending',
      addressProofStatus: 'pending',
      isVerified: false,
      verificationScore: 35,
    },
    financials: {
      monthlyRevenue: 65000,
      yearlyRevenue: 780000,
      occupancyRate: 95,
      totalTenants: 5,
      maintenanceCosts: 15000,
      netProfit: 765000,
      paymentHistory: [
        { id: 'p9', date: new Date('2026-03-01'), amount: 65000, tenant: 'Miguel R.', status: 'paid', method: 'multicaixa' },
        { id: 'p10', date: new Date('2026-02-01'), amount: 65000, tenant: 'Miguel R.', status: 'overdue', method: 'multicaixa' },
      ],
    },
    priceHistory: [
      { date: new Date('2025-01-01'), price: 55000 },
      { date: new Date('2025-06-01'), price: 60000 },
      { date: new Date('2026-01-01'), price: 65000 },
    ],
    zoneRank: 'affordable',
  },
  {
    id: '6',
    title: 'Espaço Comercial - Baixa de Luanda',
    description: 'Loja comercial em zona nobre da Baixa, ideal para escritório, loja ou consultório. Ótima localização.',
    price: 200000,
    location: 'Baixa, Luanda',
    district: 'Baixa',
    type: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 150,
    images: [
      'https://images.unsplash.com/photo-1612968228487-11e7ae6df4ab?w=800',
      'https://images.unsplash.com/photo-1760904050658-e05a50a4d529?w=800',
      'https://images.unsplash.com/photo-1680210849773-f97a41c6b7ed?w=800',
    ],
    landlordName: 'Roberto Alves',
    landlordPhone: '+244 967 890 123',
    landlordEmail: 'roberto.alves@email.com',
    featured: false,
    createdAt: new Date('2026-03-14'),
    coordinates: { lat: -8.8100, lng: 13.2340 },
    amenities: ['Localização Central', 'Estacionamento', 'Segurança'],
    verification: {
      biNumber: '003334444LA045',
      biStatus: 'verified',
      biVerifiedAt: new Date('2026-03-10'),
      propertyTitle: 'Registo Predial #BX-2024-0567',
      propertyTitleStatus: 'verified',
      propertyTitleVerifiedAt: new Date('2026-03-11'),
      addressProofStatus: 'verified',
      isVerified: true,
      verificationScore: 91,
    },
    financials: {
      monthlyRevenue: 200000,
      yearlyRevenue: 2400000,
      occupancyRate: 88,
      totalTenants: 3,
      maintenanceCosts: 60000,
      netProfit: 2340000,
      paymentHistory: [
        { id: 'p11', date: new Date('2026-03-01'), amount: 200000, tenant: 'Loja ABC', status: 'paid', method: 'transfer' },
        { id: 'p12', date: new Date('2026-02-01'), amount: 200000, tenant: 'Loja ABC', status: 'paid', method: 'transfer' },
      ],
    },
    priceHistory: [
      { date: new Date('2025-01-01'), price: 170000 },
      { date: new Date('2025-06-01'), price: 185000 },
      { date: new Date('2026-01-01'), price: 200000 },
    ],
    zoneRank: 'high',
  },
];

export const priceRanges = [
  { label: 'Até 50.000 Kz', min: 0, max: 50000 },
  { label: '50.000 - 100.000 Kz', min: 50000, max: 100000 },
  { label: '100.000 - 200.000 Kz', min: 100000, max: 200000 },
  { label: '200.000 - 400.000 Kz', min: 200000, max: 400000 },
  { label: 'Mais de 400.000 Kz', min: 400000, max: Infinity },
];

export const districts = [
  'Talatona',
  'Miramar',
  'Maianga',
  'Benfica',
  'Kilamba',
  'Baixa',
  'Alvalade',
  'Ingombota',
  'Viana',
  'Cacuaco',
];

export const propertyTypes = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Estúdio' },
  { value: 'commercial', label: 'Comercial' },
];

export interface MarketStats {
  district: string;
  avgPrice: number;
  listings: number;
  trend: 'up' | 'down' | 'stable';
  minPrice: number;
  maxPrice: number;
  pricePerSqm: number;
  demandLevel: 'alta' | 'média' | 'baixa';
  zoneRank: 'premium' | 'high' | 'medium' | 'low' | 'affordable';
}

export const marketStats: MarketStats[] = [
  { district: 'Benfica', avgPrice: 350000, listings: 15, trend: 'up', minPrice: 250000, maxPrice: 650000, pricePerSqm: 1500, demandLevel: 'alta', zoneRank: 'premium' },
  { district: 'Miramar', avgPrice: 280000, listings: 28, trend: 'stable', minPrice: 180000, maxPrice: 450000, pricePerSqm: 1200, demandLevel: 'alta', zoneRank: 'premium' },
  { district: 'Baixa', avgPrice: 200000, listings: 35, trend: 'up', minPrice: 120000, maxPrice: 350000, pricePerSqm: 950, demandLevel: 'média', zoneRank: 'high' },
  { district: 'Talatona', avgPrice: 135000, listings: 45, trend: 'up', minPrice: 80000, maxPrice: 250000, pricePerSqm: 800, demandLevel: 'alta', zoneRank: 'high' },
  { district: 'Maianga', avgPrice: 95000, listings: 52, trend: 'stable', minPrice: 55000, maxPrice: 150000, pricePerSqm: 650, demandLevel: 'média', zoneRank: 'medium' },
  { district: 'Alvalade', avgPrice: 88000, listings: 40, trend: 'down', minPrice: 50000, maxPrice: 140000, pricePerSqm: 580, demandLevel: 'média', zoneRank: 'medium' },
  { district: 'Ingombota', avgPrice: 82000, listings: 38, trend: 'stable', minPrice: 45000, maxPrice: 130000, pricePerSqm: 520, demandLevel: 'baixa', zoneRank: 'low' },
  { district: 'Kilamba', avgPrice: 75000, listings: 67, trend: 'down', minPrice: 40000, maxPrice: 120000, pricePerSqm: 450, demandLevel: 'média', zoneRank: 'affordable' },
  { district: 'Viana', avgPrice: 55000, listings: 55, trend: 'stable', minPrice: 30000, maxPrice: 90000, pricePerSqm: 350, demandLevel: 'baixa', zoneRank: 'affordable' },
  { district: 'Cacuaco', avgPrice: 45000, listings: 42, trend: 'down', minPrice: 25000, maxPrice: 75000, pricePerSqm: 280, demandLevel: 'baixa', zoneRank: 'affordable' },
];

export const financialReports = {
  platformRevenue: {
    monthly: 2450000,
    yearly: 29400000,
    growth: 18.5,
  },
  topLandlords: [
    { name: 'António Fernandes', properties: 8, revenue: 3600000, avgOccupancy: 92, verified: true },
    { name: 'Carlos Pereira', properties: 5, revenue: 3250000, avgOccupancy: 75, verified: true },
    { name: 'Maria Costa', properties: 12, revenue: 1800000, avgOccupancy: 95, verified: true },
    { name: 'Roberto Alves', properties: 6, revenue: 1200000, avgOccupancy: 88, verified: true },
    { name: 'Isabel Santos', properties: 9, revenue: 850000, avgOccupancy: 85, verified: true },
  ],
  revenueByDistrict: [
    { district: 'Benfica', revenue: 3900000, properties: 15 },
    { district: 'Miramar', revenue: 7840000, properties: 28 },
    { district: 'Talatona', revenue: 6075000, properties: 45 },
    { district: 'Baixa', revenue: 7000000, properties: 35 },
    { district: 'Maianga', revenue: 4940000, properties: 52 },
    { district: 'Kilamba', revenue: 5025000, properties: 67 },
  ],
  monthlyTrend: [
    { month: 'Jul', revenue: 1800000, expenses: 420000, profit: 1380000 },
    { month: 'Ago', revenue: 1950000, expenses: 450000, profit: 1500000 },
    { month: 'Set', revenue: 2100000, expenses: 480000, profit: 1620000 },
    { month: 'Out', revenue: 2050000, expenses: 460000, profit: 1590000 },
    { month: 'Nov', revenue: 2200000, expenses: 500000, profit: 1700000 },
    { month: 'Dez', revenue: 2350000, expenses: 520000, profit: 1830000 },
    { month: 'Jan', revenue: 2150000, expenses: 470000, profit: 1680000 },
    { month: 'Fev', revenue: 2300000, expenses: 490000, profit: 1810000 },
    { month: 'Mar', revenue: 2450000, expenses: 510000, profit: 1940000 },
  ],
};

export const verificationChecks = [
  { id: 'bi_format', name: 'Formato do BI', description: 'Verifica se o número do BI segue o padrão angolano (9 dígitos + 2 letras + 3 dígitos)' },
  { id: 'bi_checksum', name: 'Checksum do BI', description: 'Validação algorítmica do número do BI' },
  { id: 'property_registry', name: 'Registo Predial', description: 'Confirmação do registo de propriedade no conservatório' },
  { id: 'address_match', name: 'Correspondência de Endereço', description: 'O endereço do BI corresponde ao endereço da propriedade' },
  { id: 'document_authenticity', name: 'Autenticidade do Documento', description: 'Verificação de segurança do documento (marca d\'água, holograma)' },
];