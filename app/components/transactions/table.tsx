import { fetchFilteredTransactions } from "@/app/lib/data";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTransaction } from "@/app/lib/transaction-actions";
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
                colSpan={7}
                className="py-6 text-left text-muted-foreground"
              >
                <p className="text-center">Please add transactions!</p>
              </TableCell>
            </TableRow>
          )}
          {/*  */}
        </TableBody>
      </Table>
    </div>
  );
}
