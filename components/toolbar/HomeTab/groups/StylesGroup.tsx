import React from 'react';
import { LayoutList, Table, Palette } from 'lucide-react';
import { RibbonGroup, RibbonButton, TabProps } from '../../shared';

const StylesGroup: React.FC<TabProps> = () => {
  return (
    <RibbonGroup label="Styles">
        <div className="flex gap-1 h-full items-center">
            <RibbonButton variant="large" icon={<LayoutList size={20} className="text-pink-500" />} label="Conditional" subLabel="Formatting" onClick={() => {}} hasDropdown />
            <RibbonButton variant="large" icon={<Table size={20} className="text-amber-500" />} label="Format as" subLabel="Table" onClick={() => {}} hasDropdown />
            <RibbonButton variant="large" icon={<Palette size={20} className="text-purple-500" />} label="Cell" subLabel="Styles" onClick={() => {}} hasDropdown />
        </div>
    </RibbonGroup>
  );
};

export default StylesGroup;