

## Update README with New Features

### Overview
Add documentation for the composition-based headers API, which allows defining grid columns using JSX components instead of the traditional `headers` prop array.

---

### Changes to README.md

#### 1. Update Features List (Line 10-24)

Add a new feature bullet:

```markdown
- 🧩 **Composition-Based Headers** - Define columns with JSX using `ElegantGrid.Headers` and `ElegantGrid.Header`
```

#### 2. Add New Section: "Composition-Based Headers" (After "Complete Example", before "API Reference")

Insert a new section around line 245:

```markdown
## Composition-Based Headers

Instead of passing a `headers` prop array, you can define columns using JSX composition:

### Basic Usage

```tsx
<ElegantGrid totalCount={data.length}>
  <ElegantGrid.Headers>
    <ElegantGrid.Header dataKey="name" label="Name" sortable minWidth={150} />
    <ElegantGrid.Header dataKey="email" label="Email" minWidth={200} />
    <ElegantGrid.Header dataKey="status" label="Status" align="center" />
  </ElegantGrid.Headers>

  {data.map((item) => (
    <ElegantGrid.Row key={item.id} data={item}>
      <ElegantGrid.Cell>{item.name}</ElegantGrid.Cell>
      <ElegantGrid.Cell>{item.email}</ElegantGrid.Cell>
      <ElegantGrid.Cell align="center">{item.status}</ElegantGrid.Cell>
    </ElegantGrid.Row>
  ))}
</ElegantGrid>
```

### Custom Header Content

Use `children` for custom JSX in header cells:

```tsx
<ElegantGrid.Header dataKey="status" label="Status" minWidth={100}>
  <span className="flex items-center gap-1.5">
    <Circle className="h-2.5 w-2.5 fill-current" />
    Status
  </span>
</ElegantGrid.Header>
```

### Fill Column

Use `fill` to make a column expand and occupy remaining space:

```tsx
<ElegantGrid.Header dataKey="description" label="Description" fill />
```

### ElegantGrid.Header Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dataKey` | `string` | *required* | Column identifier (maps to Header.key) |
| `label` | `string` | *required* | Display text |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `resizable` | `boolean` | `true` | Enable column resizing |
| `minWidth` | `number` | `100` | Minimum column width in pixels |
| `width` | `number` | `150` | Initial column width in pixels |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `fill` | `boolean` | `false` | Expand to fill remaining space |
| `children` | `ReactNode` | - | Custom header content (takes precedence over label) |

> **Note:** If both `headers` prop and `<ElegantGrid.Headers>` are provided, the prop takes precedence.
```

#### 3. Update Header Interface Table (Line 248-258)

Add `fill` property to the Header interface documentation:

```markdown
| `fill` | `boolean` | `false` | Expand column to fill remaining space |
```

Also add `customContent`:

```markdown
| `customContent` | `ReactNode` | - | Custom content for the header cell |
```

#### 4. Update TypeScript Exports Section (Line 511-534)

Add the new exports:

```tsx
import {
  ElegantGrid,
  // Components for composition API
  ElegantGridHeaders,
  ElegantGridHeaderComponent,
  // Types
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
  type ElegantGridHeaderProps,  // NEW
  type GridContextValue,
  DEFAULT_GRID_CONFIG,
} from '@andreyfedkovich/elegant-grid';
```

---

### Summary of Additions

| Section | Change |
|---------|--------|
| Features list | Add composition-based headers bullet point |
| New section | "Composition-Based Headers" with usage examples |
| Header Interface | Add `fill` and `customContent` properties |
| TypeScript Exports | Add `ElegantGridHeaderProps` type, `ElegantGridHeaders`, `ElegantGridHeaderComponent` |

---

### Technical Notes

- The composition API uses a "Clone & Extract" pattern where `ElegantGrid.Headers` children are parsed at render time to build a `Header[]` array
- The `fill` property uses `minmax(width, 1fr)` in the CSS Grid template for flexible expansion
- Both approaches (prop-based and composition-based) are fully interchangeable and feature-equivalent

