import React from 'react';
import { Clipboard, Scissors, Copy, Paintbrush } from 'lucide-react';
import { RibbonGroup, RibbonButton, TabProps } from '../../shared';

const ClipboardGroup: React.FC<TabProps> = () => {
  return (
    <RibbonGroup label="Clipboard">
        <RibbonButton 
            variant="large" 
            icon={<Clipboard size={20} className="stroke-[1.75] text-blue-600" />} 
            label="Paste" 
            onClick={() => {}}
            title="Paste (Ctrl+V)"
            hasDropdown
        />
        <div className="flex flex-col gap-0 justify-center">
             <RibbonButton variant="small" icon={<Scissors size={14} className="text-slate-500" />} label="Cut" onClick={() => {}} />
             <RibbonButton variant="small" icon={<Copy size={14} className="text-slate-500" />} label="Copy" onClick={() => {}} />
             <RibbonButton variant="small" icon={<Paintbrush size={14} className="text-orange-500" />} label="Format" onClick={() => {}} />
        </div>
    </RibbonGroup>
  );
};

export default ClipboardGroup;