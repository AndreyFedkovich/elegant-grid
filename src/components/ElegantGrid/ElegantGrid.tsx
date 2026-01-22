import React, { useMemo } from 'react';
import { cn } from './utils';
import { GridProvider } from './ElegantGridContext';
import { ElegantGridHeader } from './ElegantGridHeader';
import { ElegantGridRow } from './ElegantGridRow';
import { ElegantGridCell } from './ElegantGridCell';
import { ElegantGridActionCell } from './ElegantGridActionCell';
import { ElegantGridPager } from './ElegantGridPager';
import { ElegantGridEmpty } from './ElegantGridEmpty';
import { ElegantGridSkeleton } from './ElegantGridSkeleton';
import { ElegantGridProps } from './types';

function ElegantGridRoot({
  headers,
  totalCount,
  loading = false,
  onSort,
  onSelectionChange,
  pagerOptions,
  emptyState,
  children,
  className,
}: ElegantGridProps) {
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
          'elegant-grid-root flex flex-col border border-border rounded-lg overflow-hidden bg-background',
          className
        )}
      >
        {/* Scrollable grid area */}
        <div className="overflow-x-auto flex-1">
          <div className="min-w-max">
            <ElegantGridHeader showSelection={showSelection} allData={allRowData} />

            {loading && (
              <ElegantGridSkeleton
                columns={headers.length}
                rows={5}
                showSelection={showSelection}
                columnWidths={initialColumnWidths}
              />
            )}

            {!loading && hasChildren && children}

            {showEmptyState && <ElegantGridEmpty config={emptyState} />}
          </div>
        </div>

        {/* Pagination */}
        {pagerOptions && (
          <ElegantGridPager totalCount={totalCount} options={pagerOptions} />
        )}
      </div>
    </GridProvider>
  );
}

// Compound component pattern
export const ElegantGrid = Object.assign(ElegantGridRoot, {
  Row: ElegantGridRow,
  Cell: ElegantGridCell,
  ActionCell: ElegantGridActionCell,
});
