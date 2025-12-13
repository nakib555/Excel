import React, { useState, useCallback, useMemo, lazy, Suspense, useRef, useEffect } from 'react';
import { CellId, CellData, CellStyle, GridSize, Sheet } from './types';
import { evaluateFormula, getRange, getNextCellId, parseCellId, getCellId, extractDependencies } from './utils';
import { NavigationDirection } from './components';

// Import Skeletons
import { 
  ToolbarSkeleton, 
  FormulaBarSkeleton, 
  GridSkeleton, 
  SheetTabsSkeleton, 
  StatusBarSkeleton 
} from './components/Skeletons';

// Lazy Imports for Main Components
const Toolbar = lazy(() => import('./components/Toolbar'));
const FormulaBar = lazy(() => import('./components/FormulaBar'));
const Grid = lazy(() => import('./components/Grid'));
const SheetTabs = lazy(() => import('./components/SheetTabs'));
const StatusBar = lazy(() => import('./components/StatusBar'));

// Configuration
// "Use a buffer strategy: ~50 rows, 30 cols visible"
const INITIAL_ROWS = 50; 
const INITIAL_COLS = 30; 
const MAX_ROWS = 1048576; 
const MAX_COLS = 16384;   
const EXPANSION_BATCH_ROWS = 50; 
const EXPANSION_BATCH_COLS = 30;

// Cell Generation: "Sparse Data" Strategy
// We do NOT generate objects for empty cells. 
// "Empty cells are conceptual, not real."
const generateInitialData = (): { cells: Record<CellId, CellData>, dependentsMap: Record<CellId, CellId[]> } => {
    const initData: Record<CellId, CellData> = {};
    const dependentsMap: Record<CellId, CellId[]> = {};
    
    // Only defining the used range. Everything else is implicit.
    const sample = [
      { id: "A1", val: "Item", style: { bold: true, bg: '#f1f5f9', color: '#475569' } },
      { id: "B1", val: "Cost", style: { bold: true, bg: '#f1f5f9', color: '#475569', format: 'currency' as const } },
      { id: "C1", val: "Qty", style: { bold: true, bg: '#f1f5f9', color: '#475569' } },
      { id: "D1", val: "Total", style: { bold: true, bg: '#f1f5f9', color: '#475569', format: 'currency' as const } },
      { id: "A2", val: "MacBook Pro" }, { id: "B2", val: "2400", style: { format: 'currency' as const } }, { id: "C2", val: "2" }, { id: "D2", val: "=B2*C2", style: { format: 'currency' as const } },
      { id: "A3", val: "Monitor" }, { id: "B3", val: "500", style: { format: 'currency' as const } }, { id: "C3", val: "4" }, { id: "D3", val: "=B3*C3", style: { format: 'currency' as const } },
      { id: "A4", val: "Keyboard" }, { id: "B4", val: "150", style: { format: 'currency' as const } }, { id: "C4", val: "5" }, { id: "D4", val: "=B4*C4", style: { format: 'currency' as const } },
      { id: "C5", val: "Grand Total", style: { bold: true, align: 'right' as const } }, 
      { id: "D5", val: "=SUM(D2:D4)", style: { bold: true, color: '#059669', bg: '#ecfdf5', format: 'currency' as const } },
    ];

    sample.forEach(s => {
      initData[s.id] = {
        id: s.id,
        raw: s.val,
        value: s.val, // Will be re-evaluated
        style: (s.style as CellStyle) || {}
      };
    });
    
    // Initial evaluation & Dependency Building
    const evaluated = { ...initData };
    
    Object.keys(evaluated).forEach(key => {
        const cell = evaluated[key];
        if (cell.raw.startsWith('=')) {
            cell.value = evaluateFormula(cell.raw, evaluated);
            const deps = extractDependencies(cell.raw);
            deps.forEach(dep => {
                if (!dependentsMap[dep]) dependentsMap[dep] = [];
                if (!dependentsMap[dep].includes(key)) dependentsMap[dep].push(key);
            });
        }
    });
    
    return { cells: evaluated, dependentsMap };
};

const App: React.FC = () => {
  const [sheets, setSheets] = useState<Sheet[]>(() => {
    const { cells, dependentsMap } = generateInitialData();
    return [{
      id: 'sheet1',
      name: 'Budget 2024',
      cells,
      dependentsMap,
      activeCell: "A1",
      selectionRange: ["A1"],
      columnWidths: {},
      rowHeights: {}
    }];
  });
  
  const [activeSheetId, setActiveSheetId] = useState<string>('sheet1');
  const [gridSize, setGridSize] = useState<GridSize>({ rows: INITIAL_ROWS, cols: INITIAL_COLS });
  const [zoom, setZoom] = useState<number>(1);
  const clipboardRef = useRef<{ cells: Record<CellId, CellData>; baseRow: number; baseCol: number } | null>(null);
  
  const activeSheet = useMemo(() => 
    sheets.find(s => s.id === activeSheetId) || sheets[0], 
  [sheets, activeSheetId]);

  const cells = activeSheet.cells;
  const activeCell = activeSheet.activeCell;
  const selectionRange = activeSheet.selectionRange;
  const columnWidths = activeSheet.columnWidths;
  const rowHeights = activeSheet.rowHeights;

  const activeStyle: CellStyle = useMemo(() => {
    if (!activeCell || !cells[activeCell]) return {};
    return cells[activeCell].style;
  }, [activeCell, cells]);

  const selectionStats = useMemo(() => {
    if (!selectionRange || selectionRange.length <= 1) return null;
    
    let sum = 0;
    let count = 0;
    let numericCount = 0;
    
    selectionRange.forEach(id => {
        const cell = cells[id];
        if (cell && cell.value) {
            count++;
            const cleanValue = cell.value.replace(/[^0-9.-]+/g,"");
            const num = parseFloat(cleanValue);
            if (!isNaN(num) && cell.value.trim() !== '') {
                sum += num;
                numericCount++;
            }
        }
    });

    return {
        sum,
        count,
        average: numericCount > 0 ? sum / numericCount : 0,
        hasNumeric: numericCount > 0
    };
  }, [selectionRange, cells]);

  // Lazy / Sparse Cell Update Logic
  const handleCellChange = useCallback((id: CellId, rawValue: string) => {
    setSheets(prevSheets => prevSheets.map(sheet => {
      if (sheet.id !== activeSheetId) return sheet;

      const nextCells = { ...sheet.cells };
      const nextDependents = { ...sheet.dependentsMap };

      // 1. Get old cell data to clean up old dependencies
      const oldCell = nextCells[id];
      const oldRaw = oldCell?.raw || '';
      
      if (oldRaw.startsWith('=')) {
          const oldDeps = extractDependencies(oldRaw);
          oldDeps.forEach(depId => {
              if (nextDependents[depId]) {
                  nextDependents[depId] = nextDependents[depId].filter(d => d !== id);
                  if (nextDependents[depId].length === 0) delete nextDependents[depId];
              }
          });
      }

      // 2. Sparse Update: Remove if empty, Add if data
      if (!rawValue && (!nextCells[id]?.style || Object.keys(nextCells[id].style).length === 0)) {
         delete nextCells[id];
      } else {
         nextCells[id] = {
           ...nextCells[id] || { id, style: {} },
           raw: rawValue,
           value: rawValue 
         };
      }

      // 3. Register new dependencies
      if (rawValue.startsWith('=')) {
          const newDeps = extractDependencies(rawValue);
          newDeps.forEach(depId => {
              if (!nextDependents[depId]) nextDependents[depId] = [];
              if (!nextDependents[depId].includes(id)) nextDependents[depId].push(id);
          });
      }

      // 4. Lazy Recalculation (Dependency Graph traversal)
      const updateQueue = [id];
      const visited = new Set<string>(); 

      let head = 0;
      while (head < updateQueue.length) {
          const currentId = updateQueue[head++];
          
          if (visited.has(currentId) && currentId !== id) continue; 
          visited.add(currentId);
          
          const cell = nextCells[currentId];
          if (!cell) continue;

          if (cell.raw.startsWith('=')) {
              cell.value = evaluateFormula(cell.raw, nextCells);
          } 

          const dependents = nextDependents[currentId];
          if (dependents) {
              dependents.forEach(dep => {
                 updateQueue.push(dep);
              });
          }
      }

      return { ...sheet, cells: nextCells, dependentsMap: nextDependents };
    }));
  }, [activeSheetId]);

  const handleCellClick = useCallback((id: CellId, isShift: boolean) => {
    setSheets(prevSheets => prevSheets.map(sheet => {
      if (sheet.id !== activeSheetId) return sheet;

      let newSelection = [id];
      if (isShift && sheet.activeCell) {
        newSelection = getRange(sheet.activeCell, id);
        return { ...sheet, selectionRange: newSelection };
      } else {
        return { ...sheet, activeCell: id, selectionRange: newSelection };
      }
    }));
  }, [activeSheetId]);

  const handleSelectionDrag = useCallback((startId: string, endId: string) => {
    setSheets(prevSheets => prevSheets.map(sheet => {
        if (sheet.id !== activeSheetId) return sheet;
        return {
            ...sheet,
            selectionRange: getRange(startId, endId)
        };
    }));
  }, [activeSheetId]);

  const handleCellDoubleClick = useCallback((id: CellId) => {
    handleCellClick(id, false);
  }, [handleCellClick]);

  const handleStyleChange = useCallback((key: keyof CellStyle, value: any) => {
    setSheets(prevSheets => prevSheets.map(sheet => {
      if (sheet.id !== activeSheetId || !sheet.selectionRange) return sheet;

      const nextCells = { ...sheet.cells };
      sheet.selectionRange.forEach(id => {
        const cell = nextCells[id] || { id, raw: '', value: '', style: {} };
        nextCells[id] = {
          ...cell,
          style: { ...cell.style, [key]: value }
        };
      });

      return { ...sheet, cells: nextCells };
    }));
  }, [activeSheetId]);

  const handleNavigate = useCallback((direction: NavigationDirection, isShift: boolean) => {
    if (!activeCell) return;
    let dRow = 0;
    let dCol = 0;
    switch (direction) {
        case 'up': dRow = -1; break;
        case 'down': dRow = 1; break;
        case 'left': dCol = -1; break;
        case 'right': dCol = 1; break;
        default: return;
    }
    const nextId = getNextCellId(activeCell, dRow, dCol, gridSize.rows, gridSize.cols);
    if (nextId && nextId !== activeCell) {
        handleCellClick(nextId, isShift);
    }
  }, [activeCell, gridSize, handleCellClick]);

  const handleColumnResize = useCallback((colId: string, width: number) => {
    setSheets(prev => prev.map(s => {
      if (s.id !== activeSheetId) return s;
      return { 
        ...s, 
        columnWidths: { ...s.columnWidths, [colId]: width } 
      };
    }));
  }, [activeSheetId]);

  const handleRowResize = useCallback((rowIdx: number, height: number) => {
    setSheets(prev => prev.map(s => {
      if (s.id !== activeSheetId) return s;
      return { 
        ...s, 
        rowHeights: { ...s.rowHeights, [rowIdx]: height } 
      };
    }));
  }, [activeSheetId]);

  // "Load Logic": Infinite Expansion
  // We only expand the grid structure when requested (scrolling near edge)
  const handleExpandGrid = useCallback((direction: 'row' | 'col') => {
    setGridSize(prev => {
        if (direction === 'row') {
            if (prev.rows >= MAX_ROWS) return prev;
            return { ...prev, rows: Math.min(prev.rows + EXPANSION_BATCH_ROWS, MAX_ROWS) };
        } else {
            if (prev.cols >= MAX_COLS) return prev;
            return { ...prev, cols: Math.min(prev.cols + EXPANSION_BATCH_COLS, MAX_COLS) };
        }
    });
  }, []);

  // "Trim Logic": Garbage Collect Empty Space
  // Detects the "UsedRange" and shrinks the scrollable area to fit data + buffer
  // This mimics Excel actively releasing off-screen/unused objects.
  const handleTrimGrid = useCallback(() => {
    let maxRow = 0;
    let maxCol = 0;
    
    // Find UsedRange (O(N) on sparse cells)
    const ids = Object.keys(cells);
    if (ids.length > 0) {
        for (const id of ids) {
             const { row, col } = parseCellId(id) || { row: 0, col: 0 };
             if (row > maxRow) maxRow = row;
             if (col > maxCol) maxCol = col;
        }
    }
    
    if (activeCell) {
         const { row, col } = parseCellId(activeCell) || { row: 0, col: 0 };
         if (row > maxRow) maxRow = row;
         if (col > maxCol) maxCol = col;
    }

    // "Empty cells do not exist". We only keep a small buffer active.
    const BUFFER = 20; 
    const newRows = Math.max(INITIAL_ROWS, maxRow + 1 + BUFFER);
    const newCols = Math.max(INITIAL_COLS, maxCol + 1 + BUFFER);

    setGridSize(prev => {
        if (Math.abs(prev.rows - newRows) > 5 || Math.abs(prev.cols - newCols) > 5) {
             return { rows: newRows, cols: newCols };
        }
        return prev;
    });
  }, [cells, activeCell]);

  const handleExport = useCallback(() => {
    const rows = [];
    for(let r=0; r<Math.min(gridSize.rows, 50); r++) { 
        const row = [];
        for(let c=0; c<gridSize.cols; c++) {
            let s = '';
            let num = c;
            while (num > -1) {
                const t = (num) % 26;
                s = String.fromCharCode(t + 65) + s;
                num = (num - t) / 26 - 1;
            }
            const id = `${s}${r+1}`;
            row.push(cells[id]?.value || '');
        }
        rows.push(row.join(','));
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSheet.name}.csv`;
    a.click();
  }, [cells, gridSize, activeSheet.name]);

  const handleClear = useCallback(() => {
    if (confirm(`Are you sure you want to clear the entire "${activeSheet.name}"?`)) {
        setSheets(prev => prev.map(s => {
          if (s.id !== activeSheetId) return s;
          return { ...s, cells: {}, dependentsMap: {}, activeCell: 'A1', selectionRange: ['A1'], columnWidths: {}, rowHeights: {} };
        }));
    }
  }, [activeSheet.name, activeSheetId]);

  const handleAddSheet = useCallback(() => {
    const newId = `sheet${Date.now()}`;
    const num = sheets.length + 1;
    const newSheet: Sheet = {
      id: newId,
      name: `Sheet ${num}`,
      cells: {},
      dependentsMap: {},
      activeCell: 'A1',
      selectionRange: ['A1'],
      columnWidths: {},
      rowHeights: {}
    };
    setSheets(prev => [...prev, newSheet]);
    setActiveSheetId(newId);
  }, [sheets.length]);

  const handleResetLayout = useCallback(() => {
    console.log("Reset Layout");
  }, []);

  const handleFormulaSubmit = useCallback(() => {
    console.log("Formula Submitted");
  }, []);

  const handleFormulaChange = useCallback((val: string) => {
    if (activeCell) handleCellChange(activeCell, val);
  }, [activeCell, handleCellChange]);

  const handleZoomWheel = useCallback((delta: number) => {
    setZoom(prev => {
        const next = prev + delta;
        return Math.min(4, Math.max(0.1, Number(next.toFixed(2))));
    });
  }, []);

  const handleSetZoom = useCallback((val: number) => {
      setZoom(val);
  }, []);

  const handleCopy = useCallback(() => {
    if (!selectionRange) return;
    const copiedCells: Record<CellId, CellData> = {};
    const coords = selectionRange.map(id => parseCellId(id)!);
    const minRow = Math.min(...coords.map(c => c.row));
    const minCol = Math.min(...coords.map(c => c.col));

    selectionRange.forEach(id => {
       if (cells[id]) {
           copiedCells[id] = JSON.parse(JSON.stringify(cells[id]));
       }
    });

    clipboardRef.current = {
        cells: copiedCells,
        baseRow: minRow,
        baseCol: minCol
    };
  }, [selectionRange, cells]);

  const handleCut = useCallback(() => {
    handleCopy();
    setSheets(prev => prev.map(s => {
        if (s.id !== activeSheetId) return s;
        const newCells = { ...s.cells };
        selectionRange?.forEach(id => {
            delete newCells[id];
        });
        return { ...s, cells: newCells };
    }));
  }, [handleCopy, activeSheetId, selectionRange]);

  const handlePaste = useCallback(() => {
    if (!clipboardRef.current || !activeCell) return;
    const { cells: copiedCells, baseRow, baseCol } = clipboardRef.current;
    const targetStart = parseCellId(activeCell);
    if (!targetStart) return;
    
    setSheets(prev => prev.map(s => {
        if (s.id !== activeSheetId) return s;
        
        const nextCells = { ...s.cells };
        const nextDependents = { ...s.dependentsMap };
        
        Object.values(copiedCells).forEach((cell: CellData) => {
             const orig = parseCellId(cell.id)!;
             const rOffset = orig.row - baseRow;
             const cOffset = orig.col - baseCol;
             
             const targetRow = targetStart.row + rOffset;
             const targetCol = targetStart.col + cOffset;
             const targetId = getCellId(targetCol, targetRow);
             
             const rawValue = cell.raw;
             
             const oldCell = nextCells[targetId];
             if (oldCell?.raw.startsWith('=')) {
                const oldDeps = extractDependencies(oldCell.raw);
                oldDeps.forEach(dep => {
                   if(nextDependents[dep]) nextDependents[dep] = nextDependents[dep].filter(d => d !== targetId);
                });
             }
             
             nextCells[targetId] = { ...cell, id: targetId };
             
             if (rawValue.startsWith('=')) {
                 const newDeps = extractDependencies(rawValue);
                 newDeps.forEach(depId => {
                     if(!nextDependents[depId]) nextDependents[depId] = [];
                     if(!nextDependents[depId].includes(targetId)) nextDependents[depId].push(targetId);
                 });
             }
        });
        
        return { ...s, cells: nextCells, dependentsMap: nextDependents };
    }));
  }, [activeCell, activeSheetId]);

  const handleInsertRow = useCallback(() => {
      if (!activeCell) return;
      const { row: startRow } = parseCellId(activeCell)!;
      setSheets(prev => prev.map(sheet => {
          if (sheet.id !== activeSheetId) return sheet;
          const newCells: Record<string, CellData> = {};
          Object.values(sheet.cells).forEach((cell: CellData) => {
              const { col, row } = parseCellId(cell.id)!;
              if (row >= startRow) {
                  const newId = getCellId(col, row + 1);
                  newCells[newId] = { ...cell, id: newId };
              } else {
                  newCells[cell.id] = cell;
              }
          });
          return { ...sheet, cells: newCells };
      }));
  }, [activeCell, activeSheetId]);

  const handleDeleteRow = useCallback(() => {
      if (!activeCell) return;
      const { row: startRow } = parseCellId(activeCell)!;
      setSheets(prev => prev.map(sheet => {
          if (sheet.id !== activeSheetId) return sheet;
          const newCells: Record<string, CellData> = {};
          Object.values(sheet.cells).forEach((cell: CellData) => {
              const { col, row } = parseCellId(cell.id)!;
              if (row === startRow) return;
              if (row > startRow) {
                  const newId = getCellId(col, row - 1);
                  newCells[newId] = { ...cell, id: newId };
              } else {
                  newCells[cell.id] = cell;
              }
          });
          return { ...sheet, cells: newCells };
      }));
  }, [activeCell, activeSheetId]);

  const handleSort = useCallback((direction: 'asc' | 'desc') => {
    if (!activeCell) return;
    const { col: sortColIdx } = parseCellId(activeCell)!;

    setSheets(prev => prev.map(sheet => {
        if (sheet.id !== activeSheetId) return sheet;

        let startRow = 1; 
        let endRow = gridSize.rows - 1;

        if (sheet.selectionRange && sheet.selectionRange.length > 1) {
            const coords = sheet.selectionRange.map(id => parseCellId(id)!);
            startRow = Math.min(...coords.map(c => c.row));
            endRow = Math.max(...coords.map(c => c.row));
            if (startRow === endRow) {
                 startRow = 1; 
                 const allRows = Object.keys(sheet.cells).map(k => parseCellId(k)?.row || 0);
                 endRow = Math.max(0, ...allRows);
            }
        } else {
             const allRows = Object.keys(sheet.cells).map(k => parseCellId(k)?.row || 0);
             endRow = Math.max(0, ...allRows);
        }
        
        const rowsData: { rowIdx: number, cells: Record<number, CellData> }[] = [];
        for (let r = startRow; r <= endRow; r++) {
            rowsData.push({ rowIdx: r, cells: {} });
        }
        
        Object.values(sheet.cells).forEach((cell: CellData) => {
             const { col, row } = parseCellId(cell.id)!;
             if (row >= startRow && row <= endRow) {
                 const rowIndexInArray = row - startRow;
                 if (rowsData[rowIndexInArray]) {
                     rowsData[rowIndexInArray].cells[col] = cell;
                 }
             }
        });

        rowsData.sort((a, b) => {
             const cellA = a.cells[sortColIdx];
             const cellB = b.cells[sortColIdx];
             
             const valA = cellA ? (parseFloat(cellA.value) || cellA.value) : '';
             const valB = cellB ? (parseFloat(cellB.value) || cellB.value) : '';

             if (valA === valB) return 0;
             if (valA === '') return 1; 
             if (valB === '') return -1;

             if (direction === 'asc') return valA < valB ? -1 : 1;
             return valA > valB ? -1 : 1;
        });

        const newCells = { ...sheet.cells };
        
        Object.keys(sheet.cells).forEach(key => {
            const { row } = parseCellId(key)!;
            if (row >= startRow && row <= endRow) {
                delete newCells[key];
            }
        });

        rowsData.forEach((rowData, i) => {
            const targetRow = startRow + i;
            Object.values(rowData.cells).forEach((cell: CellData) => {
                 const { col } = parseCellId(cell.id)!;
                 const newId = getCellId(col, targetRow);
                 newCells[newId] = { ...cell, id: newId };
            });
        });

        return { ...sheet, cells: newCells };
    }));
  }, [activeCell, activeSheetId, gridSize]);

  const handleAutoSum = useCallback(() => {
      if (!activeCell) return;
      const { col, row } = parseCellId(activeCell)!;
      let startRow = row - 1;
      while (startRow >= 0) {
          const id = getCellId(col, startRow);
          const cell = cells[id];
          if (!cell || (!parseFloat(cell.value) && cell.value !== '0')) break;
          startRow--;
      }
      startRow++; 
      
      if (startRow < row) {
          const startId = getCellId(col, startRow);
          const endId = getCellId(col, row - 1);
          const formula = `=SUM(${startId}:${endId})`;
          handleCellChange(activeCell, formula);
      }
  }, [activeCell, cells, handleCellChange]);

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 font-sans text-slate-900 overflow-hidden">
        <Suspense fallback={<ToolbarSkeleton />}>
            <Toolbar 
              currentStyle={activeStyle}
              onToggleStyle={handleStyleChange}
              onExport={handleExport}
              onClear={handleClear}
              onResetLayout={handleResetLayout}
              onCopy={handleCopy}
              onCut={handleCut}
              onPaste={handlePaste}
              onAutoSum={handleAutoSum}
              onInsertRow={handleInsertRow}
              onDeleteRow={handleDeleteRow}
              onSort={handleSort}
            />
        </Suspense>
        
        <Suspense fallback={<FormulaBarSkeleton />}>
            <FormulaBar 
              selectedCell={activeCell}
              value={activeCell ? (cells[activeCell]?.raw || '') : ''}
              onChange={handleFormulaChange}
              onSubmit={handleFormulaSubmit}
            />
        </Suspense>
        
        <div className="flex-1 overflow-hidden relative flex flex-col z-0">
          <Suspense fallback={<GridSkeleton />}>
              <Grid 
                size={gridSize}
                cells={cells}
                activeCell={activeCell}
                selectionRange={selectionRange}
                columnWidths={columnWidths}
                rowHeights={rowHeights} 
                scale={zoom}
                onCellClick={handleCellClick}
                onSelectionDrag={handleSelectionDrag}
                onCellDoubleClick={handleCellDoubleClick}
                onCellChange={handleCellChange}
                onNavigate={handleNavigate}
                onColumnResize={handleColumnResize}
                onRowResize={handleRowResize}
                onExpandGrid={handleExpandGrid}
                onTrimGrid={handleTrimGrid}
                onZoom={handleZoomWheel}
              />
          </Suspense>
        </div>

        <Suspense fallback={<SheetTabsSkeleton />}>
            <SheetTabs 
              sheets={sheets}
              activeSheetId={activeSheetId}
              onSwitch={setActiveSheetId}
              onAdd={handleAddSheet}
            />
        </Suspense>
        
        <Suspense fallback={<StatusBarSkeleton />}>
            <StatusBar 
              selectionCount={selectionRange?.length || 0}
              stats={selectionStats}
              zoom={zoom}
              onZoomChange={handleSetZoom}
            />
        </Suspense>
    </div>
  );
};

export default App;