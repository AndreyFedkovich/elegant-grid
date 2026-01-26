// Styles - consumers should import '@andreyfedkovich/elegant-grid/styles.css'
import './styles.css';

// Main component
export { ElegantGrid } from './ElegantGrid';

// Sub-components (for advanced usage)
export { ElegantGridRow } from './ElegantGridRow';
export { ElegantGridCell } from './ElegantGridCell';
export { ElegantGridActionCell } from './ElegantGridActionCell';
export { ElegantGridPager } from './ElegantGridPager';
export { ElegantGridEmpty } from './ElegantGridEmpty';
export { ElegantGridSkeleton } from './ElegantGridSkeleton';

// Composition-based header components
export { ElegantGridHeaders, ElegantGridHeaderComponent } from './ElegantGridHeaders';

// Context hook
export { useGridContext } from './ElegantGridContext';

// Types
export type {
  Header,
  SortOrder,
  PagerOptions,
  PagerLabels,
  EmptyStateConfig,
  GridConfig,
  ResolvedGridConfig,
  ElegantGridProps,
  ElegantGridRowProps,
  ElegantGridCellProps,
  ElegantGridActionCellProps,
  GridContextValue,
  ElegantGridHeaderProps,
} from './types';

// Constants
export { DEFAULT_GRID_CONFIG } from './types';
