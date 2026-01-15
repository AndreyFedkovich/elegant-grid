import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { GridProvider } from './AppGridContext';
import { AppGridHeader } from './AppGridHeader';
import { AppGridRow } from './AppGridRow';
import { AppGridCell } from './AppGridCell';
import { AppGridActionCell } from './AppGridActionCell';
import { AppGridPager } from './AppGridPager';
import { AppGridEmpty } from './AppGridEmpty';
import { AppGridSkeleton } from './AppGridSkeleton';
import { AppGridProps } from './types';

function AppGridRoot({
  headers,
  totalCount,
  loading = false,
  onSort,
  onSelectionChange,
  pagerOptions,
  emptyState,
  children,
  className,
}: AppGridProps) {
  // Extract all row data for select-all functionality
  const allRowData = useMemo(() => {
    const data: any[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.data) {
        data.push(child.props.data);
      }
    });
    return data;
  }, [children]);

  const hasChildren = React.Children.count(children) > 0;
  const showEmptyState = !loading && !hasChildren && emptyState;
  const showSelection = onSelectionChange !== undefined;

  // Get initial column widths
  const initialColumnWidths = headers.map((h) => h.width || h.minWidth || 150);

  return (
    <GridProvider
      headers={headers}
      loading={loading}
      onSort={onSort}
      onSelectionChange={onSelectionChange}
    >
      <div
        className={cn(
          'flex flex-col border border-border rounded-lg overflow-hidden bg-background',
          className
        )}
      >
        {/* Scrollable grid area */}
        <div className="overflow-x-auto flex-1">
          <div className="min-w-max">
            <AppGridHeader showSelection={showSelection} allData={allRowData} />

            {loading && (
              <AppGridSkeleton
                columns={headers.length}
                rows={5}
                showSelection={showSelection}
                columnWidths={initialColumnWidths}
              />
            )}

            {!loading && hasChildren && children}

            {showEmptyState && <AppGridEmpty config={emptyState} />}
          </div>
        </div>

        {/* Pagination */}
        {pagerOptions && (
          <AppGridPager totalCount={totalCount} options={pagerOptions} />
        )}
      </div>
    </GridProvider>
  );
}

// Compound component pattern
export const AppGrid = Object.assign(AppGridRoot, {
  Row: AppGridRow,
  Cell: AppGridCell,
  ActionCell: AppGridActionCell,
});
