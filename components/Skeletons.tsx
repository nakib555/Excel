
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';

// Reusable shiny skeleton component
const Skel = memo(({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={cn("skeleton-shine rounded-sm", className)} style={style} />
));

// Fully wrapping cell skeleton for Grid with Blurred Center Shine
export const CellSkeleton = memo(({ width, height, className }: { width: number; height: number; className?: string }) => (
  <div 
    style={{ 
      width, 
      height, 
      minWidth: width, 
      minHeight: height,
      contain: 'strict',
      contentVisibility: 'auto'
    }} 
    className={cn(
      "border-r border-b border-slate-200 box-border overflow-hidden select-none relative flex-shrink-0 bg-white flex items-center justify-center p-1", // Margin/Padding from border
      className
    )}
  >
    {/* Blurred shining ghost element centered in the cell */}
    <div className="w-full h-full bg-slate-200/60 rounded-sm skeleton-shine blur-[2px] opacity-80" />
  </div>
));

export const RowSkeleton = memo(({ 
    height, 
    visibleCols, 
    headerColW, 
    spacerLeft, 
    spacerRight,
    getColW 
}: { 
    height: number; 
    visibleCols: number[]; 
    headerColW: number; 
    spacerLeft: number; 
    spacerRight: number;
    getColW: (i: number) => number;
}) => {
    return (
        <div className="flex" style={{ width: 'max-content', height }}>
             {/* Row Header Ghost */}
            <div 
                className="sticky left-0 z-10 border-r border-b border-slate-300 bg-[#f8f9fa] flex-shrink-0"
                style={{ width: headerColW, height }}
            >
                <Skel className="w-full h-full opacity-50" />
            </div>

            {/* Spacer Left */}
            <div style={{ width: spacerLeft, height: '100%', flexShrink: 0 }} />

            {/* Cell Ghosts */}
            {visibleCols.map(col => (
                <CellSkeleton key={col} width={getColW(col)} height={height} />
            ))}

            {/* Spacer Right */}
            <div style={{ width: spacerRight, height: '100%', flexShrink: 0 }} />
        </div>
    )
});

export const TabItemSkeleton = memo(() => (
    <div className="flex items-center px-4 py-1.5 min-w-[100px] h-full justify-center bg-transparent border-t-2 border-transparent">
        <Skel className="w-16 h-4" />
    </div>
));

// Enhanced GroupSkeleton with Blur for Feature Tools
export const GroupSkeleton = memo(({ width, className }: { width?: number | string; className?: string }) => (
  <div 
    className={cn("flex flex-col h-full border-r border-slate-200/50 last:border-r-0 flex-shrink-0 p-1 bg-white/5", className)}
    style={{ minWidth: width || 80, width }}
  >
    {/* Full box ghost element with blurred shine */}
    <div className="flex-1 w-full p-1.5 flex items-center justify-center relative overflow-hidden">
       <div className="w-full h-full bg-slate-100/80 rounded border border-slate-200/50 skeleton-shine blur-[1px] relative overflow-hidden" />
    </div>
    
    {/* Label Ghost */}
    <div className="h-[14px] w-full flex items-center justify-center mt-0.5 pb-0.5">
         <Skel className="h-2 w-16 rounded-sm opacity-40 blur-[0.5px]" />
    </div>
  </div>
));

export const RibbonSkeleton = memo(() => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full w-full items-center gap-0 overflow-hidden px-1 pointer-events-none select-none"
    >
      <GroupSkeleton width={80} />
      <GroupSkeleton width={120} />
      <GroupSkeleton width={200} />
      <GroupSkeleton width={140} />
      <GroupSkeleton width={100} />
    </motion.div>
  );
});

export const ToolbarSkeleton = memo(() => (
  <div className="flex flex-col w-full bg-[#f8fafc] border-b border-slate-200 shadow-sm z-40 select-none">
    {/* Title Bar */}
    <div className="h-11 bg-[#0f172a] flex items-center justify-between px-4 w-full border-b border-slate-700/50">
       <div className="flex items-center gap-4">
          <Skel className="w-9 h-9 rounded bg-white/10" />
          <Skel className="w-24 h-4 bg-white/10" />
          <div className="flex gap-2 ml-4">
              <Skel className="w-6 h-6 rounded-full bg-white/10" />
              <Skel className="w-6 h-6 rounded-full bg-white/10" />
              <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
              <Skel className="w-16 h-6 rounded-full bg-white/10" />
          </div>
       </div>
       <div className="flex items-center gap-3">
           <Skel className="w-48 h-8 rounded bg-slate-800 hidden md:block" />
           <Skel className="w-8 h-8 rounded-full bg-indigo-600/50" />
       </div>
    </div>
    
    {/* Tabs Bar */}
    <div className="h-[37px] bg-[#0f172a] px-4 flex items-end gap-1 pt-1 overflow-hidden">
        {['Home', 'Insert', 'Draw', 'Page Layout', 'Formulas', 'Data'].map((tab, i) => (
            <div key={i} className={`w-16 h-8 rounded-t-md mb-1 skeleton-shine ${i === 0 ? 'bg-slate-100 opacity-90' : 'bg-white/10'}`} />
        ))}
    </div>

    {/* Ribbon Area */}
    <div className="h-[100px] bg-[#f8fafc] border-b border-slate-200 flex items-center px-4 py-2 gap-2 overflow-hidden">
         <RibbonSkeleton />
    </div>
  </div>
));

export const FormulaBarSkeleton = memo(() => (
  <div className="flex items-center h-12 px-4 border-b border-slate-200 bg-white gap-3 shadow-sm z-30 select-none">
    <Skel className="w-14 h-8 bg-slate-100 border border-slate-200" />
    <div className="w-[1px] h-5 bg-slate-300 hidden md:block" />
    <div className="flex items-center gap-2 text-slate-300">
        <Skel className="w-4 h-4 rounded-sm bg-slate-100" />
        <Skel className="w-4 h-4 rounded-sm bg-slate-100" />
        <Skel className="w-4 h-4 rounded-sm bg-slate-100" />
    </div>
    <Skel className="flex-1 h-8 bg-slate-50 border border-transparent" />
  </div>
));

export const SheetTabsSkeleton = memo(() => (
    <div className="flex items-center h-10 bg-slate-100 border-t border-slate-300 px-2 gap-1 select-none z-40">
        <div className="flex gap-1 mr-2">
             <Skel className="w-5 h-5 rounded-sm" />
             <Skel className="w-5 h-5 rounded-sm" />
        </div>
        <div className="flex items-end gap-1 h-full pt-1">
            <div className="w-24 h-full bg-white border-t-2 border-slate-300 rounded-t-md shadow-sm relative overflow-hidden">
                <div className="absolute top-2 left-3 w-16 h-3 bg-slate-200 rounded skeleton-shine" />
            </div>
            <div className="w-24 h-full bg-slate-200/50 rounded-t-md relative overflow-hidden border-t-2 border-transparent">
                <div className="absolute top-2 left-3 w-16 h-3 bg-slate-300/50 rounded skeleton-shine" />
            </div>
             <div className="w-24 h-full bg-slate-200/50 rounded-t-md relative overflow-hidden border-t-2 border-transparent">
                <div className="absolute top-2 left-3 w-16 h-3 bg-slate-300/50 rounded skeleton-shine" />
            </div>
        </div>
        <Skel className="ml-2 w-6 h-6 rounded-full" />
    </div>
));

export const StatusBarSkeleton = memo(() => (
    <div className="h-9 bg-[#0f172a] border-t border-slate-700 flex items-center justify-between px-4 select-none z-50">
        <div className="flex items-center gap-3">
             <Skel className="w-16 h-3 bg-white/10" />
        </div>
        <div className="flex items-center gap-3">
             <Skel className="w-16 h-3 bg-white/10 hidden md:block" />
             <Skel className="w-24 h-3 bg-white/10" />
        </div>
    </div>
));

export const GridSkeleton = memo(() => (
  <div className="flex-1 overflow-hidden relative w-full h-full bg-white flex flex-col select-none">
      {/* Header Row */}
      <div className="flex h-[28px] border-b border-slate-300 bg-slate-50">
          <div className="w-[46px] h-full border-r border-slate-300 flex-shrink-0 bg-slate-100" />
          <div className="flex-1 flex overflow-hidden">
             {[...Array(20)].map((_, i) => (
                 <div key={i} className="min-w-[100px] h-full border-r border-slate-300 bg-slate-50 flex items-center justify-center p-1">
                    <Skel className="w-12 h-3 bg-slate-200/50" />
                 </div>
             ))}
          </div>
      </div>
      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
          <div className="w-[46px] border-r border-slate-300 bg-slate-50 flex flex-col h-full overflow-hidden">
              {[...Array(40)].map((_, i) => (
                  <div key={i} className="h-[28px] border-b border-slate-300 flex-shrink-0 flex items-center justify-center">
                     <Skel className="w-4 h-3 bg-slate-200/50" />
                  </div>
              ))}
          </div>
          <div className="flex-1 relative bg-white">
              {/* Background Grid Pattern */}
              <div 
                  className="absolute inset-0 opacity-50" 
                  style={{
                      backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                      backgroundSize: '100px 28px'
                  }}
              />
              {/* Full grid ghost effect */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-12">
                   {[...Array(20)].map((_, i) => (
                       <div key={i} className="col-span-1 row-span-1 border-r border-b border-slate-100 skeleton-shine opacity-30"></div>
                   ))}
              </div>
          </div>
      </div>
  </div>
));

export const AppSkeleton = memo(() => (
  <div className="flex flex-col h-[100dvh] bg-slate-50 font-sans text-slate-900 overflow-hidden">
    <ToolbarSkeleton />
    <FormulaBarSkeleton />
    <div className="flex-1 overflow-hidden relative flex flex-col z-0">
       <GridSkeleton />
    </div>
    <SheetTabsSkeleton />
    <StatusBarSkeleton />
  </div>
));
