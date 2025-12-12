import React from 'react';
import { cn } from '../utils';

// Common shimmer class wrapper
const ShimmerBlock = ({ className = "" }: { className?: string }) => (
  <div className={cn("shimmer rounded", className)} />
);

export const ToolbarSkeleton = () => (
  <div className="flex flex-col bg-[#0f172a] shadow-soft z-40 w-full">
    {/* Top Bar */}
    <div className="flex items-center justify-between px-4 h-11">
      <div className="flex items-center gap-4">
        <ShimmerBlock className="w-8 h-8 bg-white/10 rounded" />
        <ShimmerBlock className="w-20 h-5 bg-white/10 rounded" />
        <div className="flex gap-2 ml-4">
           <ShimmerBlock className="w-8 h-8 rounded-full bg-white/10" />
           <ShimmerBlock className="w-8 h-8 rounded-full bg-white/10" />
           <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
           <ShimmerBlock className="w-20 h-8 rounded bg-white/10" />
        </div>
      </div>
      <div className="flex gap-3">
         <ShimmerBlock className="hidden lg:block w-64 h-8 rounded bg-white/10" />
         <ShimmerBlock className="w-8 h-8 rounded-full bg-indigo-600/50" />
      </div>
    </div>
    
    {/* Tabs Row */}
    <div className="bg-[#0f172a] px-4 flex items-end gap-1 pt-1 border-b border-transparent">
       {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className={`h-8 w-16 rounded-t-md mb-1 ${i === 1 ? 'bg-[#f8fafc]' : 'bg-white/5'}`} />
       ))}
    </div>

    {/* Ribbon Content Area */}
    <div className="h-[100px] bg-[#f8fafc] border-b border-slate-200 w-full flex items-center px-4 gap-2">
        <RibbonTabSkeleton />
    </div>
  </div>
);

export const RibbonTabSkeleton = () => (
    <div className="flex items-center h-full gap-2 w-full overflow-hidden px-2">
        {[1,2,3,4,5].map(i => (
            <div key={i} className="flex flex-col h-full py-2 px-3 border-r border-slate-200 gap-2 items-center min-w-[80px]">
                 <div className="flex gap-1 flex-1 items-center">
                     <ShimmerBlock className="w-8 h-8" />
                     <ShimmerBlock className="w-8 h-8" />
                 </div>
                 <ShimmerBlock className="w-12 h-2.5 mt-auto" />
            </div>
        ))}
    </div>
);

export const FormulaBarSkeleton = () => (
  <div className="flex items-center h-12 px-4 border-b border-slate-200 bg-white gap-3 shadow-sm z-30">
      <ShimmerBlock className="w-14 h-8 border border-slate-200 bg-slate-100" />
      <div className="w-[1px] h-5 bg-slate-200 hidden md:block" />
      <div className="flex gap-1 hidden md:flex">
         <ShimmerBlock className="w-6 h-6 rounded bg-slate-100" />
         <ShimmerBlock className="w-6 h-6 rounded bg-slate-100" />
      </div>
      <ShimmerBlock className="flex-1 h-8 bg-slate-50 border-none" />
  </div>
);

export const GridSkeleton = () => (
    <div className="flex-1 bg-white relative overflow-hidden flex flex-col w-full h-full">
        {/* Header Row */}
        <div className="flex border-b border-slate-300 h-[29px] bg-slate-50">
             <div className="w-[46px] border-r border-slate-300 bg-slate-100 flex-shrink-0" />
             <div className="flex-1 flex overflow-hidden">
                 {Array.from({length: 15}).map((_, i) => (
                     <div key={i} className="w-[100px] border-r border-slate-300 bg-slate-50 flex items-center justify-center flex-shrink-0">
                         <ShimmerBlock className="w-8 h-3 bg-slate-200" />
                     </div>
                 ))}
             </div>
        </div>
        {/* Rows */}
        <div className="flex-1 overflow-hidden relative">
             {Array.from({length: 25}).map((_, r) => (
                 <div key={r} className="flex h-[28px] border-b border-slate-100">
                      <div className="w-[46px] border-r border-slate-300 bg-slate-50 flex-shrink-0 flex items-center justify-center">
                          <ShimmerBlock className="w-3 h-3 bg-slate-200" />
                      </div>
                      <div className="flex-1 flex overflow-hidden">
                         {Array.from({length: 15}).map((_, c) => (
                             <div key={c} className="w-[100px] border-r border-slate-100 flex-shrink-0" />
                         ))}
                      </div>
                 </div>
             ))}
             
             {/* Centered Loader on top of grid lines */}
             <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] z-10">
                  <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-elevation border border-slate-100">
                      <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin" />
                      <span className="text-slate-500 font-medium text-sm">Loading Grid...</span>
                  </div>
             </div>
        </div>
    </div>
);

export const SheetTabsSkeleton = () => (
    <div className="flex items-center h-10 bg-slate-100 border-t border-slate-300 px-2 gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] z-40">
         <div className="flex gap-1 mr-2">
             <ShimmerBlock className="w-5 h-5 bg-slate-300" />
             <ShimmerBlock className="w-5 h-5 bg-slate-300" />
         </div>
         <div className="flex gap-1 items-end h-full">
             <div className="w-24 h-8 rounded-t-md bg-white border-t-2 border-emerald-500 shadow-soft flex items-center justify-center">
                 <ShimmerBlock className="w-16 h-3" />
             </div>
             <div className="w-24 h-7 rounded-t-md bg-transparent border-t-2 border-transparent flex items-center justify-center mb-0.5">
                  <ShimmerBlock className="w-16 h-3 bg-slate-300" />
             </div>
         </div>
         <div className="w-[1px] h-5 bg-slate-300 mx-1"></div>
         <ShimmerBlock className="w-6 h-6 rounded-full bg-slate-300" />
    </div>
);

export const StatusBarSkeleton = () => (
    <div className="h-8 bg-[#f8f9fa] border-t border-slate-300 flex items-center justify-between px-4 z-50">
        <div className="flex gap-4 items-center">
            <ShimmerBlock className="w-16 h-3" />
            <ShimmerBlock className="w-32 h-3 hidden md:block" />
        </div>
        <div className="flex gap-4 items-center">
             <ShimmerBlock className="w-20 h-3 hidden lg:block" />
             <div className="flex gap-2 items-center">
                 <ShimmerBlock className="w-4 h-4 rounded-full" />
                 <ShimmerBlock className="w-24 h-1 rounded" />
                 <ShimmerBlock className="w-4 h-4 rounded-full" />
             </div>
             <ShimmerBlock className="w-8 h-4 rounded" />
        </div>
    </div>
);