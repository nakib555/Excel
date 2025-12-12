import React from 'react';
import { motion } from 'framer-motion';

const GroupSkeleton = () => (
  <div className="flex flex-col h-full px-3 border-r border-slate-200/60 last:border-r-0 flex-shrink-0">
    <div className="flex-1 flex gap-2 items-center justify-center py-1">
       {/* Mock Large Button */}
       <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
          <div className="w-9 h-9 bg-slate-200 rounded-md" />
          <div className="w-12 h-2.5 bg-slate-200 rounded-sm" />
       </div>
       
       {/* Mock Column of small buttons */}
       <div className="flex flex-col gap-1.5 h-full justify-center min-w-[80px]">
          <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-slate-200 rounded-sm" />
             <div className="w-16 h-2.5 bg-slate-200 rounded-sm" />
          </div>
          <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-slate-200 rounded-sm" />
             <div className="w-14 h-2.5 bg-slate-200 rounded-sm" />
          </div>
          <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-slate-200 rounded-sm" />
             <div className="w-10 h-2.5 bg-slate-200 rounded-sm" />
          </div>
       </div>

        {/* Mock Large Button 2 */}
       <div className="flex flex-col items-center gap-1.5 min-w-[50px] ml-1">
          <div className="w-9 h-9 bg-slate-200 rounded-md" />
          <div className="w-10 h-2.5 bg-slate-200 rounded-sm" />
       </div>
    </div>
    
    {/* Group Label */}
    <div className="h-[18px] flex items-center justify-center pb-1 mt-auto">
         <div className="w-14 h-2 bg-slate-200 rounded-sm" />
    </div>
  </div>
);

const RibbonSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full w-full items-center gap-0 animate-pulse overflow-hidden px-1 pointer-events-none select-none"
    >
      <GroupSkeleton />
      <GroupSkeleton />
      <GroupSkeleton />
      <GroupSkeleton />
      <GroupSkeleton />
    </motion.div>
  );
};

export default RibbonSkeleton;