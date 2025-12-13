

import React, { memo, Suspense, lazy } from 'react';
import { getCellId, parseCellId, cn } from '../utils';

// Lazy load Cell to support granular loading during rapid expansion/scrolling
const Cell = lazy(() => import('./Cell'));

interface GridRowProps {
  rowIdx: number;
  visibleCols: number[];
  height: number;
  spacerLeft: number;
  spacerRight: number;
  getColW: (i: number) => number;
  cells: any;
  activeCell: string | null;
  selectionRange: string[] | null;
  scale: number;
  onCellClick: (id: string, isShift: boolean) => void;
  handleMouseDown: (id: string, isShift: boolean) => void;
  handleMouseEnter: (id: string) => void;
  onCellDoubleClick: (id: string) => void;
  onCellChange: (id: string, value: string) => void;
  onNavigate: (direction: any, isShift: boolean) => void;
  startResize: (e: React.MouseEvent, type: 'col' | 'row', index: number, size: number) => void;
  headerColW: number;
  isGhost: boolean;
  bgPatternStyle: any;
}

const GridRow = memo(({ 
    rowIdx, 
    visibleCols, 
    height, 
    spacerLeft, 
    spacerRight, 
    getColW, 
    cells, 
    activeCell, 
    selectionRange, 
    scale, 
    onCellClick, 
    handleMouseDown, 
    handleMouseEnter, 
    onCellDoubleClick, 
    onCellChange, 
    onNavigate, 
    startResize,
    headerColW,
    isGhost,
    bgPatternStyle
}: GridRowProps) => {
    const isActiveRow = activeCell && parseInt(activeCell.replace(/[A-Z]+/, '')) === rowIdx + 1;
    // Calculate dynamic font size based on zoom, capped for readability
    const headerFontSize = Math.max(7, 12 * scale);
    
    return (
        <div className="flex" style={{ width: 'max-content', height }}>
            {/* Row Header */}
            <div 
                className={cn(
                    "sticky left-0 z-10 flex items-center justify-center border-r border-b border-slate-300 bg-[#f8f9fa] font-semibold text-slate-700 select-none flex-shrink-0 hover:bg-slate-200 transition-colors overflow-hidden", 
                    isActiveRow && "bg-emerald-100 text-emerald-800"
                )}
                style={{ width: headerColW, height, fontSize: `${headerFontSize}px` }}
                onClick={() => onCellClick(getCellId(0, rowIdx), false)}
            >
                {rowIdx + 1}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-1 cursor-row-resize hover:bg-emerald-500 z-10"
                    onMouseDown={(e) => startResize(e, 'row', rowIdx, height)} 
                />
            </div>

            {/* Spacer Left with Pattern */}
            <div style={{ width: spacerLeft, height: '100%', flexShrink: 0, ...bgPatternStyle }} />
            
            {/* Cells Loop */}
            {visibleCols.map((col: number) => {
                const id = getCellId(col, rowIdx);
                const data = cells[id] || { id, raw: '', value: '', style: {} };
                const isSelected = activeCell === id;
                const isInRange = selectionRange ? selectionRange.includes(id) : false;
                const width = getColW(col);
                
                return (
                    <Suspense 
                        key={id} 
                        fallback={
                            <div 
                                className="relative box-border border-r border-b border-slate-200 bg-white skeleton-shine"
                                style={{ width, height, minWidth: width, minHeight: height }}
                            />
                        }
                    >
                        <Cell 
                            id={id} 
                            data={data}
                            isSelected={isSelected}
                            isActive={isSelected} 
                            isInRange={isInRange}
                            width={width}
                            height={height}
                            scale={scale}
                            isGhost={isGhost}
                            onMouseDown={handleMouseDown}
                            onMouseEnter={handleMouseEnter}
                            onDoubleClick={onCellDoubleClick}
                            onChange={onCellChange}
                            onNavigate={onNavigate}
                        />
                    </Suspense>
                );
            })}

            {/* Spacer Right with Pattern */}
            <div style={{ width: spacerRight, height: '100%', flexShrink: 0, ...bgPatternStyle }} />
        </div>
    );
}, (prev, next) => {
    // 1. High-level layout checks (Fastest)
    if (prev.scale !== next.scale) return false;
    if (prev.height !== next.height) return false;
    if (prev.isGhost !== next.isGhost) return false;
    if (prev.visibleCols !== next.visibleCols) return false;
    if (prev.headerColW !== next.headerColW) return false;

    // 2. Data Check (Medium)
    // If cells reference changed, data *might* have changed. 
    // In a pure sparse system, we could check if any ID in visibleCols changed in next.cells,
    // but simply accepting re-render on data edit is the safest "Excel" behavior for now.
    // Optimization: Only if activeSheetId didn't change (implied by cells ref).
    if (prev.cells !== next.cells) return false;

    // 3. Selection / Interaction Check (Crucial for scroll/selection perf)
    // We only want to re-render if the selection *affects this row*.
    if (prev.activeCell !== next.activeCell || prev.selectionRange !== next.selectionRange) {
        
        // Helper to check if a row index is involved in a cell ID or range
        const isRowInvolved = (id: string | null) => {
            if (!id) return false;
            const p = parseCellId(id);
            return p ? p.row === prev.rowIdx : false;
        };

        const isRangeInvolved = (range: string[] | null) => {
            if (!range) return false;
            // Optimization: check first and last of range if contiguous, but range is list of IDs here.
            // A simple check: does any ID in the range belong to this row?
            // If range is massive, this is slow. 
            // However, typical selection is rectangular. 
            // For standard Excel, we can parse just the start/end of the range logic if available, 
            // but here we have the expanded list. 
            // Fast Check: if range length > 0, parse first and last (if sorted) or just iterate.
            return range.some(id => parseCellId(id)?.row === prev.rowIdx);
        };

        const prevActiveInRow = isRowInvolved(prev.activeCell);
        const nextActiveInRow = isRowInvolved(next.activeCell);
        
        // If active cell moved IN or OUT of this row, update.
        if (prevActiveInRow !== nextActiveInRow) return false;
        // If active cell moved WITHIN this row, update.
        if (prevActiveInRow && nextActiveInRow && prev.activeCell !== next.activeCell) return false;

        const prevRangeInRow = isRangeInvolved(prev.selectionRange);
        const nextRangeInRow = isRangeInvolved(next.selectionRange);

        // If range inclusion changed for this row
        if (prevRangeInRow !== nextRangeInRow) return false;
        
        // If range is in row, and range changed (e.g. expansion), we update.
        // (This could be optimized to check exact cells, but row-level is good enough)
        if ((prevRangeInRow || nextRangeInRow) && prev.selectionRange !== next.selectionRange) return false;

        // If neither active cell nor range touches this row, DO NOT RENDER.
        return true;
    }

    // Default: props match enough
    return true; 
});

export default GridRow;