import React, { useCallback, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { cn } from './utils';
import { useGridContext } from './ElegantGridContext';

interface ElegantGridHeaderProps {
  showSelection?: boolean;
  allData?: any[];
}

export function ElegantGridHeader({ showSelection = true, allData = [] }: ElegantGridHeaderProps) {
  const {
    headers,
    columnWidths,
    setColumnWidth,
    sortOrder,
    setSortOrder,
    toggleAllSelection,
    isAllSelected,
    selectedRows,
    config,
  } = useGridContext();

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortOrder?.key === key) {
      if (sortOrder.direction === 'asc') {
        setSortOrder({ key, direction: 'desc' });
      } else {
        setSortOrder(null);
      }
    } else {
      setSortOrder({ key, direction: 'asc' });
    }
  };

  const gridTemplateColumns = [
    showSelection ? `${config.checkboxColumnWidth}px` : '',
    ...headers.map((header, index) => {
      const width = columnWidths[index];
      return header.fill ? `minmax(${width}px, 1fr)` : `${width}px`;
    }),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="sticky top-0 grid border-b border-border bg-muted/50 backdrop-blur-sm shadow-sm"
      style={{ gridTemplateColumns, zIndex: config.stickyHeaderZIndex }}
    >
      {showSelection && (
        <div className={cn('flex items-center justify-center border-r border-border', config.cellPadding)}>
          <Checkbox
            checked={isAllSelected && selectedRows.size > 0}
            onCheckedChange={() => toggleAllSelection(allData)}
            aria-label="Select all rows"
          />
        </div>
      )}
      {headers.map((header, index) => (
        <HeaderCell
          key={header.key}
          header={header}
          index={index}
          onSort={() => handleSort(header.key, header.sortable)}
          isSorted={sortOrder?.key === header.key}
          sortDirection={sortOrder?.key === header.key ? sortOrder.direction : undefined}
          onResize={(width) => setColumnWidth(index, width)}
          currentWidth={columnWidths[index]}
          cellPadding={config.cellPadding}
        />
      ))}
    </div>
  );
}

interface HeaderCellProps {
  header: { key: string; label: string; sortable?: boolean; resizable?: boolean; align?: string; customContent?: React.ReactNode };
  index: number;
  onSort: () => void;
  isSorted: boolean;
  sortDirection?: 'asc' | 'desc';
  onResize: (width: number) => void;
  currentWidth: number;
  cellPadding: string;
}

function HeaderCell({
  header,
  index,
  onSort,
  isSorted,
  sortDirection,
  onResize,
  currentWidth,
  cellPadding,
}: HeaderCellProps) {
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeRef.current = { startX: e.clientX, startWidth: currentWidth };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizeRef.current) return;
        const delta = moveEvent.clientX - resizeRef.current.startX;
        onResize(resizeRef.current.startWidth + delta);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        resizeRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [currentWidth, onResize]
  );

  return (
    <div
      className={cn(
        'relative flex items-center gap-2 text-sm font-medium text-muted-foreground select-none',
        'border-r border-border last:border-r-0',
        header.sortable && 'cursor-pointer hover:text-foreground hover:bg-muted/80 transition-colors',
        header.align === 'center' && 'justify-center',
        header.align === 'right' && 'justify-end',
        cellPadding
      )}
      onClick={header.sortable ? onSort : undefined}
    >
      <span className="truncate">{header.customContent ?? header.label}</span>
      {header.sortable && isSorted && (
        <span className="flex-shrink-0">
          {sortDirection === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </span>
      )}
      {header.resizable !== false && (
        <div
          className="group absolute top-0 right-0 h-full w-3 translate-x-1/2 cursor-col-resize select-none z-10 flex items-center justify-center"
          onMouseDown={handleResizeStart}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}
