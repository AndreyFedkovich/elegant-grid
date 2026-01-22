import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from './utils';
import { EmptyStateConfig } from './types';

interface ElegantGridEmptyProps {
  config: EmptyStateConfig;
  className?: string;
}

export function ElegantGridEmpty({ config, className }: ElegantGridEmptyProps) {
  const { title, description, icon, action } = config;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        {icon || <Inbox className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
