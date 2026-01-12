import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Transaction {
  id: string;
  amount: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reasons: string[];
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const columnHelper = createColumnHelper<Transaction>();

const getRiskLevelStyles = (level: string) => {
  switch (level) {
    case 'Low':
      return 'bg-success/10 text-success border-success/20';
    case 'Medium':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'High':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Critical':
      return 'bg-critical/10 text-critical border-critical/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent px-0 font-semibold text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-0"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => <span className="font-mono text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent px-0 font-semibold text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-0"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <span className="font-semibold">${info.getValue().toLocaleString()}</span>
      ),
    }),
    columnHelper.accessor('riskScore', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent px-0 font-semibold text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-0"
        >
          Risk Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const score = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'gradient-danger' :
                    score >= 60 ? 'gradient-warning' :
                      score >= 40 ? 'bg-warning' : 'gradient-success'
                  }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-sm font-medium">{score}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('riskLevel', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent px-0 font-semibold text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-0"
        >
          Risk Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const level = info.getValue();
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskLevelStyles(level)}`}>
            {level}
          </span>
        );
      },
    }),
    columnHelper.accessor('reasons', {
      header: () => <span className="font-semibold text-foreground">Reasons</span>,
      cell: (info) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {info.getValue().slice(0, 2).map((reason, i) => (
            <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
              {reason}
            </span>
          ))}
          {info.getValue().length > 2 && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
              +{info.getValue().length - 2} more
            </span>
          )}
        </div>
      ),
    }),
  ], []);

  const filteredData = useMemo(() => {
    if (riskFilter === 'all') return transactions;
    return transactions.filter((t) => t.riskLevel === riskFilter);
  }, [transactions, riskFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 20 } },
  });

  const exportToCSV = () => {
    const headers = ['ID', 'Amount', 'Risk Score', 'Risk Level', 'Reasons'];
    const rows = transactions
      .filter(t => t.riskLevel !== 'Low')
      .map(t => [t.id, t.amount, t.riskScore, t.riskLevel, t.reasons.join('; ')]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suspicious_transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="glass-card rounded-xl p-6 transition-theme animate-slide-up opacity-0"
      style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground">Transaction Details</h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={exportToCSV}
            className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Suspicious
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left py-3 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/50 transition-colors hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-4 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredData.length
          )}{' '}
          of {filteredData.length} transactions
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="transition-all hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium px-3">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="transition-all hover:scale-105"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
