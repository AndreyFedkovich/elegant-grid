import React from 'react';
import { cn, columnDividerClasses } from './utils';
import { useGridContext } from './ElegantGridContext';
import { ElegantGridCellProps } from './types';

export function ElegantGridCell({
  children,
  className,
  align = 'left',
  ...props
}: ElegantGridCellProps & { isRowHovered?: boolean }) {
  const { config } = useGridContext();

  return (
    <div
      {...props}
      className={cn(
        'flex items-center p-3 text-sm min-w-0',
        columnDividerClasses(config.showVerticalDividers),
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className
      )}
    >
      <span className="truncate">{children}</span>
    </div>
  );
}
