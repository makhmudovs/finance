import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillActions } from "./bill-actions";
import { fetchFilteredPots } from "@/app/lib/pot-actions";
import { fetchFilteredBills } from "@/app/lib/bill-actions";

export default async function PotsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
  type?: string;
  category?: string;
}) {
  const bills = await fetchFilteredBills(query, currentPage);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Last Paid</TableHead>
            <TableHead>Days Left</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.length > 0 ? (
            bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.id || "-"}</TableCell>
                <TableCell>{bill.name}</TableCell>
                <TableCell>{formatCurrency(Number(bill.amount))}</TableCell>
                <TableCell>{bill.category}</TableCell>
                <TableCell>{bill.frequency}</TableCell>
                <TableCell>
                  {formatDateToLocal(bill.nextDueDate || "")}
                </TableCell>
                <TableCell>
                  {formatDateToLocal(bill.lastPaidDate || "")}
                </TableCell>
                <TableCell>{bill.reminderDays}</TableCell>
                <TableCell>
                  {bill.isActive ? (
                    <p className="text-green-500">ACTIVE</p>
                  ) : (
                    <p className="text-red-500">INACTIVE</p>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <BillActions billId={bill.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-6 text-left text-muted-foreground"
              >
                <p className="text-center">No bills found!</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
