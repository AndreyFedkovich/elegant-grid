import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { cn } from './utils';
import { useGridContext } from './ElegantGridContext';
import { ElegantGridRowProps } from './types';

export function ElegantGridRow({
  children,
  data,
  selectable = true,
  className,
  ...props
}: ElegantGridRowProps) {
  const { headers, columnWidths, selectedRows, toggleRowSelection, config } = useGridContext();
  const [isHovered, setIsHovered] = useState(false);

  const rowId = data?.[config.rowIdKey]?.toString() || JSON.stringify(data);
  const isSelected = selectedRows.has(rowId);

  const gridTemplateColumns = [
    selectable ? `${config.checkboxColumnWidth}px` : '',
    ...columnWidths.map((w) => `${w}px`),
  ]
    .filter(Boolean)
    .join(' ');

  // Clone children to pass hover state
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        isRowHovered: isHovered,
      });
    }
    return child;
  });

  return (
    <div
      {...props}
      className={cn(
        'grid border-b border-border transition-colors duration-150',
        isSelected ? 'bg-primary/5' : 'bg-background hover:bg-muted/30',
        className
      )}
      style={{ gridTemplateColumns, ...props.style }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        props.onMouseLeave?.(e);
      }}
    >
      {selectable && (
        <div className={cn('flex items-center justify-center border-r border-border', config.cellPadding)}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleRowSelection(rowId, data)}
            aria-label="Select row"
          />
        </div>
      )}
      {childrenWithProps}
    </div>
  );
}
