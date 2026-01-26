

## Refactor: Use `children` Instead of `render` Prop for Custom Header Content

### Overview

Replace the `render` prop pattern with a more idiomatic React `children` pattern for custom header content. When `children` are provided, they take precedence over the `label` text.

---

### API Change

**Current (render prop):**
```tsx
<ElegantGrid.Header 
  dataKey="status" 
  label="Status" 
  minWidth={100}
  render={() => (
    <span className="flex items-center gap-1.5">
      <Circle className="h-2.5 w-2.5 fill-current" />
      Status
    </span>
  )}
/>
```

**New (children):**
```tsx
<ElegantGrid.Header 
  dataKey="status" 
  label="Status" 
  minWidth={100}
>
  <span className="flex items-center gap-1.5">
    <Circle className="h-2.5 w-2.5 fill-current" />
    Status
  </span>
</ElegantGrid.Header>
```

---

### Benefits

1. **More Idiomatic React** - Using children is the standard React pattern for custom content
2. **Cleaner Syntax** - No function wrapper needed
3. **Better DX** - JSX content is more readable inline
4. **Consistent** - Matches how other React component libraries work

---

### Files to Modify

#### 1. `src/components/ElegantGrid/ElegantGridHeaders.tsx`

Update the interface to accept `children` instead of `render`:

```tsx
export interface ElegantGridHeaderProps {
  dataKey: string;
  label: string;
  sortable?: boolean;
  resizable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  /** Custom content for the header (takes precedence over label) */
  children?: React.ReactNode;
}

export function ElegantGridHeaderComponent(_props: ElegantGridHeaderProps) {
  return null;
}
```

---

#### 2. `src/components/ElegantGrid/types.ts`

Update the `Header` interface to store custom content:

```tsx
export interface Header {
  key: string;
  label: string;
  sortable?: boolean;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
  /** Custom content for the header (takes precedence over label) */
  customContent?: React.ReactNode;  // Renamed from render
}
```

---

#### 3. `src/components/ElegantGrid/ElegantGrid.tsx`

Update extraction to capture `children` instead of `render`:

```tsx
// In extractHeadersFromChildren function
headers.push({
  key: props.dataKey,
  label: props.label,
  sortable: props.sortable,
  resizable: props.resizable,
  minWidth: props.minWidth,
  width: props.width,
  align: props.align,
  customContent: props.children,  // Changed from render
});
```

---

#### 4. `src/components/ElegantGrid/ElegantGridHeader.tsx`

Update HeaderCell to render custom content:

```tsx
// In HeaderCellProps interface
header: { 
  key: string; 
  label: string; 
  sortable?: boolean; 
  resizable?: boolean; 
  align?: string; 
  customContent?: React.ReactNode  // Changed from render
};

// In HeaderCell component
<span className="truncate">
  {header.customContent ?? header.label}
</span>
```

---

#### 5. `src/pages/Index.tsx`

Update demo to use the new syntax:

```tsx
<ElegantGrid.Header 
  dataKey="status" 
  label="Status" 
  minWidth={100}
>
  <span className="flex items-center gap-1.5">
    <Circle className="h-2.5 w-2.5 fill-current" />
    Status
  </span>
</ElegantGrid.Header>
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `ElegantGridHeaders.tsx` | Replace `render` prop with `children` in interface |
| `types.ts` | Replace `render?: () => ReactNode` with `customContent?: ReactNode` |
| `ElegantGrid.tsx` | Extract `children` instead of `render` in extraction logic |
| `ElegantGridHeader.tsx` | Render `customContent` instead of calling `render()` |
| `Index.tsx` | Update demo to use children pattern |

