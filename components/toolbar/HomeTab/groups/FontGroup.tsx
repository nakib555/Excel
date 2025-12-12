import React from 'react';
import { ChevronDown, Bold, Italic, Underline, Grid3X3, PaintBucket, Type } from 'lucide-react';
import { RibbonGroup, RibbonButton, ColorPicker, Separator, TabProps } from '../../shared';

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72];

const FontGroup: React.FC<TabProps> = ({ currentStyle, onToggleStyle }) => {
  const currentFontSize = currentStyle.fontSize || 13;

  return (
    <RibbonGroup label="Font" className="px-3">
        <div className="flex flex-col gap-1 justify-center h-full py-0.5">
            <div className="flex items-center gap-1.5">
                <div className="w-32 h-7 bg-white border border-slate-300 hover:border-slate-400 rounded flex items-center justify-between px-2 text-xs text-slate-700 shadow-sm cursor-pointer transition-colors">
                    <span className="truncate">Inter</span>
                    <ChevronDown size={12} className="opacity-50 flex-shrink-0" />
                </div>
                <div className="w-12 h-7 bg-white border border-slate-300 hover:border-slate-400 rounded flex items-center justify-center text-xs text-slate-700 shadow-sm cursor-pointer group relative transition-colors">
                    <span>{currentFontSize}</span>
                    <div className="absolute top-full left-0 w-12 bg-white border border-slate-200 shadow-lg hidden group-hover:block z-50 max-h-48 overflow-y-auto rounded-md mt-1">
                        {FONT_SIZES.map(s => (
                            <div 
                                key={s} 
                                onClick={() => onToggleStyle('fontSize', s)}
                                className="px-2 py-1.5 hover:bg-primary-50 cursor-pointer text-center"
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center ml-0.5 bg-slate-200/50 rounded p-0.5 border border-slate-200 h-7">
                    <RibbonButton variant="icon-only" icon={<span className="font-serif text-sm relative top-[1px] text-slate-700">A<span className="align-super text-[8px] absolute top-0 -right-1 text-slate-500">▲</span></span>} onClick={() => onToggleStyle('fontSize', currentFontSize + 1)} title="Increase Font Size" className="w-6 h-6" />
                    <RibbonButton variant="icon-only" icon={<span className="font-serif text-xs relative top-[1px] text-slate-700">A<span className="align-super text-[8px] absolute top-0 -right-1 text-slate-500">▼</span></span>} onClick={() => onToggleStyle('fontSize', Math.max(1, currentFontSize - 1))} title="Decrease Font Size" className="w-6 h-6" />
                </div>
            </div>
            
            <div className="flex items-center gap-0.5">
                <RibbonButton variant="icon-only" icon={<Bold size={14} className="text-slate-800" />} active={currentStyle.bold} onClick={() => onToggleStyle('bold', !currentStyle.bold)} title="Bold" />
                <RibbonButton variant="icon-only" icon={<Italic size={14} className="text-slate-800" />} active={currentStyle.italic} onClick={() => onToggleStyle('italic', !currentStyle.italic)} title="Italic" />
                <RibbonButton variant="icon-only" icon={<Underline size={14} className="text-slate-800" />} active={currentStyle.underline} onClick={() => onToggleStyle('underline', !currentStyle.underline)} title="Underline" />
                <Separator />
                <RibbonButton variant="icon-only" icon={<Grid3X3 size={14} className="opacity-70 text-slate-600" />} onClick={() => {}} hasDropdown title="Borders" />
                <ColorPicker 
                    icon={<PaintBucket size={14} className="text-amber-400" />} 
                    color={currentStyle.bg || 'transparent'} 
                    onChange={(c) => onToggleStyle('bg', c)} 
                    colors={['transparent', '#fee2e2', '#d1fae5', '#dbeafe', '#fef3c7', '#f3f4f6', '#10b981', '#ef4444']}
                    title="Fill Color"
                />
                <ColorPicker 
                    icon={<Type size={14} className="text-red-600" />} 
                    color={currentStyle.color || '#000'} 
                    onChange={(c) => onToggleStyle('color', c)} 
                    colors={['#0f172a', '#dc2626', '#10b981', '#2563eb', '#d97706', '#9333ea', '#ffffff']}
                    title="Font Color"
                />
            </div>
        </div>
    </RibbonGroup>
  );
};

export default FontGroup;