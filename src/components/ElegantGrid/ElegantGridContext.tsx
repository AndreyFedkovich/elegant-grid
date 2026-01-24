import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Header, SortOrder, GridContextValue, GridConfig, DEFAULT_GRID_CONFIG, ResolvedGridConfig } from './types';

const GridContext = createContext<GridContextValue | null>(null);

export function useGridContext() {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('Grid components must be used within ElegantGrid');
  }
  return context;
}

interface GridProviderProps {
  headers: Header[];
  loading: boolean;
  onSort?: (order: SortOrder | null) => void;
  onSelectionChange?: (selectedData: any[]) => void;
  config?: GridConfig;
  children: React.ReactNode;
}

export function GridProvider({
  headers,
  loading,
  onSort,
  onSelectionChange,
  config: userConfig,
  children,
}: GridProviderProps) {
  const config: ResolvedGridConfig = useMemo(
    () => ({ ...DEFAULT_GRID_CONFIG, ...userConfig }),
    [userConfig]
  );

  const [columnWidths, setColumnWidths] = useState<number[]>(
    headers.map((h) => h.width || h.minWidth || config.defaultColumnWidth)
  );
  const [sortOrder, setSortOrderState] = useState<SortOrder | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [rowDataMap, setRowDataMap] = useState<Map<string, any>>(new Map());
  const [allRowIds, setAllRowIds] = useState<string[]>([]);

  const setColumnWidth = useCallback((index: number, width: number) => {
    setColumnWidths((prev) => {
      const next = [...prev];
      next[index] = Math.max(width, headers[index].minWidth || config.minColumnWidth);
      return next;
    });
  }, [headers, config.minColumnWidth]);

  const setSortOrder = useCallback((order: SortOrder | null) => {
    setSortOrderState(order);
    onSort?.(order);
  }, [onSort]);

  const toggleRowSelection = useCallback((id: string, data: any) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      
      // Update row data map
      setRowDataMap((prevMap) => {
        const nextMap = new Map(prevMap);
        nextMap.set(id, data);
        return nextMap;
      });

      // Notify parent
      const selectedData = Array.from(next).map((rowId) => rowDataMap.get(rowId) || data);
      onSelectionChange?.(selectedData);
      
      return next;
    });
  }, [onSelectionChange, rowDataMap]);

  const getRowId = useCallback((d: any) => {
    return d?.[config.rowIdKey]?.toString() || JSON.stringify(d);
  }, [config.rowIdKey]);

  const toggleAllSelection = useCallback((allData: any[]) => {
    const allIds = allData.map(getRowId);
    
    setSelectedRows((prev) => {
      const allSelected = allIds.every((id) => prev.has(id));
      
      if (allSelected) {
        onSelectionChange?.([]);
        return new Set();
      } else {
        // Update row data map with all data
        setRowDataMap(() => {
          const nextMap = new Map();
          allData.forEach((d) => {
            const id = getRowId(d);
            nextMap.set(id, d);
          });
          return nextMap;
        });
        
        onSelectionChange?.(allData);
        return new Set(allIds);
      }
    });
    
    setAllRowIds(allIds);
  }, [onSelectionChange, getRowId]);

  const isAllSelected = useMemo(() => {
    if (allRowIds.length === 0) return false;
    return allRowIds.every((id) => selectedRows.has(id));
  }, [selectedRows, allRowIds]);

  const value: GridContextValue = {
    headers,
    columnWidths,
    setColumnWidth,
    sortOrder,
    setSortOrder,
    selectedRows,
    toggleRowSelection,
    toggleAllSelection,
    isAllSelected,
    loading,
    rowDataMap,
    config,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}
