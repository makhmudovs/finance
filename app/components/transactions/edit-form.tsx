"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import {
  updateTransaction,
  UpdateTransactionState,
} from "@/app/lib/transaction-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TransactionType } from "@/db/schema";
import { toast } from "sonner";

export function EditTransactionForm({
  transaction,
}: {
  transaction: TransactionType;
}) {
  const router = useRouter();
  const [isFormEditable, setIsFormEditable] = useState<boolean>(false);

  const initialState: UpdateTransactionState = { errors: {}, message: null };

  // Fix: bind returns a new function, wrap it properly
  const [state, formAction, isPending] = useActionState(
    updateTransaction.bind(null, transaction.id),
    initialState
  );

  // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Show success message and redirect
  useEffect(() => {
    if (state?.message) {
      toast.info(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <Switch
          id="airplane-mode"
          checked={isFormEditable}
          onCheckedChange={() => {
            setIsFormEditable(!isFormEditable);
          }}
        />
        <Label htmlFor="airplane-mode">
          {isFormEditable ? "Close Form" : "Open Form"}
        </Label>
      </div>

      {/* Show error message if validation failed */}
      {state.message &&
        state.errors &&
        Object.keys(state.errors).length > 0 && (
          <div className="text-red-500 text-sm">{state.message}</div>
        )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="merchant">Merchant</FieldLabel>
          <Input
            id="merchant"
            name="merchant"
            type="text"
            placeholder="Mackdonalds or Starbucks"
            aria-describedby="merchant-error"
            defaultValue={transaction.merchant || ""}
            disabled={!isFormEditable}
          />
          {state.errors?.merchant && (
            <div className="text-red-500 text-sm">
              {state.errors.merchant[0]}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              aria-describedby="amount-error"
              defaultValue={transaction.amount}
              disabled={!isFormEditable}
            />
            {state.errors?.amount && (
              <div className="text-red-500 text-sm">
                {state.errors.amount[0]}
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="transaction_type">Transaction Type</FieldLabel>
            <input
              type="hidden"
              name="transaction_type"
              id="transaction_type_hidden"
              defaultValue={transaction.transaction_type}
            />
            <Select
              onValueChange={(value) => {
                const input = document.getElementById(
                  "transaction_type_hidden"
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={transaction.transaction_type}
            >
              <SelectTrigger id="transaction_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.transaction_type && (
              <div className="text-red-500 text-sm">
                {state.errors.transaction_type[0]}
              </div>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="transaction_category">
              Transaction Category
            </FieldLabel>
            <input
              type="hidden"
              name="transaction_category"
              id="transaction_category_hidden"
              defaultValue={transaction.category}
            />
            <Select
              onValueChange={(value) => {
                const input = document.getElementById(
                  "transaction_category_hidden"
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={transaction.category}
            >
              <SelectTrigger id="transaction_category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.transaction_category && (
              <div className="text-red-500 text-sm">
                {state.errors.transaction_category[0]}
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="date">Date</FieldLabel>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              placeholder="Date"
              aria-describedby="date-error"
              defaultValue={formatDateForInput(transaction.date)}
              disabled={!isFormEditable}
            />
            {state.errors?.date && (
              <div className="text-red-500 text-sm">{state.errors.date[0]}</div>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            placeholder="Type your message here."
            id="description"
            name="description"
            aria-describedby="description-error"
            defaultValue={transaction.description || ""}
            disabled={!isFormEditable}
          />
          {state.errors?.description && (
            <div className="text-red-500 text-sm">
              {state.errors.description[0]}
            </div>
          )}
        </Field>

        <div className="ml-auto">
          <Field orientation="horizontal">
            <Button asChild variant="outline">
              <Link href="/dashboard/transactions">Cancel</Link>
            </Button>
            <Button disabled={!isFormEditable || isPending} type="submit">
              {isPending ? "Saving..." : "Submit"}
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
