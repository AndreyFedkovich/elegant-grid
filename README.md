# @andreyfedkovich/elegant-grid

A premium React data grid with compound components, built on Tailwind CSS.

[![npm version](https://badge.fury.io/js/%40andreyfedkovich%2Felegant-grid.svg)](https://www.npmjs.com/package/@andreyfedkovich/elegant-grid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🧩 **Compound Component API** - Intuitive `ElegantGrid.Row`, `ElegantGrid.Cell`, `ElegantGrid.ActionCell` pattern
- 📐 **CSS Grid Layout** - Modern div-based layout (not tables)
- ☑️ **Multi-row Selection** - Checkboxes with select-all support
- 🔀 **Sortable Columns** - Click headers to sort (asc → desc → none)
- ↔️ **Column Resizing** - Drag column borders to resize
- 📄 **Full Pagination** - Page size selector, jump-to-page, refresh button
- 💀 **Skeleton Loading** - Built-in loading states
- 📭 **Empty State** - Customizable empty state with icon and action
- 🎨 **Custom Cells** - Full control over cell rendering
- 📘 **TypeScript-first** - Complete type definitions

## Installation

```bash
npm install @andreyfedkovich/elegant-grid
```

## Quick Start

```tsx
import { ElegantGrid } from '@andreyfedkovich/elegant-grid';

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

## Complete Example

Here's a full-featured example showing all capabilities:

```tsx
import { useState } from 'react';
import { ElegantGrid, type Header, type SortOrder } from '@andreyfedkovich/elegant-grid';
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
| `children` | `ReactNode` | Grid rows |
| `className` | `string` | Additional CSS classes |

### SortOrder

```ts
interface SortOrder {
  key: string;
  direction: 'asc' | 'desc';
}
```

### PagerOptions

| Property | Type | Description |
|----------|------|-------------|
| `onQueryChange` | `(query: { offset: number; limit: number }) => void` | Called when page changes |
| `onRefresh` | `() => void` | Called when refresh button clicked |
| `defaultPageSize` | `number` | Initial page size (default: `25`) |
| `pageSizeOptions` | `number[]` | Available page sizes (default: `[10, 25, 50, 100]`) |

### EmptyStateConfig

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Empty state title |
| `description` | `string` | Optional description text |
| `icon` | `ReactNode` | Custom icon component |
| `action` | `ReactNode` | Action button or link |

### ElegantGrid.Row Props

| Property | Type | Description |
|----------|------|-------------|
| `children` | `ReactNode` | Row cells |
| `data` | `any` | Row data (passed to selection callback) |
| `selectable` | `boolean` | Show selection checkbox |
| `className` | `string` | Additional CSS classes |

### ElegantGrid.Cell Props

| Property | Type | Description |
|----------|------|-------------|
| `children` | `ReactNode` | Cell content |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |
| `className` | `string` | Additional CSS classes |

### ElegantGrid.ActionCell Props

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
  "tailwindcss": ">=3.0.0",
  "lucide-react": ">=0.400.0"
}
```

This package also requires the following [shadcn/ui](https://ui.shadcn.com/) components:
- `checkbox`
- `button`
- `input`
- `select`
- `skeleton`
- `tooltip`

## TypeScript Exports

```ts
import {
  ElegantGrid,
  type Header,
  type SortOrder,
  type PagerOptions,
  type EmptyStateConfig,
  type ElegantGridProps,
  type ElegantGridRowProps,
  type ElegantGridCellProps,
  type ElegantGridActionCellProps,
  type GridContextValue,
} from '@andreyfedkovich/elegant-grid';
```

## License

MIT © [Andrey Fedkovich](https://github.com/andreyfedkovich)
