import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchFilteredBudgets } from "@/app/lib/budget-actions";
import { BudgetActions } from "./budget-actions";

export default async function TransactionsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
  type?: string;
  category?: string;
}) {
  const budgets = await fetchFilteredBudgets(query, currentPage);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">
                  {budget.id || "-"}
                </TableCell>
                <TableCell>{formatCurrency(Number(budget.limit))}</TableCell>
                <TableCell>{formatCurrency(Number(budget.spent))}</TableCell>
                <TableCell className="capitalize">{budget.category}</TableCell>
                <TableCell>{formatDateToLocal(budget.period)}</TableCell>
                <TableCell>{formatDateToLocal(budget.startDate)}</TableCell>
                <TableCell>{formatDateToLocal(budget.endDate)}</TableCell>
                <TableCell>
                  {budget.isActive ? (
                    <p className="text-green-500">ACTIVE</p>
                  ) : (
                    <p className="text-red-500">INACTIVE</p>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <BudgetActions budgetId={budget.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-6 text-left text-muted-foreground"
              >
                <p className="text-center">No budgets found!</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
