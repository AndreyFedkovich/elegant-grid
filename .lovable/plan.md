

## Implement Composition-Based Headers with Clone & Extract Pattern

### Overview

This plan introduces a new composition-based API for defining headers while maintaining full backward compatibility with the existing props-based approach. The Clone & Extract pattern will parse child components to extract header configuration before rendering.

---

### New API Design

**Current Approach (remains supported):**
```tsx
<ElegantGrid headers={[{ key: 'name', label: 'Name', sortable: true }]}>
  <ElegantGrid.Row data={item}>
    <ElegantGrid.Cell>{item.name}</ElegantGrid.Cell>
  </ElegantGrid.Row>
</ElegantGrid>
```

**New Composition Approach:**
```tsx
<ElegantGrid totalCount={100}>
  <ElegantGrid.Headers>
    <ElegantGrid.Header 
      dataKey="name" 
      label="Name" 
      sortable 
      minWidth={150}
    />
    <ElegantGrid.Header 
      dataKey="status" 
      label="Status"
      render={() => <><Icon /> Status</>}  
    />
  </ElegantGrid.Headers>
  
  <ElegantGrid.Row data={item}>
    <ElegantGrid.Cell>{item.name}</ElegantGrid.Cell>
  </ElegantGrid.Row>
</ElegantGrid>
```

---

### Architecture: Clone & Extract Pattern

```text
+----------------------------------+
|         ElegantGridRoot          |
+----------------------------------+
              |
              v
+----------------------------------+
|   extractHeadersFromChildren()   |  <-- NEW: Parse children before render
|   - Find ElegantGrid.Headers     |
|   - Extract Header props         |
|   - Convert to Header[] format   |
+----------------------------------+
              |
              v
+----------------------------------+
|         GridProvider             |
|   (receives headers as before)   |
+----------------------------------+
              |
       +------+------+
       v             v
  HeaderRow       Rows
  (renders)     (renders)
```

---

### Files to Create

#### 1. `src/components/ElegantGrid/ElegantGridHeaders.tsx` (NEW)

Defines the container and individual header components:

```tsx
// Container component - acts as a marker for extraction
export function ElegantGridHeaders({ children }: { children: React.ReactNode }) {
  // This component doesn't render anything directly
  // Its children are extracted and processed by the parent
  return null;
}

// Individual header component - holds configuration
export interface ElegantGridHeaderProps {
  dataKey: string;           // Column identifier (maps to Header.key)
  label: string;             // Display text
  sortable?: boolean;
  resizable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: () => React.ReactNode;  // Custom header content
}

export function ElegantGridHeaderComponent(props: ElegantGridHeaderProps) {
  // This component doesn't render - it's a configuration holder
  return null;
}
```

---

### Files to Modify

#### 2. `src/components/ElegantGrid/types.ts`

Add new types and extend existing Header interface:

```tsx
// Extend Header interface
export interface Header {
  key: string;
  label: string;
  sortable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
  render?: () => React.ReactNode;  // NEW: Custom render function
}

// New type for composition-based header props
export interface ElegantGridHeaderProps {
  dataKey: string;
  label: string;
  sortable?: boolean;
  resizable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: () => React.ReactNode;
}

// Make headers optional in ElegantGridProps
export interface ElegantGridProps {
  headers?: Header[];  // NOW OPTIONAL when using composition
  // ... rest unchanged
}
```

---

#### 3. `src/components/ElegantGrid/ElegantGrid.tsx`

Implement the Clone & Extract logic:

```tsx
import { ElegantGridHeaders, ElegantGridHeaderComponent } from './ElegantGridHeaders';

// Helper function to extract headers from composition children
function extractHeadersFromChildren(children: React.ReactNode): {
  headers: Header[];
  otherChildren: React.ReactNode;
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
            render: props.render,
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
  headers: propHeaders,  // Renamed to distinguish
  children,
  // ... other props
}: ElegantGridProps) {
  // Extract headers from composition if not provided via props
  const { headers: compositionHeaders, otherChildren } = useMemo(
    () => extractHeadersFromChildren(children),
    [children]
  );

  // Props take precedence, then composition, then error
  const headers = propHeaders ?? compositionHeaders;
  
  if (!headers || headers.length === 0) {
    console.warn('ElegantGrid: No headers provided via props or composition');
    return null;
  }

  // Use otherChildren (rows) for rendering
  const rowChildren = propHeaders ? children : otherChildren;
  
  // ... rest of component logic unchanged, using `headers` and `rowChildren`
}
```

---

#### 4. `src/components/ElegantGrid/ElegantGridHeader.tsx`

Support custom render function:

```tsx
// In HeaderCell component, update label rendering:
<span className="truncate">
  {header.render ? header.render() : header.label}
</span>
```

---

#### 5. `src/components/ElegantGrid/index.ts`

Export new components:

```tsx
export { ElegantGridHeaders, ElegantGridHeaderComponent } from './ElegantGridHeaders';
export type { ElegantGridHeaderProps } from './types';

// Update compound component
export const ElegantGrid = Object.assign(ElegantGridRoot, {
  Row: ElegantGridRow,
  Cell: ElegantGridCell,
  ActionCell: ElegantGridActionCell,
  Headers: ElegantGridHeaders,           // NEW
  Header: ElegantGridHeaderComponent,    // NEW
});
```

---

### How Width Synchronization Works

The Clone & Extract pattern **completely solves** the width synchronization problem:

1. **Extraction Phase**: Before any rendering, `extractHeadersFromChildren()` scans the component tree
2. **Conversion**: Each `<ElegantGrid.Header>` is converted to a standard `Header` object
3. **Single Source of Truth**: The extracted `Header[]` array flows into `GridProvider` exactly as before
4. **Context Distribution**: `columnWidths` state is derived from headers and shared via context
5. **Synchronized Rendering**: Both header row and data rows consume the same `columnWidths` from context

The composition components (`Headers`, `Header`) **never render** - they're pure configuration holders that get parsed before the render tree is built.

---

### Backward Compatibility

| Usage Pattern | Support |
|---------------|---------|
| `headers` prop only (current) | Full support, unchanged |
| Composition only (new) | Full support |
| Both provided | `headers` prop takes precedence |

---

### Demo Update

Add a new demo section showing the composition API:

```tsx
<DemoSection
  id="composition-headers"
  title="Composition-Based Headers"
  description="Define headers using JSX composition with ElegantGrid.Headers and ElegantGrid.Header"
>
  <ElegantGrid
    totalCount={3}
    onSort={setSortOrder}
  >
    <ElegantGrid.Headers>
      <ElegantGrid.Header dataKey="date" label="Date" sortable minWidth={120} />
      <ElegantGrid.Header dataKey="type" label="Type" minWidth={100} />
      <ElegantGrid.Header 
        dataKey="status" 
        label="Status" 
        render={() => (
          <span className="flex items-center gap-1">
            <CircleIcon className="h-3 w-3" /> Status
          </span>
        )}
      />
    </ElegantGrid.Headers>
    
    {sampleTransactions.slice(0, 3).map((t) => (
      <ElegantGrid.Row key={t.id} data={t}>
        <ElegantGrid.Cell>{formatDate(t.date)}</ElegantGrid.Cell>
        <ElegantGrid.Cell>{t.type}</ElegantGrid.Cell>
        <StatusBadge status={t.status} />
      </ElegantGrid.Row>
    ))}
  </ElegantGrid>
</DemoSection>
```

---

### Summary of Changes

| File | Action | Description |
|------|--------|-------------|
| `ElegantGridHeaders.tsx` | Create | Container and Header marker components |
| `types.ts` | Modify | Add `render` to Header, add ElegantGridHeaderProps, make `headers` optional |
| `ElegantGrid.tsx` | Modify | Add extractHeadersFromChildren logic |
| `ElegantGridHeader.tsx` | Modify | Support custom render function |
| `index.ts` | Modify | Export new components and update compound pattern |
| `Index.tsx` | Modify | Add composition-based demo section |

