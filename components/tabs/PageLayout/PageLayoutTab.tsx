
import React, { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { TabProps, RibbonGroup } from '../shared';
import { GroupSkeleton } from '../../Skeletons';

// Granular lazy loading for tool groups
const Themes = lazy(() => import('./Themes/Themes'));
const Colors = lazy(() => import('./Themes/Colors'));
const Fonts = lazy(() => import('./Themes/Fonts'));
const Effects = lazy(() => import('./Themes/Effects'));

const Margins = lazy(() => import('./PageSetup/Margins'));
const Orientation = lazy(() => import('./PageSetup/Orientation'));
const Size = lazy(() => import('./PageSetup/Size'));
const PrintArea = lazy(() => import('./PageSetup/PrintArea'));
const Breaks = lazy(() => import('./PageSetup/Breaks'));
const Background = lazy(() => import('./PageSetup/Background'));
const PrintTitles = lazy(() => import('./PageSetup/PrintTitles'));

const Width = lazy(() => import('./ScaleToFit/Width'));
const Height = lazy(() => import('./ScaleToFit/Height'));
const Scale = lazy(() => import('./ScaleToFit/Scale'));

const GridlinesView = lazy(() => import('./SheetOptions/GridlinesView'));
const GridlinesPrint = lazy(() => import('./SheetOptions/GridlinesPrint'));
const HeadingsView = lazy(() => import('./SheetOptions/HeadingsView'));
const HeadingsPrint = lazy(() => import('./SheetOptions/HeadingsPrint'));

const BringForward = lazy(() => import('./Arrange/BringForward'));
const SendBackward = lazy(() => import('./Arrange/SendBackward'));
const SelectionPane = lazy(() => import('./Arrange/SelectionPane'));
const Align = lazy(() => import('./Arrange/Align'));
const Group = lazy(() => import('./Arrange/Group'));
const Rotate = lazy(() => import('./Arrange/Rotate'));

const PageLayoutTab: React.FC<TabProps> = () => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-w-max gap-1"
    >
        <Suspense fallback={<GroupSkeleton width={140} />}>
            <RibbonGroup label="Themes">
                <div className="flex items-center gap-2 h-full">
                    <Themes />
                    <div className="flex flex-col gap-0 justify-center">
                        <Colors />
                        <Fonts />
                        <Effects />
                    </div>
                </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={220} />}>
            <RibbonGroup label="Page Setup">
                 <div className="flex items-center gap-1 h-full">
                     <Margins />
                     <Orientation />
                     <Size />
                     <PrintArea />
                     <div className="flex flex-col gap-0 justify-center pl-1">
                         <Breaks />
                         <Background />
                         <PrintTitles />
                     </div>
                 </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={120} />}>
            <RibbonGroup label="Scale to Fit">
                <div className="flex flex-col gap-0.5 justify-center h-full px-1">
                    <Width />
                    <Height />
                    <Scale />
                </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={160} />}>
            <RibbonGroup label="Sheet Options">
                <div className="flex gap-4 px-2 h-full items-center">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-slate-700">Gridlines</span>
                        <GridlinesView />
                        <GridlinesPrint />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-slate-700">Headings</span>
                        <HeadingsView />
                        <HeadingsPrint />
                    </div>
                </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={160} />}>
             <RibbonGroup label="Arrange">
                 <div className="flex items-center gap-1 h-full">
                     <div className="flex flex-col gap-0 justify-center">
                         <BringForward />
                         <SendBackward />
                     </div>
                     <SelectionPane />
                     <div className="flex flex-col gap-0 justify-center">
                         <Align />
                         <Group />
                         <Rotate />
                     </div>
                 </div>
            </RibbonGroup>
        </Suspense>
    </motion.div>
  );
};

export default memo(PageLayoutTab);
