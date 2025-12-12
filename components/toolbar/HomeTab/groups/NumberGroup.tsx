import React from 'react';
import { DollarSign, Percent, MoveLeft, MoveRight, ChevronDown } from 'lucide-react';
import { RibbonGroup, RibbonButton, TabProps } from '../../shared';

const NumberGroup: React.FC<TabProps> = () => {
  return (
    <RibbonGroup label="Number">
         <div className="flex flex-col gap-1 justify-center h-full py-0.5">
             <div className="w-32 md:w-32 h-7 bg-white border border-slate-300 rounded flex items-center justify-between px-2 text-xs text-slate-700 shadow-sm cursor-pointer hover:border-slate-400">
                    <span>General</span>
                    <ChevronDown size={10} className="opacity-50" />
             </div>
             <div className="flex items-center gap-1 justify-between px-1">
                 <div className="flex gap-0.5">
                    <RibbonButton variant="icon-only" icon={<DollarSign size={14} className="text-emerald-600" />} onClick={() => {}} title="Currency" />
                    <RibbonButton variant="icon-only" icon={<Percent size={14} className="text-blue-600" />} onClick={() => {}} title="Percent" />
                    <RibbonButton variant="icon-only" icon={<span className="font-bold text-[11px] text-slate-600">,</span>} onClick={() => {}} title="Comma Style" />
                 </div>
                 <div className="flex gap-0.5">
                    <RibbonButton variant="icon-only" icon={<div className="flex items-center text-[9px]"><span className="text-blue-500">.0</span><MoveLeft size={8} /></div>} onClick={() => {}} title="Increase Decimal" />
                    <RibbonButton variant="icon-only" icon={<div className="flex items-center text-[9px]"><MoveRight size={8} /><span className="text-blue-500">.0</span></div>} onClick={() => {}} title="Decrease Decimal" />
                 </div>
             </div>
         </div>
    </RibbonGroup>
  );
};

export default NumberGroup;