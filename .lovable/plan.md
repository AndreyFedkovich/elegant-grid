
## Fix: Make Last Column Fill Remaining Width in Composition Headers

### Problem

In the Full Featured Grid, the "Actions" column fills the remaining width of the grid. However, in the Composition-Based Headers demo, the last column ("Status") has a fixed width and leaves empty space to the right.

### Root Cause

The grid template columns are built using fixed pixel widths for all columns:

```tsx
const gridTemplateColumns = [
  showSelection ? `${config.checkboxColumnWidth}px` : '',
  ...columnWidths.map((w) => `${w}px`),  // All columns get fixed widths
]
```

There's no mechanism to make a column flex to fill remaining space.

---

### Solution

Add a `fill` property to the `Header` interface that tells the grid to use `minmax(width, 1fr)` instead of a fixed pixel width for that column.

---

### Files to Modify

#### 1. `src/components/ElegantGrid/types.ts`

Add `fill` property to the `Header` interface:

```tsx
export interface Header {
  key: string;
  label: string;
  sortable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
  customContent?: React.ReactNode;
  /** If true, this column will expand to fill remaining space (uses 1fr) */
  fill?: boolean;
}
```

---

#### 2. `src/components/ElegantGrid/ElegantGridHeaders.tsx`

Add `fill` to the props interface:

```tsx
export interface ElegantGridHeaderProps {
  dataKey: string;
  label: string;
  sortable?: boolean;
  resizable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  /** If true, this column will expand to fill remaining space */
  fill?: boolean;
  children?: React.ReactNode;
}
```

---

#### 3. `src/components/ElegantGrid/ElegantGrid.tsx`

Extract `fill` property when parsing composition headers:

```tsx
headers.push({
  key: props.dataKey,
  label: props.label,
  sortable: props.sortable,
  resizable: props.resizable,
  minWidth: props.minWidth,
  width: props.width,
  align: props.align,
  customContent: props.children,
  fill: props.fill,  // NEW
});
```

---

#### 4. `src/components/ElegantGrid/ElegantGridContext.tsx`

Store and expose `headers` with `fill` info so row/header components can use it to build grid template:

No changes needed - headers are already exposed via context.

---

#### 5. `src/components/ElegantGrid/ElegantGridHeader.tsx`

Update grid template columns to handle `fill`:

```tsx
const gridTemplateColumns = [
  showSelection ? `${config.checkboxColumnWidth}px` : '',
  ...headers.map((header, index) => {
    const width = columnWidths[index];
    if (header.fill) {
      return `minmax(${width}px, 1fr)`;
    }
    return `${width}px`;
  }),
]
  .filter(Boolean)
  .join(' ');
```

---

#### 6. `src/components/ElegantGrid/ElegantGridRow.tsx`

Apply the same grid template logic:

```tsx
const gridTemplateColumns = [
  showSelection ? `${config.checkboxColumnWidth}px` : '',
  ...headers.map((header, index) => {
    const width = columnWidths[index];
    if (header.fill) {
      return `minmax(${width}px, 1fr)`;
    }
    return `${width}px`;
  }),
]
  .filter(Boolean)
  .join(' ');
```

---

#### 7. `src/pages/Index.tsx`

Update the Composition-Based Headers demo to use `fill` on the last column:

```tsx
<ElegantGrid.Header 
  dataKey="status" 
  label="Status" 
  minWidth={100}
  fill  // NEW - makes this column fill remaining space
>
  <span className="flex items-center gap-1.5">
    <Circle className="h-2.5 w-2.5 fill-current" />
    Status
  </span>
</ElegantGrid.Header>
```

---

### API Usage

**Props-based:**
```tsx
const headers: Header[] = [
  { key: 'name', label: 'Name', minWidth: 150 },
  { key: 'status', label: 'Status', minWidth: 100, fill: true },
];
```

**Composition-based:**
```tsx
<ElegantGrid.Headers>
  <ElegantGrid.Header dataKey="name" label="Name" minWidth={150} />
  <ElegantGrid.Header dataKey="status" label="Status" minWidth={100} fill />
</ElegantGrid.Headers>
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `types.ts` | Add `fill?: boolean` to Header interface |
| `ElegantGridHeaders.tsx` | Add `fill?: boolean` to ElegantGridHeaderProps |
| `ElegantGrid.tsx` | Extract `fill` property in composition parsing |
| `ElegantGridHeader.tsx` | Build grid template with `minmax(width, 1fr)` for fill columns |
| `ElegantGridRow.tsx` | Build grid template with `minmax(width, 1fr)` for fill columns |
| `Index.tsx` | Add `fill` to Status header in Composition-Based Headers demo |

This approach:
- Maintains backward compatibility (no existing behavior changes)
- Works with both props-based and composition-based header definitions
- Uses CSS Grid's `minmax()` function for flexible column sizing
- Respects the minimum width while allowing the column to grow
