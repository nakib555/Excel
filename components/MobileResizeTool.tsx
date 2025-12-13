
import React, { memo } from 'react';
import { Minus, Plus, X, MoveHorizontal, MoveVertical, RotateCcw } from 'lucide-react';
import { cn } from '../utils';

interface MobileResizeToolProps {
  isOpen: boolean;
  onClose: () => void;
  activeCell: string | null;
  onResizeRow: (delta: number) => void;
  onResizeCol: (delta: number) => void;
  onReset: () => void;
}

const MobileResizeTool: React.FC<MobileResizeToolProps> = ({ 
  isOpen, 
  onClose, 
  activeCell, 
  onResizeRow, 
  onResizeCol,
  onReset 
}) => {
  if (!isOpen) return null;

  return (
    // Positioned at bottom-[84px] to sit clearly above the SheetTabs (40px) + StatusBar (36px) stack = 76px
    <div className="fixed bottom-[84px] left-4 right-4 md:hidden z-[1000] animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-xl p-3 flex flex-col gap-3">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
                {/* Green pill indicator matching the screenshot */}
                <div className="w-1 h-4 bg-emerald-500 rounded-full shadow-sm"></div>
                <span className="font-bold text-slate-800 text-xs tracking-tight">Resize {activeCell || 'Cell'}</span>
            </div>
            <button 
                onClick={onClose}
                className="p-1 -mr-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={16} />
            </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-3">
            
            {/* Column Width Control - Height 40px */}
            <div className="flex items-center gap-3 h-10">
                <div className="flex items-center gap-2 w-16 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                    <MoveHorizontal size={12} className="text-slate-400" /> Width
                </div>
                <div className="flex-1 flex items-center justify-between bg-slate-100/80 rounded-lg p-1 border border-slate-100 h-full">
                    <button 
                        onClick={() => onResizeCol(-5)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm border border-slate-200/50 text-slate-600 active:scale-95 transition-all hover:border-slate-300"
                    >
                        <Minus size={14} strokeWidth={2.5} />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Column</span>
                    <button 
                        onClick={() => onResizeCol(5)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm border border-slate-200/50 text-slate-600 active:scale-95 transition-all hover:border-slate-300"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Row Height Control - Height 40px */}
            <div className="flex items-center gap-3 h-10">
                 <div className="flex items-center gap-2 w-16 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                    <MoveVertical size={12} className="text-slate-400" /> Height
                </div>
                <div className="flex-1 flex items-center justify-between bg-slate-100/80 rounded-lg p-1 border border-slate-100 h-full">
                     <button 
                        onClick={() => onResizeRow(-5)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm border border-slate-200/50 text-slate-600 active:scale-95 transition-all hover:border-slate-300"
                    >
                        <Minus size={14} strokeWidth={2.5} />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Row</span>
                    <button 
                        onClick={() => onResizeRow(5)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm border border-slate-200/50 text-slate-600 active:scale-95 transition-all hover:border-slate-300"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

             {/* Reset Button */}
             <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 h-9 w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-all active:scale-[0.98]"
            >
                <RotateCcw size={12} strokeWidth={2.5} /> Reset to Default
            </button>

        </div>
      </div>
    </div>
  );
};

export default memo(MobileResizeTool);
