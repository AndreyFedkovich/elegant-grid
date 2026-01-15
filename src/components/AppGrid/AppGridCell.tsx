import React from 'react';
import { cn } from '@/lib/utils';
import { AppGridCellProps } from './types';

export function AppGridCell({
  children,
  className,
  align = 'left',
}: AppGridCellProps & { isRowHovered?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center p-3 text-sm border-r border-border last:border-r-0 min-w-0',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className
      )}
    >
      <span className="truncate">{children}</span>
    </div>
  );
}
