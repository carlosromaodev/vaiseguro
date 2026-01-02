
export enum ServiceCategory {
  STUDENT = 'STUDENT', // School/College
  WORK = 'WORK', // Commute/Meetings
  URGENCY = 'URGENCY', // Medical/Quick
  LEISURE = 'LEISURE', // Events/Parties
  SCHOOL = 'SCHOOL' // Dedicated School Run for Kids
}

export enum VehicleType {
  JIMNY_2025 = 'JIMNY_2025',
}

export enum Zone {
  CITY = 'Cidade (Centro)',
  TALATONA = 'Talatona',
  BELAS = 'Belas',
  KILAMBA = 'Kilamba',
  CAZENGA = 'Cazenga',
  VIANA = 'Viana',
  CACUACO = 'Cacuaco',
  ICOLO = 'Ícolo e Bengo (Zango)',
  QUICAMA = 'Quiçama'
}

export interface DetailedAddress {
  zone: Zone | '';
  street: string;
  number: string;
}

export interface ServiceOption {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  iconName: string;
}

export interface Vehicle {
  id: VehicleType;
  name: string;
  description: string;
  capacityPeople: number;
  capacityCargo: string;
  basePrice: number;
  imageUrl: string;
  features: string[];
}

export interface BookingState {
  step: number;
  serviceId: string | null;
  serviceCategory: ServiceCategory | null;
  reservationCode: string;
  
  // Detailed Route
  pickup: DetailedAddress;
  dropoff: DetailedAddress;
  stops: DetailedAddress[]; 
  
  isRoundTrip: boolean; 
  returnTime: string;

  details: {
    passengerName: string;
    passengerPhone: string;
    passengerCount: number;
    notes?: string;
  };
  
  date: string; // Primary date (or first date of package)
  selectedDates: string[]; // Array for multi-day packages
  time: string;
  vehicleType: VehicleType | null;
  acceptedTerms: boolean;

  // Pricing
  pricing: {
    basePrice: number;
    zoneMultiplier: number;
    stopsCost: number;
    discountApplied: number; // 0 to 1 (e.g. 0.1 for 10%)
    totalCalculated: number;
    customerBid: string;
    bidStatus: 'none' | 'review' | 'rejected';
  }
}

export const STEPS = [
  { id: 1, title: "Motivo do serviço" },
  { id: 2, title: "Dados & Rota" },
  { id: 3, title: "Data e horário" },
  { id: 4, title: "Veículo disponível" },
  { id: 5, title: "Confirmação" },
];
