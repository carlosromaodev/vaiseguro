
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Activity, 
  PartyPopper, 
  Plus, 
  Trash2, 
  ArrowRightLeft, 
  CheckCircle2, 
  Shield, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  Car, 
  QrCode,
  AlertCircle,
  Ticket,
  User,
  Phone,
  Camera,
  School,
  CalendarDays
} from 'lucide-react';
import { 
  BookingState, 
  STEPS, 
  VehicleType,
  Zone,
  DetailedAddress,
  ServiceCategory
} from './types';
import { 
  SERVICE_OPTIONS, 
  VEHICLES, 
  AVAILABLE_ZONES, 
  BASE_PRICE, 
  PRICE_PER_STOP, 
  getZoneMultiplier,
  getZoneCode,
  getBulkDiscount
} from './constants';
import StepIndicator from './components/StepIndicator';
import NavigationButtons from './components/NavigationButtons';

// --- Helper Components & Types ---

const emptyAddress: DetailedAddress = {
  zone: '',
  street: '',
  number: ''
};

const InitialState: BookingState = {
  step: 1,
  serviceId: null,
  serviceCategory: null,
  reservationCode: `VS-${Math.floor(Math.random() * 90000) + 10000}`,
  pickup: { ...emptyAddress },
  dropoff: { ...emptyAddress },
  stops: [],
  isRoundTrip: false,
  returnTime: '',
  details: {
    passengerName: '',
    passengerPhone: '',
    passengerCount: 1,
    notes: '',
  },
  date: '',
  selectedDates: [],
  time: '',
  vehicleType: VehicleType.JIMNY_2025,
  acceptedTerms: false,
  pricing: {
    basePrice: BASE_PRICE,
    zoneMultiplier: 1.0,
    stopsCost: 0,
    discountApplied: 0,
    totalCalculated: 0,
    customerBid: '',
    bidStatus: 'none'
  }
};

// --- LIVE TICKET COMPONENT (The Visual Core) ---
const LiveTicket = ({ state, compact = false, isFinal = false }: { state: BookingState; compact?: boolean; isFinal?: boolean }) => {
  const service = SERVICE_OPTIONS.find(s => s.id === state.serviceId);
  const totalPrice = state.pricing.totalCalculated;
  const daysCount = state.selectedDates.length;
  const isPackage = daysCount > 1;
  
  // Status logic
  let status = "PENDENTE";
  let statusColor = "text-slate-400 border-slate-300";
  if (state.step > 1) { status = "EM ANDAMENTO"; statusColor = "text-navy-500 border-navy-500"; }
  if (state.step === 5) { status = "PRONTO"; statusColor = "text-emerald-500 border-emerald-500"; }
  if (isFinal || state.acceptedTerms) { status = "EMITIDO"; statusColor = "text-navy-900 border-navy-900 bg-navy-50"; }

  // Compact View (Mobile Drawer Header)
  if (compact) {
    return (
      <div className="flex justify-between items-center w-full">
         <div className="flex flex-col">
           <span className="text-[10px] font-mono text-slate-400 uppercase">Estimativa Total</span>
           <span className="text-lg font-mono font-bold text-navy-900">{totalPrice.toLocaleString('pt-AO')} Kz</span>
         </div>
         <div className={`px-2 py-1 border-2 rounded text-[10px] font-mono font-bold ${statusColor}`}>
           {status}
         </div>
      </div>
    );
  }

  // Full Ticket View
  return (
    <div className={`w-full bg-white rounded-lg shadow-ticket overflow-hidden relative ${!isFinal ? 'animate-print-ticket' : ''}`}>
      {/* Top Section: Branding */}
      <div className="bg-navy-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Shield size={16} className="text-emerald-400" />
           <span className="text-white font-mono font-bold tracking-widest text-sm">VAISEGURO</span>
        </div>
        <span className="text-[10px] text-white/60 font-mono">
           {isPackage ? 'PACOTE MÚLTIPLO' : 'CLASSE: EXECUTIVA'}
        </span>
      </div>

      {/* Main Ticket Body */}
      <div className="p-6 relative bg-paper">
        {/* Status Stamp */}
        <div className={`absolute top-4 right-4 px-2 py-1 border-2 rotate-[-10deg] opacity-80 ${statusColor}`}>
           <span className="text-xs font-mono font-bold uppercase tracking-widest">{status}</span>
        </div>

        {/* Passenger Info */}
        <div className="mb-4 pb-4 border-b border-dashed border-slate-200">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Passageiro / Responsável</div>
          <div className="text-sm font-bold text-navy-900 uppercase truncate">
             {state.details.passengerName || 'A PREENCHER...'}
          </div>
        </div>

        {/* Route Visual */}
        <div className="flex justify-between items-end mb-6">
           <div className="flex-1">
             <div className="text-[10px] font-mono text-slate-400 mb-1">DE (ORIGEM)</div>
             <div className="text-xl font-bold text-navy-900 leading-none">
               {state.pickup.zone ? getZoneCode(state.pickup.zone) : '---'}
             </div>
             <div className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-[120px]">
               {state.pickup.zone || 'Selecione'}
             </div>
           </div>
           
           <div className="flex flex-col items-center px-2 pb-2">
             <Car size={20} className="text-emerald-500 mb-1" /> 
             <div className="w-16 h-[1px] bg-slate-300 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-300 rounded-full"></div>
             </div>
           </div>

           <div className="flex-1 text-right">
             <div className="text-[10px] font-mono text-slate-400 mb-1">PARA (DESTINO)</div>
             <div className="text-xl font-bold text-navy-900 leading-none">
               {state.dropoff.zone ? getZoneCode(state.dropoff.zone) : '---'}
             </div>
             <div className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-[120px] ml-auto">
               {state.dropoff.zone || 'Selecione'}
             </div>
           </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-dashed border-slate-200">
           <div>
             <div className="text-[10px] font-mono text-slate-400 uppercase">
               {isPackage ? 'Início / Dias' : 'Data'}
             </div>
             <div className="text-sm font-mono font-bold text-navy-800">
                {isPackage 
                  ? `${daysCount} DIAS` 
                  : (state.date || '--/--/----')
                }
             </div>
           </div>
           <div>
             <div className="text-[10px] font-mono text-slate-400 uppercase">Hora</div>
             <div className="text-sm font-mono font-bold text-navy-800">{state.time || '--:--'}</div>
           </div>
           <div>
             <div className="text-[10px] font-mono text-slate-400 uppercase">Serviço</div>
             <div className="text-xs font-bold text-navy-800 truncate">{service?.title || 'Não Selecionado'}</div>
           </div>
           <div>
             <div className="text-[10px] font-mono text-slate-400 uppercase">Passageiros</div>
             <div className="text-sm font-mono font-bold text-navy-800">0{state.details.passengerCount} PAX</div>
           </div>
        </div>

        {/* Price Tag */}
        <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
           <div className="flex flex-col">
             <span className="text-xs font-mono font-bold text-slate-500">TARIFA TOTAL</span>
             {state.pricing.discountApplied > 0 && (
                <span className="text-[9px] font-mono text-emerald-500 font-bold">DESCONTO DE {(state.pricing.discountApplied * 100).toFixed(0)}% APLICADO</span>
             )}
           </div>
           <span className="text-lg font-mono font-bold text-navy-900">{totalPrice.toLocaleString('pt-AO')} Kz</span>
        </div>
      </div>

      {/* Perforation Effect */}
      <div className="relative h-8 bg-paper overflow-hidden flex items-center">
         <div className="w-4 h-8 bg-slate-200 rounded-r-full absolute left-0 ticket-notch-l"></div>
         <div className="w-full border-b-2 border-dashed border-slate-300"></div>
         <div className="w-4 h-8 bg-slate-200 rounded-l-full absolute right-0 ticket-notch-r"></div>
      </div>

      {/* Bottom Stub (Barcode) */}
      <div className="bg-paper p-6 pt-2">
         <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-mono text-slate-400">COD: {state.reservationCode}</span>
               <div className="h-8 w-32 barcode opacity-60"></div>
            </div>
            <QrCode size={48} className="text-navy-900 opacity-90" />
         </div>
      </div>
    </div>
  );
};

// --- ADDRESS FORM COMPONENT ---
const AddressForm = ({ label, data, onChange, isStop = false, onRemove }: any) => (
  <div className={`p-4 bg-white border border-slate-200 ${isStop ? 'border-l-4 border-l-emerald-400 ml-4 mb-4' : 'mb-4 border-l-4 border-l-navy-900'}`}>
    <div className="flex justify-between items-center mb-4">
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
         {isStop ? <div className="w-2 h-2 rounded-full bg-emerald-400"/> : <MapPin size={12}/>}
         {label}
      </span>
      {isStop && <button onClick={onRemove} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>}
    </div>
    
    <div className="space-y-3">
      <select value={data.zone} onChange={(e) => onChange('zone', e.target.value)}
        className="w-full h-10 px-3 bg-slate-50 border-b-2 border-slate-200 focus:border-navy-900 outline-none font-mono text-sm font-bold text-navy-900 transition-colors uppercase"
      >
        <option value="" disabled>SELECIONE A ZONA</option>
        {AVAILABLE_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
      </select>
      {data.zone === Zone.QUICAMA && <div className="text-[10px] text-red-500 font-mono font-bold mt-1">ZONA INDISPONÍVEL</div>}

      <div className="flex gap-4">
         <div className="flex-[2]">
           <input type="text" placeholder="NOME DA RUA" value={data.street} onChange={(e) => onChange('street', e.target.value)}
            className="w-full h-10 px-3 bg-slate-50 border-b-2 border-slate-200 focus:border-navy-900 outline-none font-mono text-xs uppercase"
           />
         </div>
         <div className="flex-1">
           <input type="text" placeholder="NÚMERO/REF" value={data.number} onChange={(e) => onChange('number', e.target.value)}
            className="w-full h-10 px-3 bg-slate-50 border-b-2 border-slate-200 focus:border-navy-900 outline-none font-mono text-xs uppercase"
           />
         </div>
      </div>
    </div>
  </div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [state, setState] = useState<BookingState>(InitialState);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobileTicketOpen, setIsMobileTicketOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTicketFinalized, setIsTicketFinalized] = useState(false);

  // Scroll to top on step change with smooth behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.step]);

  // Pricing Logic (Refined for ALL Packages)
  useEffect(() => {
    if (state.pickup.zone && state.dropoff.zone && state.pickup.zone !== Zone.QUICAMA) {
      const multiplier = getZoneMultiplier(state.pickup.zone as Zone, state.dropoff.zone as Zone);
      const stopsCost = state.stops.length * PRICE_PER_STOP;
      let tripBase = (BASE_PRICE * multiplier) + stopsCost;
      
      if (state.isRoundTrip) {
        tripBase = tripBase * 2;
      }

      // Calculate Days Multiplier (Universal Bulk Discount)
      let daysCount = state.selectedDates.length > 0 ? state.selectedDates.length : 1;
      let discount = getBulkDiscount(daysCount);

      // If only 1 day is selected, no discount applied (handled by getBulkDiscount returning 0 for < 2)
      
      const totalBeforeDiscount = tripBase * daysCount;
      const totalAfterDiscount = totalBeforeDiscount * (1 - discount);

      setState(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          basePrice: BASE_PRICE,
          zoneMultiplier: multiplier,
          stopsCost,
          discountApplied: discount,
          totalCalculated: Math.round(totalAfterDiscount)
        }
      }));
    }
  }, [state.pickup.zone, state.dropoff.zone, state.stops.length, state.isRoundTrip, state.selectedDates.length, state.serviceCategory]);

  const handleNext = () => {
    if ((state.pickup.zone === Zone.QUICAMA || state.dropoff.zone === Zone.QUICAMA)) {
      alert("A zona 'Quiçama' está temporariamente fora da nossa área de cobertura.");
      return;
    }
    // Validation for Step 2
    if (state.step === 2) {
      if (!state.details.passengerName || !state.details.passengerPhone) {
        alert("Por favor, preencha o Nome e Telefone.");
        return;
      }
    }
    // Validation for Step 3 (Dates)
    if (state.step === 3) {
      // Universal check: must have at least one date selected
      if (state.selectedDates.length === 0) {
        alert("Por favor, selecione pelo menos um dia no calendário.");
        return;
      }
      if (!state.time) {
        alert("Selecione o horário da viagem.");
        return;
      }
    }

    if (state.step < STEPS.length) {
      setState(prev => ({ ...prev, step: prev.step + 1 }));
    } else {
      finalizeBooking();
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      setState(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const addStop = () => {
    if (state.stops.length < 3) {
      setState(prev => ({ ...prev, stops: [...prev.stops, { ...emptyAddress }] }));
    }
  };

  const removeStop = (index: number) => {
    const newStops = [...state.stops];
    newStops.splice(index, 1);
    setState(prev => ({ ...prev, stops: newStops }));
  };

  const updateStop = (index: number, field: keyof DetailedAddress, value: string) => {
    const newStops = [...state.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setState(prev => ({ ...prev, stops: newStops }));
  };

  const updateAddress = (type: 'pickup' | 'dropoff', field: keyof DetailedAddress, value: string) => {
    setState(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleBidSubmit = () => {
    const bidValue = parseInt(state.pricing.customerBid.replace(/\D/g, '')) || 0;
    // Strict rule: Minimum accepted value is BASE_PRICE (8,999) regardless of total package
    if (bidValue < BASE_PRICE) {
      setState(prev => ({ ...prev, pricing: { ...prev.pricing, bidStatus: 'rejected' } }));
    } else {
      setState(prev => ({ ...prev, pricing: { ...prev.pricing, bidStatus: 'review' } }));
    }
  };

  const finalizeBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsTicketFinalized(true);
    }, 1500); 
  };

  const canProceed = () => {
    if (isProcessing) return false;

    switch (state.step) {
      case 1:
        return !!state.serviceId;
      case 2:
        return !!state.details.passengerName && 
               !!state.details.passengerPhone && 
               !!state.pickup.zone && 
               !!state.dropoff.zone;
      case 3:
        // Unified Logic: Must have at least one date in the array and a time
        return state.selectedDates.length > 0 && !!state.time;
      case 4:
        return !!state.vehicleType;
      case 5:
        return state.acceptedTerms && state.pricing.bidStatus !== 'rejected';
      default:
        return false;
    }
  };

  const toggleDateSelection = (dateStr: string) => {
    // Multi-select logic applied UNIVERSALLY
    const currentDates = [...state.selectedDates];
    if (currentDates.includes(dateStr)) {
      const newDates = currentDates.filter(d => d !== dateStr);
      // If we deselect everything, date becomes empty. 
      // If we still have dates, pick the first one as primary 'date' for display if needed.
      setState(prev => ({ ...prev, selectedDates: newDates, date: newDates.length > 0 ? newDates[0] : '' }));
    } else {
      const newDates = [...currentDates, dateStr].sort(); // Keep sorted
      setState(prev => ({ ...prev, selectedDates: newDates, date: newDates[0] }));
    }
  };

  // --- Calendar Helpers ---
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const isWeekend = (year: number, month: number, day: number) => { const date = new Date(year, month, day); const d = date.getDay(); return d === 0 || d === 6; };
  const isPast = (year: number, month: number, day: number) => { const today = new Date(); today.setHours(0, 0, 0, 0); return new Date(year, month, day) < today; };

  // --- Render Functions (The Kiosk Screens) ---

  const renderServiceSelection = () => (
    <div className="animate-fade-in space-y-4">
      <div className="bg-white p-4 rounded-sm border-l-4 border-navy-900 shadow-sm">
        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-navy-900">1. Selecione o Motivo da Viagem</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICE_OPTIONS.map((option) => {
          const Icon = { GraduationCap, Briefcase, Activity, PartyPopper, School }[option.iconName] || Briefcase;
          const isSelected = state.serviceId === option.id;
          return (
            <div key={option.id} onClick={() => {
              // Reset dates when switching service types to avoid conflicts
              setState(prev => ({ ...prev, serviceId: option.id, serviceCategory: option.category, date: '', selectedDates: [] }));
            }}
              className={`relative cursor-pointer border-2 p-6 transition-all duration-200 group
                ${isSelected ? 'border-navy-900 bg-white shadow-md' : 'border-slate-200 bg-slate-50 hover:border-slate-400'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <Icon size={24} className={isSelected ? 'text-navy-900' : 'text-slate-400'} />
                <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${isSelected ? 'border-navy-900' : 'border-slate-300'}`}>
                  {isSelected && <div className="w-2 h-2 bg-navy-900 rounded-full" />}
                </div>
              </div>
              <h4 className="font-mono font-bold text-sm uppercase mb-2">{option.title}</h4>
              <p className="text-xs text-slate-500 font-mono leading-relaxed">{option.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDetailsInput = () => (
    <div className="animate-slide-up space-y-6">
      <div className="bg-white p-4 rounded-sm border-l-4 border-navy-900 shadow-sm">
        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-navy-900">2. Dados do Passageiro & Rota</h3>
      </div>

      {/* Passenger Information Inputs */}
      <div className="bg-white p-6 border border-slate-200">
         <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
           <User size={12} /> Identificação do Responsável / Passageiro
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Nome Completo</label>
              <input 
                type="text" 
                placeholder="Ex: JOÃO PAULO SILVA"
                value={state.details.passengerName}
                onChange={(e) => setState(prev => ({ ...prev, details: { ...prev.details, passengerName: e.target.value.toUpperCase() } }))}
                className="w-full h-10 px-3 bg-slate-50 border-b-2 border-slate-200 focus:border-navy-900 outline-none font-mono text-sm font-bold text-navy-900 uppercase"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Telefone / WhatsApp</label>
              <div className="flex items-center">
                 <Phone size={14} className="text-slate-400 mr-2" />
                 <input 
                  type="tel" 
                  placeholder="Ex: 923 456 789"
                  value={state.details.passengerPhone}
                  onChange={(e) => setState(prev => ({ ...prev, details: { ...prev.details, passengerPhone: e.target.value } }))}
                  className="w-full h-10 px-3 bg-slate-50 border-b-2 border-slate-200 focus:border-navy-900 outline-none font-mono text-sm font-bold text-navy-900 uppercase"
                />
              </div>
            </div>
         </div>
      </div>
      
      <div className="bg-white p-4 rounded-sm border-l-4 border-navy-900 shadow-sm mt-8">
        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-navy-900">3. Configurar Rota</h3>
      </div>
      
      <AddressForm label="PARTIDA (ORIGEM)" data={state.pickup} onChange={(f: any, v: any) => updateAddress('pickup', f, v)} />
      {state.stops.map((stop, i) => (
        <AddressForm key={i} label={`PARADA EXTRA 0${i+1} (+1.500 KZ)`} data={stop} isStop={true} onChange={(f: any, v: any) => updateStop(i, f, v)} onRemove={() => removeStop(i)} />
      ))}
      <AddressForm label="DESTINO" data={state.dropoff} onChange={(f: any, v: any) => updateAddress('dropoff', f, v)} />

      <button onClick={addStop} disabled={state.stops.length >= 3} className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-400 font-mono text-xs font-bold uppercase hover:border-emerald-400 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2">
        <Plus size={14} /> Adicionar Parada
      </button>

      {/* Flight Mode & Pax */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
         <div onClick={() => setState(prev => ({ ...prev, isRoundTrip: !prev.isRoundTrip }))}
            className={`p-4 border-2 cursor-pointer flex items-center justify-between ${state.isRoundTrip ? 'border-navy-900 bg-white' : 'border-slate-200 bg-slate-50'}`}
         >
           <div>
             <span className="block text-[10px] font-mono text-slate-400 uppercase">Tipo de Viagem</span>
             <span className="font-mono font-bold text-navy-900 uppercase">{state.isRoundTrip ? 'Ida e Volta' : 'Apenas Ida'}</span>
           </div>
           <ArrowRightLeft size={16} className={state.isRoundTrip ? 'text-navy-900' : 'text-slate-400'} />
         </div>

         <div className="p-4 border-2 border-slate-200 bg-white">
            <span className="block text-[10px] font-mono text-slate-400 uppercase mb-2">Passageiros (Máx 3)</span>
            <div className="flex gap-2">
               {[1, 2, 3].map(n => (
                 <button key={n} onClick={() => setState(prev => ({ ...prev, details: { ...prev.details, passengerCount: n } }))}
                   className={`w-8 h-8 font-mono font-bold text-sm ${state.details.passengerCount === n ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                 >
                   {n}
                 </button>
               ))}
            </div>
         </div>
      </div>
      
      <div className="p-4 bg-white border border-slate-200">
         <label className="text-[10px] font-mono text-slate-400 uppercase mb-2 block">Instruções Especiais (Ex: Portão, Nome da criança, etc.)</label>
         <textarea rows={2} className="w-full bg-slate-50 border-b border-slate-200 focus:border-navy-900 outline-none font-mono text-xs p-2"
           placeholder="Detalhes para o motorista..." value={state.details.notes} onChange={(e) => setState(prev => ({ ...prev, details: { ...prev.details, notes: e.target.value } }))}
         />
      </div>
    </div>
  );

  const renderScheduler = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    for(let i=0; i<firstDay; i++) days.push(null);
    for(let i=1; i<=daysInMonth; i++) days.push(i);

    const slots = ['07:00', '08:00', '11:00', '12:00', '13:00', '14:00', '16:00', '17:00'];

    return (
      <div className="animate-slide-up space-y-6">
        <div className="bg-white p-4 rounded-sm border-l-4 border-navy-900 shadow-sm flex justify-between items-center">
           <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-navy-900">4. Selecione os Dias</h3>
           <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">
              MULTI-SELEÇÃO ATIVA
           </span>
        </div>

        <div className="bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-xs font-mono">
          <div className="font-bold flex items-center gap-2 mb-2"><CalendarDays size={14}/> QUANTO MAIS DIAS, MENOR O PREÇO:</div>
          <ul className="list-disc pl-4 space-y-1">
            <li>2 a 4 dias: <span className="font-bold">5% OFF</span></li>
            <li>5 a 9 dias (Semana Completa): <span className="font-bold">10% OFF</span></li>
            <li>10+ dias (Mensal): <span className="font-bold">15% OFF</span></li>
          </ul>
        </div>

        <div className="bg-white p-6 border border-slate-200">
           {/* Calendar Header */}
           <div className="flex justify-between items-center mb-6">
              <button onClick={handlePrevMonth} className="text-slate-400 hover:text-navy-900"><ChevronLeft/></button>
              <span className="font-mono font-bold text-navy-900 uppercase">{currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
              <button onClick={handleNextMonth} className="text-slate-400 hover:text-navy-900"><ChevronRight/></button>
           </div>
           
           {/* Grid */}
           <div className="grid grid-cols-7 gap-2 mb-8 text-center">
             {['D','S','T','Q','Q','S','S'].map((d,i) => <span key={i} className="text-[10px] font-mono text-slate-400">{d}</span>)}
             {days.map((d, idx) => {
               if (!d) return <div key={idx} />;
               const disabled = isWeekend(currentMonth.getFullYear(), currentMonth.getMonth(), d) || isPast(currentMonth.getFullYear(), currentMonth.getMonth(), d);
               const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d).toLocaleDateString('pt-BR');
               
               // Universal Selection Logic
               const isSelected = state.selectedDates.includes(dateStr);

               return (
                 <button key={d} disabled={disabled} onClick={() => toggleDateSelection(dateStr)}
                   className={`h-8 w-8 text-xs font-mono font-bold transition-all relative
                     ${isSelected 
                        ? 'bg-navy-900 text-white shadow-lg scale-110 z-10' 
                        : disabled 
                          ? 'text-slate-200 cursor-not-allowed' 
                          : 'text-slate-600 hover:bg-slate-100'}
                   `}
                 >
                   {d < 10 ? `0${d}` : d}
                   {isSelected && (
                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border border-white"></div>
                   )}
                 </button>
               )
             })}
           </div>
           
           <div className="mb-6 text-center">
             <span className="text-xs font-mono font-bold text-navy-900 border-b-2 border-emerald-400">
               {state.selectedDates.length} DIA(S) SELECIONADO(S)
             </span>
           </div>

           {/* Time Slots */}
           <div className={`transition-opacity duration-300 ${(state.date || state.selectedDates.length > 0) ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-3">Horário de Coleta</div>
              <div className="grid grid-cols-4 gap-2">
                 {slots.map(t => (
                   <button key={t} onClick={() => setState(prev => ({ ...prev, time: t }))}
                     className={`py-2 text-xs font-mono font-bold border ${state.time === t ? 'border-navy-900 bg-navy-900 text-white' : 'border-slate-200 hover:border-emerald-400'}`}
                   >
                     {t}
                   </button>
                 ))}
              </div>
           </div>

           {state.isRoundTrip && (
             <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
               <div className="text-[10px] font-mono text-slate-400 uppercase mb-3">Horário de Retorno</div>
               <div className="grid grid-cols-4 gap-2">
                 {slots.map(t => (
                   <button key={t} onClick={() => setState(prev => ({ ...prev, returnTime: t }))} disabled={t <= state.time}
                     className={`py-2 text-xs font-mono font-bold border ${state.returnTime === t ? 'border-navy-900 bg-navy-900 text-white' : 'border-slate-200 hover:border-emerald-400'} ${t <= state.time ? 'opacity-30' : ''}`}
                   >
                     {t}
                   </button>
                 ))}
              </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  const renderVehicleSelection = () => (
     <div className="animate-slide-up space-y-6">
        <div className="bg-white p-4 rounded-sm border-l-4 border-navy-900 shadow-sm">
           <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-navy-900">5. Aeronave / Veículo</h3>
        </div>
        <div className="bg-white border-2 border-emerald-500 shadow-lg p-6 relative overflow-hidden group transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl" style={{perspective: '1000px'}}>
           <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-mono font-bold px-3 py-1">FROTA VERIFICADA</div>
           <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 relative transition-transform duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6" style={{transformStyle: 'preserve-3d'}}>
                 <img src={VEHICLES[0].imageUrl} alt="Jimny" className="w-full object-contain drop-shadow-2xl transition-all duration-500 group-hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]" />
                 <div className="absolute bottom-0 left-0 bg-white/80 backdrop-blur px-2 py-1 border border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-navy-900">MODELO: JIMNY 2025</span>
                 </div>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                 <h2 className="text-xl font-mono font-bold text-navy-900">SUZUKI JIMNY SIERRA</h2>
                 <p className="text-xs font-mono text-slate-500 leading-relaxed">{VEHICLES[0].description}</p>
                 <div className="grid grid-cols-2 gap-2">
                    {VEHICLES[0].features.map((f, i) => (
                       <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                          <CheckCircle2 size={10} className="text-emerald-500" /> {f}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  const renderFinalConfirmation = () => {
    const { basePrice, zoneMultiplier, stopsCost, totalCalculated, bidStatus, discountApplied } = state.pricing;
    const days = state.selectedDates.length;
    const isPackage = days > 1;

    return (
      <div className="animate-slide-up space-y-6">
         <div className="bg-white p-4 rounded-sm border-l-4 border-emerald-500 shadow-sm">
           <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-navy-900">6. Validação Final</h3>
        </div>

        {/* Info Summary */}
        <div className="bg-slate-100 p-6 border border-slate-200 text-sm font-mono">
           <div className="flex justify-between mb-2">
             <span className="text-slate-500">RESPONSÁVEL:</span>
             <span className="text-navy-900 font-bold">{state.details.passengerName}</span>
           </div>
           {isPackage && (
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">TOTAL DE DIAS:</span>
                <span className="text-navy-900 font-bold">{days} Dias</span>
              </div>
           )}
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white border border-slate-200 p-6 font-mono text-sm">
           <div className="flex justify-between mb-2">
              <span className="text-slate-500">TARIFA UNITÁRIA (BASE)</span>
              <span className="text-navy-900 font-bold">{basePrice.toLocaleString()} Kz</span>
           </div>
           
           {isPackage ? (
             <div className="flex justify-between mb-2">
               <span className="text-slate-500">SUBTOTAL ({days} DIAS)</span>
               <span className="text-navy-900 font-bold">{(totalCalculated / (1-discountApplied)).toLocaleString(undefined, {maximumFractionDigits: 0})} Kz</span>
             </div>
           ) : (
             <div className="flex justify-between mb-2">
                <span className="text-slate-500">MULTIPLICADOR ZONA</span>
                <span className="text-navy-900 font-bold">x{zoneMultiplier}</span>
             </div>
           )}

           {discountApplied > 0 && (
             <div className="flex justify-between mb-2 text-emerald-600">
               <span className="">DESCONTO POR VOLUME ({(discountApplied*100).toFixed(0)}%)</span>
               <span className="font-bold">APLICADO</span>
             </div>
           )}

           <div className="border-t border-dashed border-slate-300 my-4"></div>
           <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-navy-900">TOTAL FINAL</span>
              <span className="font-bold text-navy-900">{totalCalculated.toLocaleString()} Kz</span>
           </div>
        </div>

        {/* Negotiation */}
        <div className="bg-slate-50 border border-slate-200 p-6">
           <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold text-slate-500 uppercase">
              <AlertCircle size={12}/> Opcional: Enviar Contraproposta
           </div>
           <div className="flex gap-2">
              <input type="text" placeholder="INSERIR VALOR (KZ)" value={state.pricing.customerBid}
                onChange={(e) => setState(prev => ({ ...prev, pricing: { ...prev.pricing, customerBid: e.target.value, bidStatus: 'none' } }))}
                className="flex-1 h-10 px-3 bg-navy-800 border border-navy-700 font-mono text-sm font-bold text-white outline-none focus:border-emerald-500 placeholder:text-slate-500"
              />
              <button onClick={handleBidSubmit} className="bg-navy-900 text-white px-4 font-mono font-bold text-xs uppercase hover:bg-navy-800">Verificar</button>
           </div>
           {/* IMPORTANT: Floor Rule logic displayed to user if rejected */}
           {bidStatus === 'rejected' && <div className="mt-2 text-[10px] font-mono text-red-500 font-bold flex items-center gap-1"><AlertTriangle size={10}/> OFERTA INVÁLIDA: MÍNIMO ACEITÁVEL {BASE_PRICE.toLocaleString()} KZ</div>}
           {bidStatus === 'review' && <div className="mt-2 text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={10}/> OFERTA PENDENTE DE REVISÃO</div>}
        </div>

        {/* Legal Terms Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer p-4 border border-transparent hover:border-slate-200 transition-colors">
           <input type="checkbox" checked={state.acceptedTerms} onChange={(e) => setState(prev => ({...prev, acceptedTerms: e.target.checked}))}
             className="w-4 h-4 rounded-sm border-slate-300 text-navy-900 focus:ring-navy-900"
           />
           <span className="text-xs font-mono text-slate-500">Confirmo que os detalhes acima estão corretos e aceito os termos de transporte.</span>
        </label>
      </div>
    );
  };

  // --- FULL SCREEN FINAL TICKET VIEW ---
  if (isTicketFinalized) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-4">
        {/* Toast / Notification */}
        <div className="absolute top-10 z-50 animate-bounce">
           <div className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-full border border-white/20 shadow-xl flex items-center gap-3">
              <Camera size={20} className="text-emerald-400" />
              <div className="flex flex-col">
                 <span className="text-xs font-mono font-bold uppercase tracking-widest">Tire um print agora!</span>
                 <span className="text-[10px] text-slate-300">Este é seu bilhete de embarque oficial.</span>
              </div>
           </div>
        </div>

        {/* Large Ticket Container */}
        <div className="w-full max-w-md transform scale-105 md:scale-110 shadow-2xl">
           <LiveTicket state={state} isFinal={true} />
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex gap-4">
           <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-widest" onClick={() => window.location.reload()}>
              <Plus size={14} /> Novo Agendamento
           </button>
        </div>
      </div>
    );
  }

  // --- STANDARD LAYOUT ---
  return (
    <div className="min-h-screen bg-slate-200 font-sans text-navy-900 pb-20 md:pb-0">
      
      {/* --- HEADER (Airport Screen Style) --- */}
      <header className="bg-navy-900 text-white sticky top-0 z-40 border-b-4 border-emerald-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                 <Shield size={16} />
              </div>
              <div>
                 <h1 className="font-mono font-bold text-lg tracking-widest leading-none">VAISEGURO</h1>
                 <p className="font-mono text-[10px] text-slate-400 uppercase">Status do Sistema: ONLINE</p>
              </div>
           </div>
           <div className="hidden md:block font-mono text-xs text-emerald-400 animate-pulse">
              ● SISTEMA DE EMBARQUE ATIVO
           </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT (The Kiosk) --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8">
           
           {/* LEFT COLUMN: INPUT TERMINAL (Cols 1-7) */}
           <div className="md:col-span-7 lg:col-span-8 flex flex-col min-h-[600px]">
              
              {/* Flight Path (Stepper) */}
              <StepIndicator currentStep={state.step} />
              
              {/* Dynamic Step Content */}
              <div className="flex-grow">
                {state.step === 1 && renderServiceSelection()}
                {state.step === 2 && renderDetailsInput()}
                {state.step === 3 && renderScheduler()}
                {state.step === 4 && renderVehicleSelection()}
                {state.step === 5 && renderFinalConfirmation()}
              </div>

              {/* Navigation Actions */}
              <NavigationButtons 
                canGoBack={state.step > 1} canGoNext={canProceed()} 
                onBack={handleBack} onNext={handleNext} 
                nextLabel={
                  isProcessing 
                    ? "PROCESSANDO..." 
                    : state.step === 5 
                      ? "CONFIRMAR VIAGEM" 
                      : "AVANÇAR"
                } 
                isFinal={state.step === 5} 
              />
           </div>

           {/* RIGHT COLUMN: LIVE TICKET PREVIEW (Cols 8-12) - Sticky on Desktop */}
           <div className="hidden md:block md:col-span-5 lg:col-span-4">
              <div className="sticky top-24">
                 <div className="mb-2 flex justify-between items-end">
                    <span className="text-xs font-mono font-bold uppercase text-slate-500">Pré-visualização</span>
                    <span className="text-[10px] font-mono text-emerald-600">ATUALIZANDO...</span>
                 </div>
                 <LiveTicket state={state} />
                 
                 <div className="mt-4 p-4 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono text-slate-500 leading-relaxed text-center">
                    Preços calculados automaticamente com base na rota e volume de dias.
                 </div>
              </div>
           </div>

        </div>
      </main>

      {/* --- MOBILE DRAWER (The "Pocket" Ticket) --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 transition-transform duration-300 transform translate-y-0">
         {/* Toggle Handle */}
         <div onClick={() => setIsMobileTicketOpen(!isMobileTicketOpen)}
           className="bg-navy-900 text-white p-3 flex justify-between items-center cursor-pointer shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
         >
            <div className="flex items-center gap-2">
               <Ticket size={16} className="text-emerald-400" />
               <span className="font-mono text-xs font-bold uppercase tracking-widest">RESUMO DO VOO</span>
            </div>
            {isMobileTicketOpen ? <ChevronRight size={16} className="rotate-90"/> : <ChevronLeft size={16} className="rotate-90"/>}
         </div>

         {/* Collapsible Ticket Content */}
         <div className={`bg-slate-200 p-4 transition-all duration-300 ease-in-out ${isMobileTicketOpen ? 'max-h-[600px]' : 'max-h-0'} overflow-hidden`}>
            <LiveTicket state={state} />
         </div>
         
         {/* Navigation Overlay if closed */}
         {!isMobileTicketOpen && (
            <div className="bg-white p-4 border-t border-slate-200">
               <NavigationButtons 
                 canGoBack={state.step > 1} canGoNext={canProceed()} 
                 onBack={handleBack} onNext={handleNext} 
                 nextLabel={state.step === 5 ? "CONFIRMAR" : "PRÓXIMO"} 
                 isFinal={state.step === 5} 
               />
            </div>
         )}
      </div>

    </div>
  );
};

export default App;
