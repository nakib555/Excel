import React from 'react';
import { AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignLeft, AlignCenter, AlignRight, MoveLeft, MoveRight, WrapText, Merge, ChevronDown } from 'lucide-react';
import { RibbonGroup, RibbonButton, Separator, TabProps } from '../../shared';

const AlignmentGroup: React.FC<TabProps> = ({ currentStyle, onToggleStyle }) => {
  return (
    <RibbonGroup label="Alignment">
        <div className="flex gap-2 h-full py-0.5">
             <div className="flex flex-col justify-between h-full py-0.5 gap-0.5">
                 <div className="flex gap-0.5">
                    <RibbonButton variant="icon-only" icon={<AlignVerticalJustifyStart size={14} className="rotate-180 text-slate-600" />} onClick={() => {}} title="Top Align" />
                    <RibbonButton variant="icon-only" icon={<AlignVerticalJustifyCenter size={14} className="text-slate-600" />} onClick={() => {}} title="Middle Align" />
                    <RibbonButton variant="icon-only" icon={<AlignVerticalJustifyEnd size={14} className="rotate-180 text-slate-600" />} onClick={() => {}} title="Bottom Align" />
                    <Separator />
                    <RibbonButton variant="icon-only" icon={<span className="font-serif italic font-bold -rotate-45 block text-[10px] text-slate-700">ab</span>} onClick={() => {}} title="Orientation" />
                 </div>
                 <div className="flex gap-0.5">
                    <RibbonButton variant="icon-only" icon={<AlignLeft size={14} className="text-slate-600" />} active={currentStyle.align === 'left'} onClick={() => onToggleStyle('align', 'left')} title="Align Left" />
                    <RibbonButton variant="icon-only" icon={<AlignCenter size={14} className="text-slate-600" />} active={currentStyle.align === 'center'} onClick={() => onToggleStyle('align', 'center')} title="Center" />
                    <RibbonButton variant="icon-only" icon={<AlignRight size={14} className="text-slate-600" />} active={currentStyle.align === 'right'} onClick={() => onToggleStyle('align', 'right')} title="Align Right" />
                    <Separator />
                    <RibbonButton variant="icon-only" icon={<div className="flex -space-x-1 items-center text-slate-500"><MoveLeft size={10} /><div className="w-[1px] h-2.5 bg-slate-400"></div></div>} onClick={() => {}} title="Decrease Indent" />
                    <RibbonButton variant="icon-only" icon={<div className="flex -space-x-1 items-center text-slate-500"><div className="w-[1px] h-2.5 bg-slate-400"></div><MoveRight size={10} /></div>} onClick={() => {}} title="Increase Indent" />
                 </div>
             </div>

             <div className="flex flex-col gap-0.5 justify-center min-w-[100px]">
                 <button className="flex items-center gap-2 px-2 py-0.5 hover:bg-slate-100 rounded text-[11px] font-medium text-slate-700 w-full text-left transition-colors h-7">
                     <WrapText size={16} className="text-blue-500" />
                     <span>Wrap Text</span>
                 </button>
                 <button className="flex items-center gap-2 px-2 py-0.5 hover:bg-slate-100 rounded text-[11px] font-medium text-slate-700 w-full text-left transition-colors h-7">
                     <Merge size={16} className="text-emerald-500" />
                     <span>Merge & Center</span>
                     <ChevronDown size={10} className="ml-auto opacity-50 stroke-[3]" />
                 </button>
             </div>
        </div>
    </RibbonGroup>
  );
};

export default AlignmentGroup;