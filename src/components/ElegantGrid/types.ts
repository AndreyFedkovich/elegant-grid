import React from 'react';

export interface Header {
  key: string;
  label: string;
  sortable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
  /** Custom render function for header content */
  render?: () => React.ReactNode;
}

// Re-export from composition component for type usage
export type { ElegantGridHeaderProps } from './ElegantGridHeaders';

export interface SortOrder {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PagerLabels {
  /** Custom function to format "Showing X-Y of Z" text */
  showingText?: (start: number, end: number, total: number) => string;
  /** Label for rows per page selector (default: "Rows:") */
  rowsLabel?: string;
  /** Label for jump to page input (default: "Go to:") */
  goToLabel?: string;
}

export interface PagerOptions {
  onQueryChange: (query: { offset: number; limit: number }) => void;
  onRefresh?: () => void;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  /** Custom labels for internationalization */
  labels?: PagerLabels;
}

export interface EmptyStateConfig {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface GridConfig {
  /** Width of the checkbox column in pixels (default: 48) */
  checkboxColumnWidth?: number;
  /** Default column width when not specified (default: 150) */
  defaultColumnWidth?: number;
  /** Minimum column width (default: 80) */
  minColumnWidth?: number;
  /** Cell padding className (default: "p-3") */
  cellPadding?: string;
  /** Z-index for sticky header (default: 10) */
  stickyHeaderZIndex?: number;
  /** Maximum height of the grid body before vertical scroll kicks in (e.g., "400px", "50vh") */
  maxHeight?: string;
  /** Fixed height of the grid body (takes precedence over maxHeight) */
  height?: string;
  /** Minimum height of the grid body to maintain consistent height during loading */
  minHeight?: string;
  /** Enable custom scrollbar styling (default: true) */
  styledScrollbar?: boolean;
  /** Property key to use for row identification (default: "id") */
  rowIdKey?: string;
  /** Number of skeleton rows to show during loading (default: uses pagerOptions.defaultPageSize or 5) */
  skeletonRows?: number;
}

export interface ElegantGridProps {
  /** Column headers configuration (optional when using composition-based headers) */
  headers?: Header[];
  totalCount: number;
  loading?: boolean;
  onSort?: (order: SortOrder | null) => void;
  onSelectionChange?: (selectedData: any[]) => void;
  pagerOptions?: PagerOptions;
  emptyState?: EmptyStateConfig;
  children: React.ReactNode;
  className?: string;
  /** Configuration for grid layout and styling */
  config?: GridConfig;
}

export interface ElegantGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  data?: any;
  selectable?: boolean;
}

export interface ElegantGridCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface ElegantGridActionCellProps extends React.HTMLAttributes<HTMLDivElement> {
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
}

export const DEFAULT_GRID_CONFIG: Required<Omit<GridConfig, 'maxHeight' | 'height' | 'minHeight' | 'skeletonRows'>> & Pick<GridConfig, 'maxHeight' | 'height' | 'minHeight' | 'skeletonRows'> = {
  checkboxColumnWidth: 48,
  defaultColumnWidth: 150,
  minColumnWidth: 80,
  cellPadding: 'p-3',
  stickyHeaderZIndex: 10,
  maxHeight: undefined,
  height: undefined,
  minHeight: undefined,
  styledScrollbar: true,
  rowIdKey: 'id',
  skeletonRows: undefined,
};

/** Config type used in context (with optional height fields) */
export type ResolvedGridConfig = Required<Omit<GridConfig, 'maxHeight' | 'height' | 'minHeight' | 'skeletonRows'>> & Pick<GridConfig, 'maxHeight' | 'height' | 'minHeight' | 'skeletonRows'>;

export interface GridContextValue {
  headers: Header[];
  columnWidths: number[];
  setColumnWidth: (index: number, width: number) => void;
  sortOrder: SortOrder | null;
  setSortOrder: (order: SortOrder | null) => void;
  selectedRows: Set<string>;
  toggleRowSelection: (id: string, data: any) => void;
  toggleAllSelection: (allData: any[]) => void;
  isAllSelected: boolean;
  loading: boolean;
  rowDataMap: Map<string, any>;
  config: ResolvedGridConfig;
  /** Whether selection is enabled at the grid level */
  showSelection: boolean;
}
