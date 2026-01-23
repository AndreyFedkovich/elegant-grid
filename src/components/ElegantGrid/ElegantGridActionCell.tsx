import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './utils';
import { ElegantGridActionCellProps } from './types';

export function ElegantGridActionCell({
  onEdit,
  onDelete,
  customActions = [],
  className,
  isRowHovered,
  ...props
}: ElegantGridActionCellProps & { isRowHovered?: boolean }) {
  return (
    <div
      {...props}
      className={cn(
        'flex items-center justify-end gap-1 p-2 border-r border-border last:border-r-0 transition-opacity duration-150',
        isRowHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {customActions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8',
            action.variant === 'destructive'
              ? 'text-destructive hover:text-destructive hover:bg-destructive/10'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick();
          }}
          aria-label={action.label}
        >
          {action.icon}
        </Button>
      ))}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
