import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useGridContext } from './ElegantGridContext';
import { ElegantGridRowProps } from './types';

export function ElegantGridRow({
  children,
  data,
  selectable = true,
  className,
}: ElegantGridRowProps) {
  const { headers, columnWidths, selectedRows, toggleRowSelection } = useGridContext();
  const [isHovered, setIsHovered] = useState(false);

  const rowId = data?.id?.toString() || JSON.stringify(data);
  const isSelected = selectedRows.has(rowId);

  const gridTemplateColumns = [
    selectable ? '48px' : '',
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
      className={cn(
        'grid border-b border-border transition-colors duration-150',
        isSelected ? 'bg-primary/5' : 'bg-background hover:bg-muted/30',
        className
      )}
      style={{ gridTemplateColumns }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {selectable && (
        <div className="flex items-center justify-center p-3 border-r border-border">
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
