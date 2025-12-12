import React, { memo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { TabProps, GroupSkeleton } from '.././shared';

// Lazy load each group independently to satisfy granular loading requirement
const ClipboardGroup = React.lazy(() => import('./groups/ClipboardGroup'));
const FontGroup = React.lazy(() => import('./groups/FontGroup'));
const AlignmentGroup = React.lazy(() => import('./groups/AlignmentGroup'));
const NumberGroup = React.lazy(() => import('./groups/NumberGroup'));
const StylesGroup = React.lazy(() => import('./groups/StylesGroup'));
const CellsGroup = React.lazy(() => import('./groups/CellsGroup'));
const EditingGroup = React.lazy(() => import('./groups/EditingGroup'));

const HomeTab: React.FC<TabProps> = (props) => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-w-max gap-1"
    >
        <Suspense fallback={<GroupSkeleton />}>
            <ClipboardGroup {...props} />
        </Suspense>

        <Suspense fallback={<GroupSkeleton />}>
            <FontGroup {...props} />
        </Suspense>

        <Suspense fallback={<GroupSkeleton />}>
            <AlignmentGroup {...props} />
        </Suspense>

        <Suspense fallback={<GroupSkeleton />}>
            <NumberGroup {...props} />
        </Suspense>

        <Suspense fallback={<GroupSkeleton />}>
            <StylesGroup {...props} />
        </Suspense>

        <Suspense fallback={<GroupSkeleton />}>
            <CellsGroup {...props} />
        </Suspense>

        <Suspense fallback={<GroupSkeleton />}>
            <EditingGroup {...props} />
        </Suspense>
    </motion.div>
  );
};

export default memo(HomeTab);