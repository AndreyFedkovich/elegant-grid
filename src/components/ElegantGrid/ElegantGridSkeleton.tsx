import React from 'react';
import { Skeleton } from './ui/skeleton';
import { cn, columnDividerClasses } from './utils';
import { useGridContext } from './ElegantGridContext';

interface ElegantGridSkeletonProps {
  columns: number;
  rows?: number;
  showSelection?: boolean;
}

export function ElegantGridSkeleton({
  columns,
  rows = 5,
  showSelection = true,
}: ElegantGridSkeletonProps) {
  // Get widths and config from context (skeleton is always rendered inside GridProvider)
  const { columnWidths, config } = useGridContext();
  const { checkboxColumnWidth, cellPadding, showVerticalDividers } = config;

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
            <div className={cn('flex items-center justify-center', columnDividerClasses(showVerticalDividers, { omitLastReset: true }), cellPadding)}>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          )}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'flex items-center',
                columnDividerClasses(showVerticalDividers),
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
