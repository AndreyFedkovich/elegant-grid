# @andreyfedkovich/elegant-grid

A premium React data grid with compound components, built on Tailwind CSS.

[![npm version](https://badge.fury.io/js/%40andreyfedkovich%2Felegant-grid.svg)](https://www.npmjs.com/package/@andreyfedkovich/elegant-grid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎮 [Live Demo](https://elegant-grid.vercel.app/)

## Features

- 🧩 **Compound Component API** - Intuitive `ElegantGrid.Row`, `ElegantGrid.Cell`, `ElegantGrid.ActionCell` pattern
- 📐 **CSS Grid Layout** - Modern div-based layout (not tables)
- ☑️ **Multi-row Selection** - Checkboxes with select-all support
- 🔀 **Sortable Columns** - Click headers to sort (asc → desc → none)
- ↔️ **Column Resizing** - Drag column borders to resize
- 📄 **Full Pagination** - Page size selector, jump-to-page, refresh button
- 💀 **Skeleton Loading** - Built-in loading states with height stability
- 📭 **Empty State** - Customizable empty state with icon and action
- 🎨 **Custom Cells** - Full control over cell rendering
- ⚙️ **GridConfig** - Fine-tune layout, scrolling, and identification
- 🌍 **i18n Support** - Customizable labels for internationalization
- 📘 **TypeScript-first** - Complete type definitions
- 🎯 **Spread Props** - Pass native HTML attributes to Row, Cell, ActionCell

## Installation

```bash
npm install @andreyfedkovich/elegant-grid
```

## Quick Start

```tsx
import { ElegantGrid } from '@andreyfedkovich/elegant-grid';
import '@andreyfedkovich/elegant-grid/styles.css'; // Required for styling

const headers = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
];

const data = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

function MyGrid() {
  return (
    <ElegantGrid headers={headers} totalCount={data.length}>
      {data.map((item) => (
        <ElegantGrid.Row key={item.id} data={item} selectable>
          <ElegantGrid.Cell>{item.name}</ElegantGrid.Cell>
          <ElegantGrid.Cell>{item.email}</ElegantGrid.Cell>
        </ElegantGrid.Row>
      ))}
    </ElegantGrid>
  );
}
```

## Styles

Import the required CSS file once in your app's entry point:

```tsx
import '@andreyfedkovich/elegant-grid/styles.css';
```

The styles include scoped CSS variables that won't conflict with your existing design system.

### Dark Mode

ElegantGrid automatically adapts to dark mode when:
- A parent element has the `dark` class (e.g., `<html class="dark">`)
- Or add the `dark` class directly to the grid's parent container

```tsx
// Works automatically with next-themes or similar
<div className="dark">
  <ElegantGrid ... />
</div>
```

## Complete Example

Here's a full-featured example showing all capabilities:

```tsx
import { useState } from 'react';
import { ElegantGrid, type Header, type SortOrder } from '@andreyfedkovich/elegant-grid';
import '@andreyfedkovich/elegant-grid/styles.css';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Sample data
const sampleTransactions = [
  { id: '1', fund: 'Growth Fund Alpha', type: 'Subscription', amount: 150000, status: 'completed', date: '2024-01-15' },
  { id: '2', fund: 'Tech Ventures III', type: 'Redemption', amount: 75000, status: 'pending', date: '2024-01-14' },
  { id: '3', fund: 'Real Estate Plus', type: 'Distribution', amount: 25000, status: 'completed', date: '2024-01-13' },
  { id: '4', fund: 'Global Macro Fund', type: 'Subscription', amount: 500000, status: 'failed', date: '2024-01-12' },
  { id: '5', fund: 'Private Credit II', type: 'Capital Call', amount: 200000, status: 'completed', date: '2024-01-11' },
];

// Header configuration
const headers: Header[] = [
  { key: 'fund', label: 'Fund Name', sortable: true, minWidth: 200, width: 250 },
  { key: 'type', label: 'Type', sortable: true, minWidth: 100, width: 120 },
  { key: 'amount', label: 'Amount', sortable: true, minWidth: 120, width: 150, align: 'right' },
  { key: 'status', label: 'Status', sortable: true, minWidth: 100, width: 120, align: 'center' },
  { key: 'date', label: 'Date', sortable: true, minWidth: 100, width: 120 },
  { key: 'actions', label: 'Actions', minWidth: 100, width: 100, align: 'center', resizable: false },
];

// Custom cell components
const FundCell = ({ name }: { name: string }) => (
  <div className="flex items-center gap-3">
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
        {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
      </AvatarFallback>
    </Avatar>
    <span className="font-medium">{name}</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    completed: 'default',
    pending: 'secondary',
    failed: 'destructive',
  };
  return (
    <Badge variant={variants[status] || 'outline'} className="capitalize">
      {status}
    </Badge>
  );
};

// Main component
export default function TransactionsPage() {
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (query: { offset: number; limit: number }) => {
    console.log('Query changed:', query);
    // Fetch data based on offset and limit
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleEdit = (id: string) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete:', id);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-primary/5 rounded-lg">
          Selected {selectedRows.length} transaction(s) - Total: {
            formatAmount(selectedRows.reduce((sum, row) => sum + row.amount, 0))
          }
        </div>
      )}

      <ElegantGrid
        headers={headers}
        totalCount={sampleTransactions.length}
        loading={loading}
        onSort={setSortOrder}
        onSelectionChange={setSelectedRows}
        config={{
          maxHeight: '400px',
          minHeight: '400px',
          rowIdKey: 'id',
          skeletonRows: 5,
        }}
        pagerOptions={{
          onQueryChange: handleQueryChange,
          onRefresh: handleRefresh,
          defaultPageSize: 25,
          pageSizeOptions: [10, 25, 50, 100],
        }}
        emptyState={{
          title: 'No transactions found',
          description: 'There are no transactions to display.',
        }}
      >
        {sampleTransactions.map((transaction) => (
          <ElegantGrid.Row
            key={transaction.id}
            data={transaction}
            selectable
            onClick={() => console.log('Row clicked:', transaction.id)}
            data-testid={`row-${transaction.id}`}
          >
            <ElegantGrid.Cell>
              <FundCell name={transaction.fund} />
            </ElegantGrid.Cell>
            <ElegantGrid.Cell>{transaction.type}</ElegantGrid.Cell>
            <ElegantGrid.Cell align="right">
              <span className="font-mono">{formatAmount(transaction.amount)}</span>
            </ElegantGrid.Cell>
            <ElegantGrid.Cell align="center">
              <StatusBadge status={transaction.status} />
            </ElegantGrid.Cell>
            <ElegantGrid.Cell>{formatDate(transaction.date)}</ElegantGrid.Cell>
            <ElegantGrid.ActionCell
              onEdit={() => handleEdit(transaction.id)}
              onDelete={() => handleDelete(transaction.id)}
            />
          </ElegantGrid.Row>
        ))}
      </ElegantGrid>
    </div>
  );
}
```

## API Reference

### Header Interface

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string` | *required* | Unique column identifier |
| `label` | `string` | *required* | Column header text |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `minWidth` | `number` | `100` | Minimum column width in pixels |
| `width` | `number` | `150` | Initial column width in pixels |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `resizable` | `boolean` | `true` | Enable column resizing |

### ElegantGridProps

| Property | Type | Description |
|----------|------|-------------|
| `headers` | `Header[]` | Column definitions |
| `totalCount` | `number` | Total number of items (for pagination) |
| `loading` | `boolean` | Show skeleton loading state |
| `onSort` | `(order: SortOrder \| null) => void` | Called when sort changes |
| `onSelectionChange` | `(selectedData: any[]) => void` | Called when selection changes |
| `pagerOptions` | `PagerOptions` | Pagination configuration |
| `emptyState` | `EmptyStateConfig` | Empty state configuration |
| `config` | `GridConfig` | Grid layout and styling configuration |
| `children` | `ReactNode` | Grid rows |
| `className` | `string` | Additional CSS classes |

### SortOrder

```ts
interface SortOrder {
  key: string;
  direction: 'asc' | 'desc';
}
```

### GridConfig

Configure grid layout, scrolling behavior, and row identification.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `checkboxColumnWidth` | `number` | `48` | Width of the checkbox column in pixels |
| `defaultColumnWidth` | `number` | `150` | Default column width when not specified |
| `minColumnWidth` | `number` | `80` | Minimum column width |
| `cellPadding` | `string` | `"p-3"` | Cell padding className |
| `stickyHeaderZIndex` | `number` | `10` | Z-index for sticky header |
| `maxHeight` | `string` | - | Maximum height before vertical scroll (e.g., `"400px"`, `"50vh"`) |
| `height` | `string` | - | Fixed height of grid body (takes precedence over `maxHeight`) |
| `minHeight` | `string` | - | Minimum height to maintain during loading |
| `styledScrollbar` | `boolean` | `true` | Enable custom scrollbar styling |
| `rowIdKey` | `string` | `"id"` | Property key for row identification |
| `skeletonRows` | `number` | - | Number of skeleton rows during loading (defaults to `defaultPageSize` or 5) |

#### GridConfig Example

```tsx
<ElegantGrid
  headers={headers}
  totalCount={data.length}
  config={{
    maxHeight: '500px',
    minHeight: '500px',
    rowIdKey: 'userId',        // Use 'userId' instead of 'id' for row identification
    skeletonRows: 10,          // Show 10 skeleton rows during loading
    checkboxColumnWidth: 56,   // Wider checkbox column
    cellPadding: 'p-4',        // Larger cell padding
  }}
>
  {/* rows */}
</ElegantGrid>
```

### PagerOptions

| Property | Type | Description |
|----------|------|-------------|
| `onQueryChange` | `(query: { offset: number; limit: number }) => void` | Called when page changes |
| `onRefresh` | `() => void` | Called when refresh button clicked |
| `defaultPageSize` | `number` | Initial page size (default: `25`) |
| `pageSizeOptions` | `number[]` | Available page sizes (default: `[10, 25, 50, 100]`) |
| `labels` | `PagerLabels` | Custom labels for internationalization |

### PagerLabels (i18n)

Customize pagination text for different languages.

```ts
interface PagerLabels {
  /** Custom function to format "Showing X-Y of Z" text */
  showingText?: (start: number, end: number, total: number) => string;
  /** Label for rows per page selector (default: "Rows:") */
  rowsLabel?: string;
  /** Label for jump to page input (default: "Go to:") */
  goToLabel?: string;
}
```

#### i18n Example (German)

```tsx
<ElegantGrid
  headers={headers}
  totalCount={data.length}
  pagerOptions={{
    onQueryChange: handleQueryChange,
    defaultPageSize: 25,
    labels: {
      showingText: (start, end, total) => `Zeige ${start}-${end} von ${total}`,
      rowsLabel: 'Zeilen:',
      goToLabel: 'Gehe zu:',
    },
  }}
>
  {/* rows */}
</ElegantGrid>
```

#### i18n Example (Japanese)

```tsx
pagerOptions={{
  onQueryChange: handleQueryChange,
  labels: {
    showingText: (start, end, total) => `${total}件中 ${start}-${end}件を表示`,
    rowsLabel: '表示件数:',
    goToLabel: 'ページ:',
  },
}}
```

### EmptyStateConfig

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Empty state title |
| `description` | `string` | Optional description text |
| `icon` | `ReactNode` | Custom icon component |
| `action` | `ReactNode` | Action button or link |

### ElegantGrid.Row Props

Extends `React.HTMLAttributes<HTMLDivElement>` - supports all native div attributes including `onClick`, `style`, `data-*`, etc.

| Property | Type | Description |
|----------|------|-------------|
| `children` | `ReactNode` | Row cells |
| `data` | `any` | Row data (passed to selection callback) |
| `selectable` | `boolean` | Show selection checkbox |
| `className` | `string` | Additional CSS classes |
| `onClick` | `(e: MouseEvent) => void` | Native click handler |
| `style` | `CSSProperties` | Inline styles |
| `data-*` | `string` | Data attributes |

#### Spread Props Example

```tsx
<ElegantGrid.Row
  data={item}
  selectable
  onClick={() => handleRowClick(item.id)}
  onDoubleClick={() => handleRowDoubleClick(item.id)}
  data-testid={`row-${item.id}`}
  style={{ cursor: 'pointer' }}
  aria-label={`Row for ${item.name}`}
>
  <ElegantGrid.Cell>{item.name}</ElegantGrid.Cell>
  <ElegantGrid.Cell>{item.email}</ElegantGrid.Cell>
</ElegantGrid.Row>
```

### ElegantGrid.Cell Props

Extends `React.HTMLAttributes<HTMLDivElement>` - supports all native div attributes.

| Property | Type | Description |
|----------|------|-------------|
| `children` | `ReactNode` | Cell content |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |
| `className` | `string` | Additional CSS classes |

### ElegantGrid.ActionCell Props

Extends `React.HTMLAttributes<HTMLDivElement>` - supports all native div attributes.

| Property | Type | Description |
|----------|------|-------------|
| `onEdit` | `() => void` | Edit button click handler |
| `onDelete` | `() => void` | Delete button click handler |
| `customActions` | `CustomAction[]` | Additional action buttons |
| `className` | `string` | Additional CSS classes |

#### CustomAction

```ts
interface CustomAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}
```

## Custom Actions Example

```tsx
import { Eye, Download } from 'lucide-react';

<ElegantGrid.ActionCell
  onEdit={() => handleEdit(item.id)}
  onDelete={() => handleDelete(item.id)}
  customActions={[
    {
      icon: <Eye className="h-4 w-4" />,
      label: 'View Details',
      onClick: () => handleView(item.id),
    },
    {
      icon: <Download className="h-4 w-4" />,
      label: 'Download',
      onClick: () => handleDownload(item.id),
    },
  ]}
/>
```

## Empty State Example

```tsx
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

<ElegantGrid
  headers={headers}
  totalCount={0}
  emptyState={{
    title: 'No transactions found',
    description: 'Get started by creating your first transaction.',
    icon: <FileX className="h-12 w-12 text-muted-foreground" />,
    action: (
      <Button onClick={() => setShowCreateModal(true)}>
        Create Transaction
      </Button>
    ),
  }}
>
  {/* rows */}
</ElegantGrid>
```

## Peer Dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "lucide-react": ">=0.400.0"
}
```

> **Note:** All UI components (buttons, checkboxes, inputs, selects, etc.) are bundled with this package.
> You don't need Tailwind CSS or shadcn/ui installed in your project.

## TypeScript Exports

```tsx
// Components & Types
import {
  ElegantGrid,
  type Header,
  type SortOrder,
  type PagerOptions,
  type PagerLabels,
  type EmptyStateConfig,
  type GridConfig,
  type ResolvedGridConfig,
  type ElegantGridProps,
  type ElegantGridRowProps,
  type ElegantGridCellProps,
  type ElegantGridActionCellProps,
  type GridContextValue,
  DEFAULT_GRID_CONFIG,
} from '@andreyfedkovich/elegant-grid';

// Styles (import once in your app entry point)
import '@andreyfedkovich/elegant-grid/styles.css';
```

## License

MIT © [Andrey Fedkovich](https://github.com/andreyfedkovich)
