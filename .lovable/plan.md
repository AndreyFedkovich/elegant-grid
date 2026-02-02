

## Fix: Skeleton Column Widths Not Synced After Resize

### Problem

When a column is resized, the skeleton loading view shows misaligned separators because it uses the **initial** column widths instead of the **current** resized widths from context.

**Root Cause:**

In `ElegantGrid.tsx` (line 188-193):
```tsx
<ElegantGridSkeleton
  columns={headers.length}
  rows={skeletonRowCount}
  showSelection={showSelection}
  columnWidths={initialColumnWidths}  // ← Uses initial widths, not current
/>
```

The `initialColumnWidths` is calculated once from the headers and never updates when columns are resized. Meanwhile, the actual resized widths are stored in the `GridContext`.

### Solution

Modify `ElegantGridSkeleton` to use `columnWidths` directly from the `GridContext` instead of receiving them as a prop. Since the skeleton is always rendered inside the `GridProvider`, it has access to the context.

---

### File Changes

#### 1. `src/components/ElegantGrid/ElegantGridSkeleton.tsx`

**Before:**
```tsx
interface ElegantGridSkeletonProps {
  columns: number;
  rows?: number;
  showSelection?: boolean;
  columnWidths: number[];
}

export function ElegantGridSkeleton({
  columns,
  rows = 5,
  showSelection = true,
  columnWidths,
}: ElegantGridSkeletonProps) {
  // Try to get config from context, fallback to defaults if not available
  let checkboxColumnWidth = 48;
  let cellPadding = 'p-3';
  
  try {
    const context = useGridContext();
    checkboxColumnWidth = context.config.checkboxColumnWidth;
    cellPadding = context.config.cellPadding;
  } catch {
    // Outside of context, use defaults
  }
```

**After:**
```tsx
interface ElegantGridSkeletonProps {
  columns: number;
  rows?: number;
  showSelection?: boolean;
}

export function ElegantGridSkeleton({
  columns,
  rows = 5,
  showSelection = true,
}: ElegantGridSkeletonProps) {
  // Get widths and config from context (skeleton is always rendered inside GridProvider)
  const { columnWidths, config } = useGridContext();
  const { checkboxColumnWidth, cellPadding } = config;
```

- Remove `columnWidths` from props interface
- Get `columnWidths` directly from context alongside `config`
- Simplify by removing the try/catch (skeleton is always inside GridProvider)

---

#### 2. `src/components/ElegantGrid/ElegantGrid.tsx`

**Before (line 188-193):**
```tsx
<ElegantGridSkeleton
  columns={headers.length}
  rows={skeletonRowCount}
  showSelection={showSelection}
  columnWidths={initialColumnWidths}
/>
```

**After:**
```tsx
<ElegantGridSkeleton
  columns={headers.length}
  rows={skeletonRowCount}
  showSelection={showSelection}
/>
```

- Remove the `columnWidths` prop since skeleton now gets it from context

---

### Why This Works

| Before | After |
|--------|-------|
| Skeleton receives `initialColumnWidths` (static, computed once) | Skeleton reads `columnWidths` from context (dynamic, updates on resize) |
| Resize changes context but skeleton doesn't see it | Skeleton re-renders with current widths when context updates |
| Header and skeleton widths diverge after resize | Header and skeleton always use same width source |

### Visual Result

After this fix, when a column is resized and then loading is triggered:
- The header columns will have the resized widths
- The skeleton rows will use the same widths from context
- The separators will align perfectly

