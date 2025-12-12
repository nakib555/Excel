import React from 'react';
import { Plus, X, Layout } from 'lucide-react';
import { RibbonGroup, RibbonButton, TabProps } from '../../shared';

const CellsGroup: React.FC<TabProps> = () => {
  return (
    <RibbonGroup label="Cells">
         <div className="flex flex-col gap-0 justify-center">
             <RibbonButton variant="small" icon={<Plus size={14} className="text-emerald-600" />} label="Insert" onClick={() => {}} hasDropdown />
             <RibbonButton variant="small" icon={<X size={14} className="text-rose-600" />} label="Delete" onClick={() => {}} hasDropdown />
             <RibbonButton variant="small" icon={<Layout size={14} className="text-slate-600" />} label="Format" onClick={() => {}} hasDropdown />
         </div>
    </RibbonGroup>
  );
};

export default CellsGroup;