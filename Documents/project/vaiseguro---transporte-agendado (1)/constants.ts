
import { ServiceCategory, ServiceOption, Vehicle, VehicleType, Zone } from './types';

export const BASE_PRICE = 8999;
export const PRICE_PER_STOP = 1500;

export const AVAILABLE_ZONES = [
  Zone.CITY,
  Zone.TALATONA,
  Zone.BELAS,
  Zone.KILAMBA,
  Zone.CAZENGA,
  Zone.VIANA,
  Zone.CACUACO,
  Zone.ICOLO,
  Zone.QUICAMA
];

// Matrix to determine multiplier based on Origin -> Destination
export const getZoneMultiplier = (origin: Zone, dest: Zone): number => {
  if (origin === dest) return 1.0;

  // Helper groups
  const isSouth = (z: Zone) => [Zone.TALATONA, Zone.BELAS, Zone.KILAMBA].includes(z);
  const isNorth = (z: Zone) => [Zone.VIANA, Zone.CACUACO, Zone.ICOLO].includes(z);
  const isCity = (z: Zone) => z === Zone.CITY;

  // Specific Rules
  
  // Kilamba <-> Talatona/Belas (Normal)
  if (isSouth(origin) && isSouth(dest)) return 1.0;

  // Kilamba -> City (High)
  if ((origin === Zone.KILAMBA && dest === Zone.CITY) || (origin === Zone.CITY && dest === Zone.KILAMBA)) return 2.9;

  // North -> South (High)
  if ((isNorth(origin) && isSouth(dest)) || (isSouth(origin) && isNorth(dest))) return 2.9;

  // City -> Periphery (North or South) -> High
  if ((isCity(origin) && (isNorth(dest) || isSouth(dest))) || ((isNorth(origin) || isSouth(origin)) && isCity(dest))) return 2.9;

  // Default Medium
  return 1.25;
};

export const getZoneCode = (zone: string): string => {
  switch(zone) {
    case Zone.CITY: return 'LUA';
    case Zone.TALATONA: return 'TAL';
    case Zone.BELAS: return 'BEL';
    case Zone.KILAMBA: return 'KIL';
    case Zone.CAZENGA: return 'CAZ';
    case Zone.VIANA: return 'VIA';
    case Zone.CACUACO: return 'CAC';
    case Zone.ICOLO: return 'ICO';
    case Zone.QUICAMA: return 'QUI';
    default: return 'AO';
  }
};

export const getBulkDiscount = (numberOfDays: number): number => {
  if (numberOfDays >= 20) return 0.25; // 25% off for monthly style
  if (numberOfDays >= 10) return 0.15; // 15% off
  if (numberOfDays >= 5) return 0.10;  // 10% off for weekly
  if (numberOfDays >= 2) return 0.05;  // 5% off
  return 0;
};

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'school_run',
    category: ServiceCategory.SCHOOL,
    title: 'Buscar Crianças',
    description: 'Pacote escolar seguro. Agende os dias da semana e pague menos por quantidade.',
    iconName: 'School'
  },
  {
    id: 'work_commute',
    category: ServiceCategory.WORK,
    title: 'Trabalho & Reuniões',
    description: 'Transporte executivo recorrente. Ideal para ir dar aulas, escritório ou reuniões. Agende sua semana.',
    iconName: 'Briefcase'
  },
  {
    id: 'student_college',
    category: ServiceCategory.STUDENT,
    title: 'Estudante / Faculdade',
    description: 'Ida e volta para faculdade ou cursos. Monte seu pacote mensal e garanta seu transporte.',
    iconName: 'GraduationCap'
  },
  {
    id: 'health_urgency',
    category: ServiceCategory.URGENCY,
    title: 'Saúde & Consultas',
    description: 'Tratamentos recorrentes ou consultas pontuais. Agende múltiplos dias se necessário.',
    iconName: 'Activity'
  },
  {
    id: 'leisure_event',
    category: ServiceCategory.LEISURE,
    title: 'Lazer & Eventos',
    description: 'Eventos de múltiplos dias ou festas pontuais. Segurança garantida na ida e volta.',
    iconName: 'PartyPopper'
  }
];

export const VEHICLES: Vehicle[] = [
  {
    id: VehicleType.JIMNY_2025,
    name: 'Suzuki Jimny Sierra 3-Door (2025)',
    description: 'O ícone 4x4 em sua versão mais ágil e exclusiva. Configuração 3 portas para máxima performance urbana e estilo.',
    capacityPeople: 3,
    capacityCargo: '85L (Bancos Levantados)',
    basePrice: 90,
    imageUrl: 'https://pngimg.com/d/suzuki_jimny_PNG20.png', 
    features: [
      'Configuração 3 Portas (Short Wheelbase)',
      'Tração 4x4 AllGrip Pro',
      'Multimídia 9" JBL',
      'Frenagem Autônoma',
      'Design "Boxy" 3D'
    ]
  }
];

export const WHATSAPP_NUMBER = "5511999999999";
