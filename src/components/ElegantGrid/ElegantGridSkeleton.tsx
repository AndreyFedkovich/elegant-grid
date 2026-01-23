import React from 'react';
import { Skeleton } from './ui/skeleton';
import { cn } from './utils';
import { useGridContext } from './ElegantGridContext';

interface ElegantGridSkeletonProps {
  columns: number;
  rows?: number;
  showSelection?: boolean;
  columnWidths: number[];
}

export function ElegantGridSkeleton({
  columns,
  rows = 5,
  showSelection = true,
  columnWidths,
}: ElegantGridSkeletonProps) {
  // Try to get config from context, fallback to defaults if not available
  let checkboxColumnWidth = 48;
  let cellPadding = 'p-3';
  
  try {
    const context = useGridContext();
    checkboxColumnWidth = context.config.checkboxColumnWidth;
    cellPadding = context.config.cellPadding;
  } catch {
    // Outside of context, use defaults
  }

  const gridTemplateColumns = [
    showSelection ? `${checkboxColumnWidth}px` : '',
    ...columnWidths.map((w) => `${w}px`),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid border-b border-border"
          style={{ gridTemplateColumns }}
        >
          {showSelection && (
            <div className={cn('flex items-center justify-center border-r border-border', cellPadding)}>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          )}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'flex items-center border-r border-border last:border-r-0',
                cellPadding
              )}
            >
              <Skeleton
                className="h-4 rounded"
                style={{ width: `${Math.random() * 40 + 50}%` }}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
