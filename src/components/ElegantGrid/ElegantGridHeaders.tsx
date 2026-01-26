import React from 'react';

export interface ElegantGridHeaderProps {
  /** Column identifier (maps to Header.key) */
  dataKey: string;
  /** Display text */
  label: string;
  /** Enable column sorting */
  sortable?: boolean;
  /** Enable column resizing (default: true) */
  resizable?: boolean;
  /** Minimum column width in pixels */
  minWidth?: number;
  /** Initial column width in pixels */
  width?: number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** If true, this column will expand to fill remaining space */
  fill?: boolean;
  /** Custom content for the header (takes precedence over label) */
  children?: React.ReactNode;
}

/**
 * Container component for composition-based headers.
 * Acts as a marker for extraction - does not render anything directly.
 * Its children are extracted and processed by ElegantGrid.
 */
export function ElegantGridHeaders({ children }: { children: React.ReactNode }) {
  // This component doesn't render anything directly
  // Its children are extracted and processed by the parent ElegantGrid
  return null;
}

/**
 * Individual header configuration component.
 * Does not render - it's a configuration holder that gets parsed.
 */
export function ElegantGridHeaderComponent(_props: ElegantGridHeaderProps) {
  // This component doesn't render - it's a configuration holder
  return null;
}
