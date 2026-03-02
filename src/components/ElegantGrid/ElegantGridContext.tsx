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

export function GridProvider<T = any>({
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
  const [rowDataMap, setRowDataMap] = useState<Map<string, T>>(new Map());
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

  const getRowId = useCallback((d: T) => {
    return d?.[config.rowIdKey as keyof T]?.toString() || JSON.stringify(d);
  }, [config.rowIdKey]);

  const toggleRowSelection = useCallback((id: string, data: T) => {
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
        if (next.has(id)) {
          nextMap.set(id, data);
        } else {
          nextMap.delete(id);
        }
        return nextMap;
      });

      return next;
    });
  }, []);

  // Effect to notify parent of selection changes to avoid side-effects in state updater
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedData = Array.from(selectedRows).map((id) => rowDataMap.get(id)).filter(Boolean) as T[];
      onSelectionChange(selectedData);
    }
  }, [selectedRows, rowDataMap, onSelectionChange]);

  const toggleAllSelection = useCallback((allData: T[]) => {
    const allIds = allData.map(getRowId);
    
    setSelectedRows((prev) => {
      const allSelected = allIds.length > 0 && allIds.every((id) => prev.has(id));
      
      if (allSelected) {
        return new Set();
      } else {
        // Update row data map with all data
        setRowDataMap((prevMap) => {
          const nextMap = new Map(prevMap);
          allData.forEach((d) => {
            const id = getRowId(d);
            nextMap.set(id, d);
          });
          return nextMap;
        });
        
        return new Set(allIds);
      }
    });
    
    setAllRowIds(allIds);
  }, [getRowId]);

  const isAllSelected = useMemo(() => {
    if (allRowIds.length === 0) return false;
    return allRowIds.every((id) => selectedRows.has(id));
  }, [selectedRows, allRowIds]);

  // Determine if selection is enabled at grid level
  const showSelection = onSelectionChange !== undefined;

  // Memoized grid template columns for performance and consistency
  const gridTemplateColumns = useMemo(() => {
    return [
      showSelection ? `${config.checkboxColumnWidth}px` : '',
      ...headers.map((header, index) => {
        const width = columnWidths[index];
        return header.fill ? `minmax(${width}px, 1fr)` : `${width}px`;
      }),
    ]
      .filter(Boolean)
      .join(' ');
  }, [showSelection, config.checkboxColumnWidth, headers, columnWidths]);

  const value: GridContextValue<T> = {
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
    showSelection,
    gridTemplateColumns,
    getRowId,
  };

  return <GridContext.Provider value={value as GridContextValue}>{children}</GridContext.Provider>;
}
