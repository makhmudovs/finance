"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
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

import { toast } from "sonner";
import { createBill, CreateBillState } from "@/app/lib/bill-actions";

export function Form() {
  const initialState: CreateBillState = { message: null, errors: {} };

  const [state, action] = useActionState(createBill, initialState);

  useEffect(() => {
    if (state?.message) {
      toast.info(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="p-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Bill name"
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error) => (
                <p className="text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
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
            <FieldLabel htmlFor="reminderDays">Days Left</FieldLabel>
            <Input
              id="reminderDays"
              name="reminderDays"
              type="number"
              step="1"
              placeholder="Enter reminderDays"
              aria-describedby="reminderDays-error"
            />
            <div id="reminderDays-error" aria-live="polite" aria-atomic="true">
              {state.errors?.reminderDays &&
                state.errors.reminderDays.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <input type="hidden" name="category" />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="category"]',
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
            >
              <SelectTrigger id="category">
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
            <div id="category-error" aria-live="polite" aria-atomic="true">
              {state.errors?.category &&
                state.errors.category.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
            <input type="hidden" name="frequency" />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="frequency"]',
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <div id="frequency-error" aria-live="polite" aria-atomic="true">
              {state.errors?.frequency &&
                state.errors.frequency.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="nextDueDate">Due Date</FieldLabel>
            <Input
              id="nextDueDate"
              name="nextDueDate"
              type="datetime-local"
              placeholder="Due date"
              aria-describedby="nextDueDate-error"
            />
            <div id="nextDueDate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.nextDueDate &&
                state.errors.nextDueDate.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="lastPaidDate">Last Paid</FieldLabel>
            <Input
              id="lastPaidDate"
              name="lastPaidDate"
              type="datetime-local"
              placeholder="Start date"
              aria-describedby="lastPaidDate-error"
            />
            <div id="lastPaidDate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lastPaidDate &&
                state.errors.lastPaidDate.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <div className="ml-auto">
          <Field orientation="horizontal">
            <Button asChild variant="outline">
              <Link href="/dashboard/bills">Cancel</Link>
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
