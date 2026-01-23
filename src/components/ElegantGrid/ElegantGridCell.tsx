import React from 'react';
import { cn } from './utils';
import { ElegantGridCellProps } from './types';

export function ElegantGridCell({
  children,
  className,
  align = 'left',
  ...props
}: ElegantGridCellProps & { isRowHovered?: boolean }) {
  return (
    <div
      {...props}
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
