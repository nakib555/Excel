
import React, { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { TabProps } from '../shared';
import { GroupSkeleton } from '../../Skeletons';

// Granular lazy loading for tool groups
const TablesGroup = lazy(() => import('./Tables/TablesGroup'));
const IllustrationsGroup = lazy(() => import('./Illustrations/IllustrationsGroup'));
const ChartsGroup = lazy(() => import('./Charts/ChartsGroup'));
const SparklinesGroup = lazy(() => import('./Sparklines/SparklinesGroup'));
const FiltersGroup = lazy(() => import('./Filters/FiltersGroup'));
const LinksCommentsGroup = lazy(() => import('./LinksComments/LinksCommentsGroup'));
const TextSymbolsGroup = lazy(() => import('./TextSymbols/TextSymbolsGroup'));

const InsertTab: React.FC<TabProps> = (props) => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-w-max gap-1"
    >
        <Suspense fallback={<GroupSkeleton width={160} />}><TablesGroup {...props} /></Suspense>
        <Suspense fallback={<GroupSkeleton width={120} />}><IllustrationsGroup {...props} /></Suspense>
        <Suspense fallback={<GroupSkeleton width={240} />}><ChartsGroup {...props} /></Suspense>
        <Suspense fallback={<GroupSkeleton width={120} />}><SparklinesGroup {...props} /></Suspense>
        <Suspense fallback={<GroupSkeleton width={100} />}><FiltersGroup {...props} /></Suspense>
        <Suspense fallback={<GroupSkeleton width={100} />}><LinksCommentsGroup {...props} /></Suspense>
        <Suspense fallback={<GroupSkeleton width={100} />}><TextSymbolsGroup {...props} /></Suspense>
    </motion.div>
  );
};

export default memo(InsertTab);
