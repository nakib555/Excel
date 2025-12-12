import React from 'react';
import { Sigma, ArrowUpDown, Search, Eraser } from 'lucide-react';
import { RibbonGroup, RibbonButton, TabProps } from '../../shared';

const EditingGroup: React.FC<TabProps> = ({ onClear }) => {
  return (
    <RibbonGroup label="Editing" className="border-r-0">
         <div className="flex gap-2 h-full items-center px-1">
             <div className="flex flex-col gap-0 h-full justify-center">
                 <RibbonButton variant="small" icon={<Sigma size={14} className="text-orange-600" />} label="AutoSum" onClick={() => {}} hasDropdown />
                 <RibbonButton variant="small" icon={<ArrowUpDown size={14} className="text-blue-600" />} label="Sort & Filter" onClick={() => {}} hasDropdown />
                 <RibbonButton variant="small" icon={<Search size={14} className="text-indigo-600" />} label="Find & Select" onClick={() => {}} hasDropdown />
             </div>
             <div className="flex flex-col h-full justify-start pt-0.5">
                  <RibbonButton 
                    variant="large" 
                    icon={<Eraser size={20} className="text-rose-500" />} 
                    label="Clear" 
                    onClick={onClear} 
                    hasDropdown 
                    title="Clear All"
                />
             </div>
         </div>
    </RibbonGroup>
  );
};

export default EditingGroup;