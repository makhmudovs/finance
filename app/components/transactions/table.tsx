import { fetchFilteredTransactions } from "@/app/lib/data";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionActions } from "./transaction-actions";

export default async function TransactionsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const transactions = await fetchFilteredTransactions(query, currentPage);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.id || "-"}
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(transaction.amount))}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.transaction_type}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.category}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">
                  {transaction.merchant}
                </TableCell>
                <TableCell>{formatDateToLocal(transaction.date)}</TableCell>
                <TableCell className="text-right">
                  <TransactionActions transactionId={transaction.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-6 text-left text-muted-foreground"
              >
                <p className="text-center">No transactions found!</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
