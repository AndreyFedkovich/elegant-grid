
## Fix: Extra Divider with Custom Cells in Composition Headers

### Root Cause Analysis

The issue is that custom cell components like `StatusBadge` render their own container div with `border-r border-border` styling, but they **lack the `last:border-r-0` rule** that `ElegantGrid.Cell` uses to remove the right border from the last cell.

**Current `StatusBadge` (in Index.tsx):**
```tsx
function StatusBadge({ status }: { status: string }) {
  return (
    <div className="flex items-center p-3 border-r border-border">
      <Badge variant={variant}>{status}</Badge>
    </div>
  );
}
```

**Current `ElegantGrid.Cell`:**
```tsx
<div className="flex items-center p-3 text-sm border-r border-border last:border-r-0 min-w-0">
```

The `last:border-r-0` Tailwind utility only works when the element is the last child, which `StatusBadge` IS - but it doesn't have this rule.

---

### Solution Options

#### Option A: Fix the Demo (Recommended for Immediate Fix)

Update `StatusBadge` and `FundCell` custom components in `Index.tsx` to include `last:border-r-0`:

```tsx
function StatusBadge({ status }: { status: string }) {
  return (
    <div className="flex items-center p-3 border-r border-border last:border-r-0">
      <Badge variant={variant}>{status}</Badge>
    </div>
  );
}

function FundCell({ fund }: { fund: string }) {
  return (
    <div className="flex items-center gap-2 p-3 border-r border-border last:border-r-0">
      {/* ... */}
    </div>
  );
}
```

#### Option B: Wrap Custom Content in ElegantGrid.Cell (Best Practice)

Update the demo to use `ElegantGrid.Cell` as a wrapper for custom content:

```tsx
<ElegantGrid.Row key={tx.id} data={tx}>
  <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
  <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
  <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
  <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
  <ElegantGrid.Cell align="right" className="font-mono">
    {formatAmount(tx.amount)}
  </ElegantGrid.Cell>
  <ElegantGrid.Cell>
    <StatusBadge status={tx.status} />
  </ElegantGrid.Cell>
</ElegantGrid.Row>
```

This requires updating `StatusBadge` and `FundCell` to remove their own padding/border styling since `ElegantGrid.Cell` provides it.

---

### Recommended Implementation

I recommend **Option B** as the architectural best practice, which aligns with the existing memory note about alignment and border logic:

> Custom cell content (avatars, badges) must be wrapped in `ElegantGrid.Cell` rather than replacing it to preserve the grid's internal border logic.

---

### Files to Modify

#### `src/pages/Index.tsx`

1. **Update `FundCell`** - Remove container styling, just render content:
```tsx
function FundCell({ fund }: { fund: string }) {
  const initials = fund.split(' ').map(w => w[0]).join('').slice(0, 2);
  const isExternal = fund === 'External';
  
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7">
        <AvatarFallback className={isExternal ? 'bg-muted text-muted-foreground text-xs' : 'bg-primary/10 text-primary text-xs'}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm truncate">{fund}</span>
    </div>
  );
}
```

2. **Update `StatusBadge`** - Remove container styling:
```tsx
function StatusBadge({ status }: { status: string }) {
  const variant = status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive';
  
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}
```

3. **Update composition-based headers demo** - Wrap custom content in `ElegantGrid.Cell`:
```tsx
{basicData.map((tx) => (
  <ElegantGrid.Row key={tx.id} data={tx}>
    <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
    <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
    <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
    <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
    <ElegantGrid.Cell align="right" className="font-mono">
      {formatAmount(tx.amount)}
    </ElegantGrid.Cell>
    <ElegantGrid.Cell>
      <StatusBadge status={tx.status} />
    </ElegantGrid.Cell>
  </ElegantGrid.Row>
))}
```

4. **Update Full Featured demo** - Same pattern:
```tsx
<ElegantGrid.Row key={tx.id} data={tx}>
  <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
  <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
  <ElegantGrid.Cell>
    <FundCell fund={tx.from} />
  </ElegantGrid.Cell>
  <ElegantGrid.Cell>
    <FundCell fund={tx.to} />
  </ElegantGrid.Cell>
  <ElegantGrid.Cell align="right" className="font-mono">
    {formatAmount(tx.amount)}
  </ElegantGrid.Cell>
  <ElegantGrid.Cell>
    <StatusBadge status={tx.status} />
  </ElegantGrid.Cell>
  <ElegantGrid.ActionCell
    onEdit={() => handleEdit(tx)}
    onDelete={() => handleDelete(tx)}
  />
</ElegantGrid.Row>
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove container styling from `FundCell` and `StatusBadge`; wrap custom components in `ElegantGrid.Cell` in all demo sections |

This approach:
- Fixes the extra divider issue
- Follows the established pattern for custom cell content
- Ensures consistent border and padding logic across all cells
- Is backward compatible with existing demos using custom cells
