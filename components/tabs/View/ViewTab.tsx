
import React, { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { RibbonGroup, TabProps } from '../shared';
import { GroupSkeleton } from '../../Skeletons';

// Granular lazy loading
const DefaultViewSelector = lazy(() => import('./SheetView/DefaultViewSelector'));
const SaveView = lazy(() => import('./SheetView/SaveView'));
const HideView = lazy(() => import('./SheetView/HideView'));

const NormalView = lazy(() => import('./WorkbookViews/NormalView'));
const PageBreakPreview = lazy(() => import('./WorkbookViews/PageBreakPreview'));
const PageLayout = lazy(() => import('./WorkbookViews/PageLayout'));
const CustomViews = lazy(() => import('./WorkbookViews/CustomViews'));

const NavigationPane = lazy(() => import('./Show/NavigationPane'));
const Ruler = lazy(() => import('./Show/Ruler'));
const Gridlines = lazy(() => import('./Show/Gridlines'));
const FormulaBar = lazy(() => import('./Show/FormulaBar'));
const Headings = lazy(() => import('./Show/Headings'));
const DataTypeIcons = lazy(() => import('./Show/DataTypeIcons'));
const FocusCell = lazy(() => import('./Show/FocusCell'));

const Zoom = lazy(() => import('./Zoom/Zoom'));
const Zoom100 = lazy(() => import('./Zoom/Zoom100'));
const ZoomToSelection = lazy(() => import('./Zoom/ZoomToSelection'));

const NewWindow = lazy(() => import('./Window/NewWindow'));
const ArrangeAll = lazy(() => import('./Window/ArrangeAll'));
const FreezePanes = lazy(() => import('./Window/FreezePanes'));
const Split = lazy(() => import('./Window/Split'));
const Hide = lazy(() => import('./Window/Hide'));
const Unhide = lazy(() => import('./Window/Unhide'));
const SwitchWindows = lazy(() => import('./Window/SwitchWindows'));

const ViewTab: React.FC<TabProps> = () => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full min-w-max gap-1"
    >
        <Suspense fallback={<GroupSkeleton width={120} />}>
             <RibbonGroup label="Sheet View">
                 <div className="flex items-center gap-1 h-full">
                     <div className="flex flex-col gap-0 justify-center">
                         <DefaultViewSelector />
                         <div className="flex gap-1 mt-1">
                              <SaveView />
                              <HideView />
                         </div>
                     </div>
                 </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={200} />}>
            <RibbonGroup label="Workbook Views">
                <div className="flex items-center gap-1 h-full">
                     <NormalView />
                     <PageBreakPreview />
                     <PageLayout />
                     <CustomViews />
                </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={180} />}>
            <RibbonGroup label="Show">
                 <div className="flex gap-4 px-2 h-full items-center">
                    <NavigationPane />
                    <div className="flex flex-col gap-1">
                        <Ruler />
                        <Gridlines />
                        <FormulaBar />
                    </div>
                     <div className="flex flex-col gap-1">
                        <Headings />
                        <DataTypeIcons />
                        <FocusCell />
                    </div>
                </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={140} />}>
            <RibbonGroup label="Zoom">
                 <div className="flex items-center gap-1 h-full">
                     <Zoom />
                     <Zoom100 />
                     <ZoomToSelection />
                 </div>
            </RibbonGroup>
        </Suspense>

        <Suspense fallback={<GroupSkeleton width={220} />}>
            <RibbonGroup label="Window">
                 <div className="flex items-center gap-1 h-full">
                     <NewWindow />
                     <ArrangeAll />
                     <FreezePanes />
                      <div className="flex flex-col gap-0 justify-center">
                         <div className="flex gap-0.5">
                            <Split />
                            <Hide />
                            <Unhide />
                         </div>
                          <div className="flex gap-0.5">
                            <SwitchWindows />
                         </div>
                     </div>
                 </div>
            </RibbonGroup>
        </Suspense>
    </motion.div>
  );
};

export default memo(ViewTab);
