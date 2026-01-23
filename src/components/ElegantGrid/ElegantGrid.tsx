import React, { useMemo, useRef, useCallback } from 'react';
import { cn } from './utils';
import { GridProvider } from './ElegantGridContext';
import { ElegantGridHeader } from './ElegantGridHeader';
import { ElegantGridRow } from './ElegantGridRow';
import { ElegantGridCell } from './ElegantGridCell';
import { ElegantGridActionCell } from './ElegantGridActionCell';
import { ElegantGridPager } from './ElegantGridPager';
import { ElegantGridEmpty } from './ElegantGridEmpty';
import { ElegantGridSkeleton } from './ElegantGridSkeleton';
import { ElegantGridProps, DEFAULT_GRID_CONFIG } from './types';

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
  config: userConfig,
}: ElegantGridProps) {
  const config = useMemo(
    () => ({ ...DEFAULT_GRID_CONFIG, ...userConfig }),
    [userConfig]
  );

  // Refs for scroll synchronization
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Sync horizontal scroll between header and body
  const handleBodyScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

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
  const initialColumnWidths = headers.map((h) => h.width || h.minWidth || config.defaultColumnWidth);

  // Compute body scroll styles and scrollbar gutter for alignment
  const hasVerticalScroll = !!(config.height || config.maxHeight);
  const bodyScrollStyle: React.CSSProperties = {};
  const headerScrollStyle: React.CSSProperties = {};
  
  if (hasVerticalScroll) {
    // Apply scrollbar-gutter to both header and body for consistent width alignment
    bodyScrollStyle.scrollbarGutter = 'stable';
    headerScrollStyle.scrollbarGutter = 'stable';
    
    if (config.height) {
      bodyScrollStyle.height = config.height;
      bodyScrollStyle.overflowY = 'auto';
    } else if (config.maxHeight) {
      bodyScrollStyle.maxHeight = config.maxHeight;
      bodyScrollStyle.overflowY = 'auto';
    }
  }

  const scrollbarClass = config.styledScrollbar ? 'elegant-scrollbar' : '';

  return (
    <GridProvider
      headers={headers}
      loading={loading}
      onSort={onSort}
      onSelectionChange={onSelectionChange}
      config={userConfig}
    >
      <div
        className={cn(
          'elegant-grid-root flex flex-col border border-border rounded-lg overflow-hidden bg-background',
          className
        )}
      >
        {/* Header wrapper - scrolls horizontally but hides scrollbar */}
        <div
          ref={headerRef}
          className="overflow-x-hidden shrink-0"
          style={headerScrollStyle}
        >
          <div className="min-w-max">
            <ElegantGridHeader showSelection={showSelection} allData={allRowData} />
          </div>
        </div>

        {/* Scrollable body area - horizontal + optional vertical scroll */}
        <div
          ref={bodyRef}
          className={cn('overflow-x-auto flex-1', scrollbarClass)}
          style={bodyScrollStyle}
          onScroll={handleBodyScroll}
        >
          <div className="min-w-max">
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

        {/* Pagination - always visible at bottom */}
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
