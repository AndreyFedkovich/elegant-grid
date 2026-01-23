import { useState, useCallback } from 'react';
import { ElegantGrid, Header, SortOrder } from '@/components/ElegantGrid';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

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
];

const headers: Header[] = [
  { key: 'date', label: 'Date', sortable: true, minWidth: 120 },
  { key: 'type', label: 'Type', sortable: true, minWidth: 100 },
  { key: 'from', label: 'From', sortable: true, minWidth: 150 },
  { key: 'to', label: 'To', sortable: true, minWidth: 150 },
  { key: 'amount', label: 'Amount', sortable: true, minWidth: 120, align: 'right' },
  { key: 'status', label: 'Status', sortable: true, minWidth: 100 },
  { key: 'actions', label: 'Actions', minWidth: 100, align: 'right', resizable: false },
];

// Custom cell component example
function FundCell({ fund }: { fund: string; isRowHovered?: boolean }) {
  const initials = fund.split(' ').map(w => w[0]).join('').slice(0, 2);
  const isExternal = fund === 'External';
  
  return (
    <div className="flex items-center gap-2 p-3 border-r border-border">
      <Avatar className="h-7 w-7">
        <AvatarFallback className={isExternal ? 'bg-muted text-muted-foreground text-xs' : 'bg-primary/10 text-primary text-xs'}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm truncate">{fund}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string; isRowHovered?: boolean }) {
  const variant = status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive';
  
  return (
    <div className="flex items-center p-3 border-r border-border">
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    </div>
  );
}

export default function Index() {
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = useCallback(({ offset, limit }: { offset: number; limit: number }) => {
    console.log('Query changed:', { offset, limit });
    // In real app: fetch data with new pagination
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    toast.info('Refreshing data...');
    setTimeout(() => {
      setLoading(false);
      toast.success('Data refreshed');
    }, 1000);
  }, []);

  const handleEdit = (tx: typeof sampleTransactions[0]) => {
    toast.info(`Edit transaction ${tx.id}`);
  };

  const handleDelete = (tx: typeof sampleTransactions[0]) => {
    toast.error(`Delete transaction ${tx.id}`);
  };

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and view all fund transactions
          </p>
        </div>

        {selectedRows.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 text-sm">
            <span className="font-medium">{selectedRows.length}</span> transaction(s) selected
          </div>
        )}

        <ElegantGrid
          headers={headers}
          totalCount={347}
          loading={loading}
          onSort={setSortOrder}
          onSelectionChange={setSelectedRows}
          pagerOptions={{
            onQueryChange: handleQueryChange,
            onRefresh: handleRefresh,
            defaultPageSize: 25,
          }}
          emptyState={{
            title: 'No transactions found',
            description: 'Try adjusting your filters or create a new transaction.',
          }}
          config={{
            maxHeight: '400px', // Grid body scrolls after 400px
          }}
        >
          {sampleTransactions.map((tx) => (
            <ElegantGrid.Row key={tx.id} data={tx}>
              <ElegantGrid.Cell>{formatDate(tx.date)}</ElegantGrid.Cell>
              <ElegantGrid.Cell>{tx.type}</ElegantGrid.Cell>
              <FundCell fund={tx.from} />
              <FundCell fund={tx.to} />
              <ElegantGrid.Cell align="right" className="font-mono">
                {formatAmount(tx.amount)}
              </ElegantGrid.Cell>
              <StatusBadge status={tx.status} />
              <ElegantGrid.ActionCell
                onEdit={() => handleEdit(tx)}
                onDelete={() => handleDelete(tx)}
              />
            </ElegantGrid.Row>
          ))}
        </ElegantGrid>
      </div>
    </div>
  );
}
