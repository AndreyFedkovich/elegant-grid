import React from 'react';
import { Skeleton } from './ui/skeleton';
import { cn } from './utils';

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
  const gridTemplateColumns = [
    showSelection ? '48px' : '',
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
            <div className="flex items-center justify-center p-3 border-r border-border">
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          )}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'flex items-center p-3 border-r border-border last:border-r-0'
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
