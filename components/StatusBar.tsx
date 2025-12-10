import React, { memo } from 'react';
import {
  CheckCircle2,
  Grid3X3,
  FileSpreadsheet,
  Layout,
  Minus,
  Plus
} from 'lucide-react';

interface StatusBarProps {
  selectionCount: number;
  zoom: number;
  onZoomChange: (value: number) => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ selectionCount, zoom, onZoomChange }) => {
  const displayZoom = Math.round(zoom * 100);

  const handleZoomIn = () => onZoomChange(Math.min(2, zoom + 0.1));
  const handleZoomOut = () => onZoomChange(Math.max(0.5, zoom - 0.1));

  return (
    <div className="h-8 bg-[#f8f9fa] border-t border-slate-300 flex items-center justify-between px-2 md:px-4 text-[11px] text-slate-600 select-none z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      {/* Left Section */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="font-medium text-slate-700 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Ready
        </div>
        
        <div className="hidden md:flex items-center gap-1.5 hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors text-slate-600" title="Accessibility Check">
          <CheckCircle2 size={13} className="text-slate-500" />
          <span className="font-medium">Accessibility: Good to go</span>
        </div>

        {selectionCount > 1 && (
           <div className="hidden sm:flex items-center gap-2 text-slate-500 border-l border-slate-300 pl-4 ml-2 animate-in fade-in duration-300">
              <span className="font-semibold text-slate-700">{selectionCount}</span> cells selected
           </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* View Controls - Desktop Only */}
        <div className="hidden lg:flex items-center gap-0.5">
            <button className="p-1.5 hover:bg-slate-200 rounded active:bg-slate-300 transition-colors text-slate-600 bg-slate-200/50" title="Normal View">
              <Grid3X3 size={14} />
            </button>
            <button className="p-1.5 hover:bg-slate-200 rounded active:bg-slate-300 transition-colors text-slate-400" title="Page Layout">
              <Layout size={14} />
            </button>
            <button className="p-1.5 hover:bg-slate-200 rounded active:bg-slate-300 transition-colors text-slate-400" title="Page Break Preview">
              <FileSpreadsheet size={14} />
            </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
                <button
                    onClick={handleZoomOut}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors active:scale-95"
                    title="Zoom Out"
                >
                    <Minus size={12} />
                </button>

                {/* Slider */}
                <div className="w-24 lg:w-32 flex items-center group relative">
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-2 bg-slate-400/50 pointer-events-none z-0" />
                   <input
                      type="range"
                      min="50"
                      max="200"
                      value={displayZoom}
                      onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
                      className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-600 hover:accent-emerald-600 transition-all z-10"
                   />
                </div>

                <button
                    onClick={handleZoomIn}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors active:scale-95"
                    title="Zoom In"
                >
                    <Plus size={12} />
                </button>
            </div>

            <button 
                onClick={() => onZoomChange(1)}
                className="hover:bg-slate-200 px-2 py-0.5 rounded transition-colors min-w-[3.5rem] text-center font-medium text-slate-700 tabular-nums text-[10px] md:text-[11px] border border-transparent hover:border-slate-300"
                title="Reset Zoom to 100%"
            >
                {displayZoom}%
            </button>
        </div>
      </div>
    </div>
  );
};

export default memo(StatusBar);