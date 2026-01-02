import React from 'react';
import { ChevronLeft, Check, Ticket } from 'lucide-react';

interface NavigationButtonsProps {
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  isFinal?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  nextLabel = "CONTINUAR",
  isFinal = false,
}) => {
  return (
    <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`
          flex items-center text-xs font-mono font-bold uppercase tracking-widest transition-colors
          ${canGoBack 
            ? 'text-slate-500 hover:text-navy-900' 
            : 'text-transparent cursor-default'}
        `}
      >
        <ChevronLeft size={14} className="mr-1" />
        Voltar
      </button>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`
          group relative overflow-hidden flex items-center justify-center px-8 py-4 rounded-sm transition-all shadow-sm
          ${canGoNext
            ? isFinal 
              ? 'bg-navy-900 text-white hover:bg-navy-800' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
        `}
      >
        <span className="relative z-10 flex items-center font-mono font-bold text-sm tracking-widest uppercase">
          {nextLabel}
          {isFinal ? <Ticket size={16} className="ml-2" /> : <Check size={16} className="ml-2" />}
        </span>
        
        {/* Hover Effect */}
        {canGoNext && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/10 transition-transform duration-300"></div>
        )}
      </button>
    </div>
  );
};

export default NavigationButtons;