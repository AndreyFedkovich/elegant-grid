

## Fix: Remove Extra Border at Grid Bottom

### Problem

The grid shows a double border at the bottom because:
1. Every row has `border-b border-border` (bottom border)
2. The grid container has a border around all sides

When the last row's bottom border meets the container's bottom border, it creates a visually thicker line.

---

### Solution

Remove the bottom border from the last row using the `last:border-b-0` utility.

---

### File to Modify

**`src/components/ElegantGrid/ElegantGridRow.tsx`**

Update line 45 to add `last:border-b-0`:

**Current:**
```tsx
className={cn(
  'grid border-b border-border transition-colors duration-150',
  isSelected ? 'bg-primary/5' : 'bg-background hover:bg-muted/30',
  className
)}
```

**New:**
```tsx
className={cn(
  'grid border-b border-border last:border-b-0 transition-colors duration-150',
  isSelected ? 'bg-primary/5' : 'bg-background hover:bg-muted/30',
  className
)}
```

---

### Also Add CSS Rule

**`src/components/ElegantGrid/styles.css`**

Add the `last:border-b-0` pseudo-class variant near line 410 (where `last:border-r-0` is defined):

```css
.elegant-grid-root .last\:border-b-0:last-child { border-bottom-width: 0; }
```

---

### Summary

| File | Change |
|------|--------|
| `ElegantGridRow.tsx` | Add `last:border-b-0` to row className |
| `styles.css` | Add CSS rule for `last:border-b-0` pseudo-class |

This ensures the last row doesn't have a bottom border, preventing the double-border appearance at the grid's bottom edge.

