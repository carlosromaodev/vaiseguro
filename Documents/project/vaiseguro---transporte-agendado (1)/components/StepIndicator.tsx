import React from 'react';
import { STEPS } from '../types';
import { Plane, Circle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm">
      <div className="flex justify-between items-center relative">
        
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-300 -z-10 transform -translate-y-1/2 mx-4"></div>

        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 bg-inherit px-2">
              <div 
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-navy-900 border-navy-900 text-white' 
                    : isCurrent 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' 
                      : 'bg-white border-slate-300 text-slate-300'}
                `}
              >
                {isCurrent ? (
                  <Plane size={12} className="fill-current animate-pulse" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>
              
              <div className="hidden md:flex flex-col items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isCurrent ? 'text-navy-900' : 'text-slate-400'}`}>
                  Etapa {step.id}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded mt-0.5">
                    {step.title}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Current Step Label */}
      <div className="md:hidden text-center mt-3">
        <span className="text-xs font-mono font-bold text-navy-900 uppercase tracking-widest border-b-2 border-emerald-500 pb-1">
          {STEPS[currentStep - 1].title}
        </span>
      </div>
    </div>
  );
};

export default StepIndicator;