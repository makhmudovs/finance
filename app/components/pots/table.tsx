import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PotActions } from "./pot-actions";
import { fetchFilteredPots } from "@/app/lib/pot-actions";

export default async function PotsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
  type?: string;
  category?: string;
}) {
  const pots = await fetchFilteredPots(query, currentPage);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Current</TableHead>
            <TableHead>Target Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pots.length > 0 ? (
            pots.map((pot) => (
              <TableRow key={pot.id}>
                <TableCell className="font-medium">
                  {pot.id || "-"}
                </TableCell>
                <TableCell>{pot.name}</TableCell>
                <TableCell>{formatCurrency(Number(pot.targetAmount))}</TableCell>
                <TableCell>{formatCurrency(Number(pot.currentAmount))}</TableCell>
                <TableCell>{formatDateToLocal(pot.targetDate || '')}</TableCell>
                <TableCell>
                  {pot.isArchived ? (
                    <p className="text-green-500">ACTIVE</p>
                  ) : (
                    <p className="text-red-500">INACTIVE</p>
                  )}
                </TableCell>
                
                <TableCell className="text-right">
                  <PotActions potId={pot.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-6 text-left text-muted-foreground"
              >
                <p className="text-center">No pots found!</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
