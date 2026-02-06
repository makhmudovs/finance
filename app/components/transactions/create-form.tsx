"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import {
  createTransaction,
  CreateTransactionState,
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
import { toast } from "sonner";

export function Form() {
  const initialState: CreateTransactionState = { message: null, errors: {} };

  const [state, action] = useActionState(createTransaction, initialState);

  useEffect(() => {
    if (state?.message) {
      toast.info(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="p-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="merchant">Merchant</FieldLabel>
          <Input
            id="merchant"
            name="merchant"
            type="text"
            placeholder="Mackdonalds or Starbucks"
            aria-describedby="merchant-error"
          />
        </Field>
        <div id="merchant-error" aria-live="polite" aria-atomic="true">
          {state.errors?.merchant &&
            state.errors.merchant.map((error) => (
              <p className="text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
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
            />
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount &&
                state.errors.amount.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="transaction_type">Transaction Type</FieldLabel>
            <input type="hidden" name="transaction_type" />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="transaction_type"]'
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
            >
              <SelectTrigger id="transaction_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <div
              id="transaction_type-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.transaction_type &&
                state.errors.transaction_type.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="transaction_category">
              Transaction Category
            </FieldLabel>
            <input type="hidden" name="transaction_category" />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="transaction_category"]'
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
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
            <div
              id="transaction_category-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.transaction_category &&
                state.errors.transaction_category.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="date">Date</FieldLabel>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              placeholder="Date"
              aria-describedby="date-error"
            />
            <div id="date-error" aria-live="polite" aria-atomic="true">
              {state.errors?.date &&
                state.errors.date.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            placeholder="Type your message here."
            id="description"
            name="description"
            aria-describedby="description-error"
          />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error) => (
                <p className="text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </Field>
        <div className="ml-auto">
          <Field orientation="horizontal">
            <Button asChild variant="outline">
              <Link href="/dashboard/transactions">Cancel</Link>
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
