export interface Header {
  key: string;
  label: string;
  sortable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
}

export interface SortOrder {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PagerOptions {
  onQueryChange: (query: { offset: number; limit: number }) => void;
  onRefresh?: () => void;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export interface EmptyStateConfig {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ElegantGridProps {
  headers: Header[];
  totalCount: number;
  loading?: boolean;
  onSort?: (order: SortOrder | null) => void;
  onSelectionChange?: (selectedData: any[]) => void;
  pagerOptions?: PagerOptions;
  emptyState?: EmptyStateConfig;
  children: React.ReactNode;
  className?: string;
}

export interface ElegantGridRowProps {
  children: React.ReactNode;
  data?: any;
  selectable?: boolean;
  className?: string;
}

export interface ElegantGridCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ElegantGridActionCellProps {
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
  className?: string;
}

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
}
