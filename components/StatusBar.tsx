import React, { memo } from 'react';
import {
  CheckCircle2,
  Grid3X3,
  FileSpreadsheet,
  Layout,
  Minus,
  Plus,
  Monitor
} from 'lucide-react';

interface StatusBarProps {
  selectionCount: number;
  stats: { sum: number; count: number; average: number; hasNumeric: boolean } | null;
  zoom: number;
  onZoomChange: (value: number) => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ selectionCount, stats, zoom, onZoomChange }) => {
  const displayZoom = Math.round(zoom * 100);

  const handleZoomIn = () => onZoomChange(Math.min(2, zoom + 0.1));
  const handleZoomOut = () => onZoomChange(Math.max(0.5, zoom - 0.1));

  return (
    <div className="h-9 bg-[#0f172a] text-white/90 border-t border-slate-700/50 flex items-center justify-between px-2 md:px-4 text-[11px] select-none z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
      {/* Left Section - Status */}
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
        <div className="font-semibold text-emerald-400 flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Ready
        </div>
        
        <div className="hidden lg:flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors text-slate-300" title="Accessibility Check">
          <CheckCircle2 size={13} className="text-slate-400" />
          <span className="font-medium">Accessibility: Good to go</span>
        </div>
      </div>

      {/* Center/Right Section - Stats & Tools */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        
        {/* Contextual Stats (Sum, Avg, Count) - Responsive */}
        {stats && (
           <div className="flex items-center gap-3 md:gap-6 animate-in fade-in duration-300 mr-2 md:mr-4">
              {/* Mobile: Just Count or Sum */}
              <div className="flex md:hidden items-center gap-1 text-slate-300">
                  <span className="text-slate-400">Count:</span>
                  <span className="font-mono font-medium">{stats.count}</span>
              </div>

              {/* Desktop: Full Stats */}
              <div className="hidden md:flex items-center gap-4 text-slate-300">
                  {stats.hasNumeric && (
                      <>
                        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
                            <span className="text-slate-400">Average:</span>
                            <span className="font-mono font-medium tracking-tight">{stats.average.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                      </>
                  )}
                  <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
                      <span className="text-slate-400">Count:</span>
                      <span className="font-mono font-medium tracking-tight">{stats.count}</span>
                  </div>
                  {stats.hasNumeric && (
                      <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
                          <span className="text-slate-400">Sum:</span>
                          <span className="font-mono font-medium tracking-tight">{stats.sum.toLocaleString()}</span>
                      </div>
                  )}
              </div>
           </div>
        )}

        {/* View Controls - Desktop Only */}
        <div className="hidden lg:flex items-center gap-1 mr-2 border-l border-white/10 pl-4">
            <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-white bg-white/10" title="Normal View">
              <Grid3X3 size={14} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white" title="Page Layout">
              <Layout size={14} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white" title="Page Break Preview">
              <FileSpreadsheet size={14} />
            </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2">
                <button
                    onClick={handleZoomOut}
                    className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors active:scale-95"
                    title="Zoom Out"
                >
                    <Minus size={12} />
                </button>

                {/* Slider */}
                <div className="w-20 lg:w-28 flex items-center group relative">
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-2 bg-slate-600 pointer-events-none z-0" />
                   <input
                      type="range"
                      min="50"
                      max="200"
                      value={displayZoom}
                      onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-all z-10"
                   />
                </div>

                <button
                    onClick={handleZoomIn}
                    className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors active:scale-95"
                    title="Zoom In"
                >
                    <Plus size={12} />
                </button>
            </div>

            <button 
                onClick={() => onZoomChange(1)}
                className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors min-w-[3rem] text-center font-medium text-slate-200 tabular-nums text-[10px] md:text-[11px] border border-transparent hover:border-white/10"
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