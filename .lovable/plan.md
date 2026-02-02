

## Fix: Column Resizing Triggering Sort

### Problem

When resizing a column, the sort handler is also being triggered. This happens because:

1. The resize handle uses `onMouseDown` to start resizing
2. The parent header cell uses `onClick` for sorting
3. `stopPropagation()` on `mousedown` does **not** prevent the subsequent `click` event from firing

### Solution

Track whether a resize operation occurred and skip the sort if it did. We'll use a ref to track the resize state and add an `onClick` handler to the resize element that stops propagation.

### File to Modify

**`src/components/ElegantGrid/ElegantGridHeader.tsx`**

#### Change 1: Add click handler to resize element (Line 152-159)

Add `onClick` with `stopPropagation()` to prevent the click from bubbling to the parent:

```tsx
{header.resizable !== false && (
  <div
    className="group absolute top-0 right-0 h-full w-3 translate-x-1/2 cursor-col-resize select-none z-10 flex items-center justify-center"
    onMouseDown={handleResizeStart}
    onClick={(e) => e.stopPropagation()}
  >
    <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
)}
```

### Why This Works

| Event Sequence | Before Fix | After Fix |
|----------------|------------|-----------|
| `mousedown` on resize handle | Starts resize, stops propagation | Same |
| `mouseup` anywhere | Ends resize | Same |
| `click` on resize handle | Bubbles to parent → triggers sort | **Stopped** - doesn't reach parent |

### Alternative Considered

We could also track `isResizing` state and check it in the `onSort` handler, but adding `onClick` with `stopPropagation()` to the resize handle is simpler and more direct - it prevents the event from ever reaching the parent.

