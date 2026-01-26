import { useState, useCallback } from 'react';
import { ElegantGrid, Header, SortOrder } from '@/components/ElegantGrid';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Package, Github, ExternalLink, Circle } from 'lucide-react';

// Sample data
const sampleTransactions = [
  { id: '1', date: '2025-01-15', type: 'Transfer', from: 'Growth Fund', to: 'Bond Fund', amount: 25000, status: 'completed' },
  { id: '2', date: '2025-01-14', type: 'Deposit', from: 'External', to: 'Growth Fund', amount: 50000, status: 'completed' },
  { id: '3', date: '2025-01-13', type: 'Withdrawal', from: 'Bond Fund', to: 'External', amount: 10000, status: 'pending' },
  { id: '4', date: '2025-01-12', type: 'Transfer', from: 'Index Fund', to: 'Growth Fund', amount: 75000, status: 'completed' },
  { id: '5', date: '2025-01-11', type: 'Deposit', from: 'External', to: 'Index Fund', amount: 100000, status: 'completed' },
  { id: '6', date: '2025-01-10', type: 'Transfer', from: 'Bond Fund', to: 'Index Fund', amount: 30000, status: 'failed' },
  { id: '7', date: '2025-01-09', type: 'Withdrawal', from: 'Growth Fund', to: 'External', amount: 15000, status: 'completed' },
  { id: '8', date: '2025-01-08', type: 'Deposit', from: 'External', to: 'Bond Fund', amount: 45000, status: 'pending' },
  { id: '9', date: '2025-01-07', type: 'Transfer', from: 'Growth Fund', to: 'Index Fund', amount: 55000, status: 'completed' },
  { id: '10', date: '2025-01-06', type: 'Withdrawal', from: 'Index Fund', to: 'External', amount: 20000, status: 'completed' },
  { id: '11', date: '2025-01-05', type: 'Deposit', from: 'External', to: 'Growth Fund', amount: 80000, status: 'pending' },
  { id: '12', date: '2025-01-04', type: 'Transfer', from: 'Bond Fund', to: 'Growth Fund', amount: 35000, status: 'completed' },
  { id: '13', date: '2025-01-03', type: 'Withdrawal', from: 'Growth Fund', to: 'External', amount: 12000, status: 'failed' },
  { id: '14', date: '2025-01-02', type: 'Deposit', from: 'External', to: 'Bond Fund', amount: 90000, status: 'completed' },
  { id: '15', date: '2025-01-01', type: 'Transfer', from: 'Index Fund', to: 'Bond Fund', amount: 40000, status: 'completed' },
];

// Section navigation config
const sections = [
  { id: 'full-featured', label: 'Full Featured' },
  { id: 'composition-headers', label: 'Composition Headers' },
  { id: 'basic', label: 'Basic' },
  { id: 'sorting', label: 'Sorting' },
  { id: 'selection', label: 'Selection' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'custom-cells', label: 'Custom Cells' },
  { id: 'empty-state', label: 'Empty State' },
  { id: 'loading', label: 'Loading' },
  { id: 'i18n', label: 'i18n' },
  { id: 'config', label: 'Config' },
];

// Reusable Demo Section wrapper
function DemoSection({ 
  id, 
  title, 
  description, 
  children 
}: { 
  id: string; 
  title: string; 
  description: string; 
  children: React.ReactNode; 
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="overflow-hidden">
        {children}
      </div>
    </section>
  );
}

// Custom cell components
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

function StatusBadge({ status }: { status: string }) {
  const variant = status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive';
  
  return (
    <div className="flex items-center">
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    </div>
  );
}

// Utility functions
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function Index() {
  // Basic headers (no actions column)
  const basicHeaders: Header[] = [
    { key: 'date', label: 'Date', minWidth: 120 },
    { key: 'type', label: 'Type', minWidth: 100 },
    { key: 'from', label: 'From', minWidth: 150 },
    { key: 'to', label: 'To', minWidth: 150 },
    { key: 'amount', label: 'Amount', minWidth: 120, align: 'right' },
    { key: 'status', label: 'Status', minWidth: 100, fill: true, resizable: false },
  ];

  // Sortable headers
  const sortableHeaders: Header[] = [
    { key: 'date', label: 'Date', sortable: true, minWidth: 120 },
    { key: 'type', label: 'Type', sortable: true, minWidth: 100 },
    { key: 'from', label: 'From', minWidth: 150 },
    { key: 'to', label: 'To', minWidth: 150 },
    { key: 'amount', label: 'Amount', sortable: true, minWidth: 120, align: 'right' },
    { key: 'status', label: 'Status', sortable: true, minWidth: 100, fill: true, resizable: false },
  ];

  // Full headers with actions
  const fullHeaders: Header[] = [
    { key: 'date', label: 'Date', sortable: true, minWidth: 120 },
    { key: 'type', label: 'Type', sortable: true, minWidth: 100 },
    { key: 'from', label: 'From', sortable: true, minWidth: 150 },
    { key: 'to', label: 'To', sortable: true, minWidth: 150 },
    { key: 'amount', label: 'Amount', sortable: true, minWidth: 120, align: 'right' },
    { key: 'status', label: 'Status', sortable: true, minWidth: 120 },
    { key: 'actions', label: 'Actions', minWidth: 100, align: 'right', resizable: false },
  ];

  // State for different demos
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [fullFeaturedSelection, setFullFeaturedSelection] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = useCallback(({ offset, limit }: { offset: number; limit: number }) => {
    console.log('Query changed:', { offset, limit });
    toast.info(`Page changed: offset=${offset}, limit=${limit}`);
  }, []);

  const handleRefresh = useCallback(() => {
    toast.info('Refreshing data...');
    setTimeout(() => toast.success('Data refreshed'), 500);
  }, []);

  const handleEdit = (tx: typeof sampleTransactions[0]) => {
    toast.info(`Edit transaction ${tx.id}`);
  };

  const handleDelete = (tx: typeof sampleTransactions[0]) => {
    toast.error(`Delete transaction ${tx.id}`);
  };

  const basicData = sampleTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">ElegantGrid</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.npmjs.com/package/@andreyfedkovich/elegant-grid"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                npm
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/andreyfedkovich/elegant-grid"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            ElegantGrid Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A composition-first, premium data grid for React. Explore the examples below to see sorting, pagination, custom cells, selection, and more.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <nav className="sticky top-16 z-40 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-3 py-1.5 text-sm font-medium rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Demo Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 0. Full Featured Grid */}
        <DemoSection
          id="full-featured"
          title="Full Featured Grid"
          description="Complete example with sorting, selection, pagination, custom cells, and action buttons."
        >
          <div className="p-3 bg-muted/30">
              <span className="text-sm text-muted-foreground">
                {fullFeaturedSelection.length} transaction(s) selected
              </span>
          </div>
          <ElegantGrid
            headers={fullHeaders}
            totalCount={sampleTransactions.length}
            onSort={setSortOrder}
            onSelectionChange={setFullFeaturedSelection}
            config={{
              maxHeight: '400px',
            }}
            pagerOptions={{
              onQueryChange: handleQueryChange,
              onRefresh: handleRefresh,
              defaultPageSize: 5,
              pageSizeOptions: [5, 10, 15],
            }}
          >
            {sampleTransactions.map((tx) => (
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
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* Composition-Based Headers */}
        <DemoSection
          id="composition-headers"
          title="Composition-Based Headers"
          description="Define headers using JSX composition with ElegantGrid.Headers and ElegantGrid.Header. Supports custom render functions for header content."
        >
          <ElegantGrid
            totalCount={basicData.length}
            onSort={setSortOrder}
          >
            <ElegantGrid.Headers>
              <ElegantGrid.Header dataKey="date" label="Date" sortable minWidth={120} />
              <ElegantGrid.Header dataKey="type" label="Type" sortable minWidth={100} />
              <ElegantGrid.Header dataKey="from" label="From" minWidth={150} />
              <ElegantGrid.Header dataKey="to" label="To" minWidth={150} />
              <ElegantGrid.Header dataKey="amount" label="Amount" minWidth={120} align="right" />
              <ElegantGrid.Header 
                dataKey="status" 
                label="Status" 
                minWidth={100}
                fill
                resizable={false}
              >
                <span className="flex items-center gap-1.5">
                  <Circle className="h-2.5 w-2.5 fill-current" />
                  Status
                </span>
              </ElegantGrid.Header>
            </ElegantGrid.Headers>
            
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
          </ElegantGrid>
        </DemoSection>

        {/* 1. Basic Grid */}
        <DemoSection
          id="basic"
          title="Basic Grid"
          description="Minimal setup with headers and data. No pagination, no selection."
        >
          <ElegantGrid headers={basicHeaders} totalCount={basicData.length}>
            {basicData.map((tx) => (
              <ElegantGrid.Row key={tx.id} data={tx}>
                <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
                <ElegantGrid.Cell align="right" className="font-mono">
                  {formatAmount(tx.amount)}
                </ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.status}</ElegantGrid.Cell>
              </ElegantGrid.Row>
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* 2. Sorting */}
        <DemoSection
          id="sorting"
          title="Sorting"
          description="Click column headers to sort ascending or descending. Uses onSort callback."
        >
          <div className="p-3 bg-muted/30">
            <span className="text-sm text-muted-foreground">
              Current sort:{' '}
              {sortOrder ? (
                <Badge variant="secondary">
                  {sortOrder.key} ({sortOrder.direction})
                </Badge>
              ) : (
                <span className="italic">none</span>
              )}
            </span>
          </div>
          <ElegantGrid 
            headers={sortableHeaders} 
            totalCount={basicData.length}
            onSort={setSortOrder}
          >
            {basicData.map((tx) => (
              <ElegantGrid.Row key={tx.id} data={tx}>
                <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
                <ElegantGrid.Cell align="right" className="font-mono">
                  {formatAmount(tx.amount)}
                </ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.status}</ElegantGrid.Cell>
              </ElegantGrid.Row>
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* 3. Row Selection */}
        <DemoSection
          id="selection"
          title="Row Selection"
          description="Enable onSelectionChange to allow checkbox selection. Select-all in header."
        >
          <div className="p-3 bg-muted/30">
            <span className="text-sm text-muted-foreground">
              Selected:{' '}
              {selectedRows.length > 0 ? (
                <Badge variant="secondary">{selectedRows.length} row(s)</Badge>
              ) : (
                <span className="italic">none</span>
              )}
            </span>
          </div>
          <ElegantGrid 
            headers={basicHeaders} 
            totalCount={basicData.length}
            onSelectionChange={setSelectedRows}
          >
            {basicData.map((tx) => (
              <ElegantGrid.Row key={tx.id} data={tx}>
                <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
                <ElegantGrid.Cell align="right" className="font-mono">
                  {formatAmount(tx.amount)}
                </ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.status}</ElegantGrid.Cell>
              </ElegantGrid.Row>
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* 4. Pagination */}
        <DemoSection
          id="pagination"
          title="Pagination"
          description="Full pager with page size options, jump-to-page, and refresh button."
        >
          <ElegantGrid 
            headers={basicHeaders} 
            totalCount={sampleTransactions.length}
            pagerOptions={{
              onQueryChange: handleQueryChange,
              onRefresh: handleRefresh,
              defaultPageSize: 5,
              pageSizeOptions: [5, 10, 15],
            }}
          >
            {sampleTransactions.slice(0, 5).map((tx) => (
              <ElegantGrid.Row key={tx.id} data={tx}>
                <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
                <ElegantGrid.Cell align="right" className="font-mono">
                  {formatAmount(tx.amount)}
                </ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.status}</ElegantGrid.Cell>
              </ElegantGrid.Row>
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* 5. Custom Cells */}
        <DemoSection
          id="custom-cells"
          title="Custom Cells"
          description="Inject custom components like Avatar, Badge, and action buttons."
        >
          <ElegantGrid 
            headers={fullHeaders} 
            totalCount={basicData.length}
          >
            {basicData.map((tx) => (
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
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* 6. Empty State */}
        <DemoSection
          id="empty-state"
          title="Empty State"
          description="Custom empty state with icon, title, description, and action button."
        >
          <ElegantGrid 
            headers={basicHeaders} 
            totalCount={0}
            emptyState={{
              title: 'No transactions found',
              description: 'There are no transactions matching your criteria.',
              icon: <Package className="h-10 w-10 text-muted-foreground/50" />,
              action: (
                <Button variant="outline" size="sm" onClick={() => toast.info('Create new transaction')}>
                  Create Transaction
                </Button>
              ),
            }}
          >
            {[]}
          </ElegantGrid>
        </DemoSection>

        {/* 7. Loading State */}
        <DemoSection
          id="loading"
          title="Loading State"
          description="Toggle loading to see skeleton rows. Uses config.skeletonRows for consistent height."
        >
          <div className="p-3 bg-muted/30 flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLoading(!isLoading)}
            >
              {isLoading ? 'Stop Loading' : 'Start Loading'}
            </Button>
            <span className="text-sm text-muted-foreground">
              Click to toggle loading state
            </span>
          </div>
          <ElegantGrid 
            headers={basicHeaders} 
            totalCount={basicData.length}
            loading={isLoading}
            config={{
              skeletonRows: 5,
              minHeight: '200px',
            }}
          >
            {basicData.map((tx) => (
              <ElegantGrid.Row key={tx.id} data={tx}>
                <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
                <ElegantGrid.Cell align="right" className="font-mono">
                  {formatAmount(tx.amount)}
                </ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.status}</ElegantGrid.Cell>
              </ElegantGrid.Row>
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* 8. i18n Labels */}
        <DemoSection
          id="i18n"
          title="Internationalization"
          description="Customize pager labels for different languages. Example: German labels."
        >
          <ElegantGrid 
            headers={basicHeaders} 
            totalCount={sampleTransactions.length}
            pagerOptions={{
              onQueryChange: handleQueryChange,
              defaultPageSize: 5,
              pageSizeOptions: [5, 10, 15],
              labels: {
                showingText: (start, end, total) => `Zeige ${start}-${end} von ${total}`,
                rowsLabel: 'Zeilen:',
                goToLabel: 'Gehe zu:',
              },
            }}
          >
            {sampleTransactions.slice(0, 5).map((tx) => (
              <ElegantGrid.Row key={tx.id} data={tx}>
                <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
                <ElegantGrid.Cell align="right" className="font-mono">
                  {formatAmount(tx.amount)}
                </ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.status}</ElegantGrid.Cell>
              </ElegantGrid.Row>
            ))}
          </ElegantGrid>
        </DemoSection>

        {/* 9. GridConfig Options */}
        <DemoSection
          id="config"
          title="GridConfig Options"
          description="Use maxHeight for scrollable content within a fixed area."
        >
          <ElegantGrid 
            headers={basicHeaders} 
            totalCount={sampleTransactions.length}
            config={{
              maxHeight: '200px',
            }}
          >
            {sampleTransactions.map((tx) => (
              <ElegantGrid.Row key={tx.id} data={tx}>
                <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.from}</ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.to}</ElegantGrid.Cell>
                <ElegantGrid.Cell align="right" className="font-mono">
                  {formatAmount(tx.amount)}
                </ElegantGrid.Cell>
                <ElegantGrid.Cell>{tx.status}</ElegantGrid.Cell>
              </ElegantGrid.Row>
            ))}
          </ElegantGrid>
        </DemoSection>

      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Package className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">ElegantGrid</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A composition-first data grid for React
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
