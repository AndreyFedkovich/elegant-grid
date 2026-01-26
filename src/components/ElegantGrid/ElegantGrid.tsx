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
import { ElegantGridScrollbar } from './ElegantGridScrollbar';
import { ElegantGridProps, Header, DEFAULT_GRID_CONFIG, ElegantGridHeaderProps } from './types';
import { ElegantGridHeaders, ElegantGridHeaderComponent } from './ElegantGridHeaders';

/**
 * Extracts header configuration from composition-based children.
 * Scans for ElegantGrid.Headers container and extracts ElegantGrid.Header props.
 */
function extractHeadersFromChildren(children: React.ReactNode): {
  headers: Header[];
  otherChildren: React.ReactNode[];
} {
  const headers: Header[] = [];
  const otherChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      otherChildren.push(child);
      return;
    }

    // Check if child is ElegantGrid.Headers container
    if (child.type === ElegantGridHeaders) {
      // Extract individual header configurations
      React.Children.forEach(child.props.children, (headerChild) => {
        if (
          React.isValidElement(headerChild) &&
          headerChild.type === ElegantGridHeaderComponent
        ) {
          const props = headerChild.props as ElegantGridHeaderProps;
          headers.push({
            key: props.dataKey,
            label: props.label,
            sortable: props.sortable,
            resizable: props.resizable,
            minWidth: props.minWidth,
            width: props.width,
            align: props.align,
            customContent: props.children,
          });
        }
      });
    } else {
      // Keep non-header children (rows)
      otherChildren.push(child);
    }
  });

  return { headers, otherChildren };
}

function ElegantGridRoot({
  headers: propHeaders,
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
  // Extract headers from composition if not provided via props
  const { headers: compositionHeaders, otherChildren } = useMemo(
    () => extractHeadersFromChildren(children),
    [children]
  );

  // Props take precedence, then composition
  const headers = propHeaders ?? (compositionHeaders.length > 0 ? compositionHeaders : []);

  // Determine which children to render (original if using props, filtered if using composition)
  const rowChildren = propHeaders ? children : otherChildren;
  const config = useMemo(
    () => ({ ...DEFAULT_GRID_CONFIG, ...userConfig }),
    [userConfig]
  );

  // Refs for scroll synchronization
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null); // Outer: horizontal scroll
  const verticalScrollRef = useRef<HTMLDivElement>(null); // Inner: vertical scroll

  // Sync horizontal scroll between header and body
  const handleBodyScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

  // Extract all row data for select-all functionality (use rowChildren for composition mode)
  const allRowData = useMemo(() => {
    const data: any[] = [];
    React.Children.forEach(rowChildren, (child) => {
      if (React.isValidElement(child) && child.props.data) {
        data.push(child.props.data);
      }
    });
    return data;
  }, [rowChildren]);

  const hasRows = Array.isArray(rowChildren) ? rowChildren.length > 0 : React.Children.count(rowChildren) > 0;
  const showEmptyState = !loading && !hasRows && emptyState;
  const showSelection = onSelectionChange !== undefined;

  // Get initial column widths
  const initialColumnWidths = headers.map((h) => h.width || h.minWidth || config.defaultColumnWidth);

  // Compute body scroll styles
  const bodyScrollStyle: React.CSSProperties = {};
  const hasHeightConstraint = Boolean(config.height || config.maxHeight || config.minHeight);
  
  if (config.minHeight) {
    bodyScrollStyle.minHeight = config.minHeight;
  }
  
  if (config.height) {
    bodyScrollStyle.height = config.height;
    bodyScrollStyle.overflowY = 'auto';
  } else if (config.maxHeight) {
    bodyScrollStyle.maxHeight = config.maxHeight;
    bodyScrollStyle.overflowY = 'auto';
  }
  
  // Calculate skeleton rows: prefer config, then pagerOptions.defaultPageSize, then 5
  const skeletonRowCount = config.skeletonRows ?? pagerOptions?.defaultPageSize ?? 5;

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
        >
          <div className="min-w-max">
            <ElegantGridHeader showSelection={showSelection} allData={allRowData} />
          </div>
        </div>

        {/* Scrollable body area with nested scroll containers */}
        <div className={cn('relative', !hasHeightConstraint && 'flex-1')}>
          {/* Outer container: horizontal scroll with native scrollbar */}
          <div
            ref={bodyRef}
            className={cn(
              'overflow-x-auto overflow-y-hidden',
              scrollbarClass
            )}
            style={hasHeightConstraint ? { maxHeight: config.maxHeight, height: config.height } : undefined}
            onScroll={handleBodyScroll}
          >
            {/* Inner container: vertical scroll with hidden native scrollbar */}
            <div
              ref={verticalScrollRef}
              className={cn(
                'min-w-max hide-all-scrollbars',
                !hasHeightConstraint && 'h-full'
              )}
              style={bodyScrollStyle}
            >
              {loading && (
                <ElegantGridSkeleton
                  columns={headers.length}
                  rows={skeletonRowCount}
                  showSelection={showSelection}
                  columnWidths={initialColumnWidths}
                />
              )}

              {!loading && hasRows && rowChildren}

              {showEmptyState && <ElegantGridEmpty config={emptyState} />}
            </div>
          </div>
          
          {/* Custom overlay scrollbar for vertical scroll */}
          <ElegantGridScrollbar containerRef={verticalScrollRef} />
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
  Headers: ElegantGridHeaders,
  Header: ElegantGridHeaderComponent,
});
