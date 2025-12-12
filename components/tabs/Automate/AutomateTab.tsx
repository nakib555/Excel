
import React, { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { RibbonGroup, TabProps } from '../shared';
import { GroupSkeleton } from '../../Skeletons';

const NewScript = lazy(() => import('./OfficeScripts/NewScript'));
const ViewScripts = lazy(() => import('./OfficeScripts/ViewScripts'));
const ScriptsGallery = lazy(() => import('./OfficeScripts/ScriptsGallery'));
const FlowTemplates = lazy(() => import('./PowerAutomate/FlowTemplates'));

const AutomateTab: React.FC<TabProps> = () => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-w-max gap-1"
    >
        <Suspense fallback={<GroupSkeleton width={140} />}>
            <RibbonGroup label="Office Scripts">
                 <div className="flex items-center gap-1 h-full">
                     <NewScript />
                     <ViewScripts />
                 </div>
            </RibbonGroup>
        </Suspense>
        
        <Suspense fallback={<GroupSkeleton width={200} />}>
            <RibbonGroup label="Office Scripts Gallery">
                <ScriptsGallery />
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={100} />}>
            <RibbonGroup label="Power Automate">
                 <div className="flex items-center gap-1 h-full">
                     <FlowTemplates />
                 </div>
            </RibbonGroup>
        </Suspense>
    </motion.div>
  );
};

export default memo(AutomateTab);
