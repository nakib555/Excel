
import React, { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { TabProps } from '../shared';
import { GroupSkeleton } from '../../Skeletons';

const FunctionLibraryGroup = lazy(() => import('./FunctionLibrary/FunctionLibraryGroup'));
const DefinedNamesGroup = lazy(() => import('./DefinedNames/DefinedNamesGroup'));
const FormulaAuditingGroup = lazy(() => import('./FormulaAuditing/FormulaAuditingGroup'));
const CalculationGroup = lazy(() => import('./Calculation/CalculationGroup'));

const FormulasTab: React.FC<TabProps> = () => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-w-max gap-1"
    >
        <Suspense fallback={<GroupSkeleton width={380} />}><FunctionLibraryGroup /></Suspense>
        <Suspense fallback={<GroupSkeleton width={160} />}><DefinedNamesGroup /></Suspense>
        <Suspense fallback={<GroupSkeleton width={240} />}><FormulaAuditingGroup /></Suspense>
        <Suspense fallback={<GroupSkeleton width={140} />}><CalculationGroup /></Suspense>
    </motion.div>
  );
};

export default memo(FormulasTab);
