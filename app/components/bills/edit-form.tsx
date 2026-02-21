"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BillType } from "@/db/schema";
import { toast } from "sonner";
import { updateBill, UpdateBillState } from "@/app/lib/bill-actions";

export function EditBillForm({ bill }: { bill: BillType }) {
  const [isFormEditable, setIsFormEditable] = useState<boolean>(false);

  const initialState: UpdateBillState = { errors: {}, message: null };

  // Fix: bind returns a new function, wrap it properly
  const [state, formAction, isPending] = useActionState(
    updateBill.bind(null, bill.id),
    initialState,
  );

  // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return "";
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
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            aria-describedby="name-error"
            defaultValue={bill.name || ""}
            disabled={!isFormEditable}
          />
          {state.errors?.name && (
            <div className="text-red-500 text-sm">{state.errors.name[0]}</div>
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
              defaultValue={bill.amount || 0}
              disabled={!isFormEditable}
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
              defaultValue={bill.reminderDays || 0}
              disabled={!isFormEditable}
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
            <input type="hidden" name="category" defaultValue={bill.category} />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="category"]',
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={String(bill.category)}
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
            <input
              type="hidden"
              name="frequency"
              defaultValue={bill.frequency}
            />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="frequency"]',
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={String(bill.frequency)}
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
              defaultValue={formatDateForInput(bill.nextDueDate)}
              disabled={!isFormEditable}
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
              defaultValue={formatDateForInput(bill.lastPaidDate)}
              disabled={!isFormEditable}
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

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="autoDeduct">Auto Deducted</FieldLabel>
            <input
              type="hidden"
              name="autoDeduct"
              defaultValue={String(bill.autoDeduct)}
            />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="autoDeduct"]',
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={String(bill.autoDeduct)}
            >
              <SelectTrigger id="autoDeduct">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            <div id="autoDeduct-error" aria-live="polite" aria-atomic="true">
              {state.errors?.autoDeduct &&
                state.errors.autoDeduct.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="isActive">Status</FieldLabel>
            <input
              type="hidden"
              name="isActive"
              id="isActive_hidden"
              defaultValue={String(bill.isActive)}
            />
            <Select
              onValueChange={(value) => {
                const input = document.getElementById(
                  "isActive_hidden",
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={String(bill.isActive)}
            >
              <SelectTrigger id="isActive">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.isActive && (
              <div className="text-red-500 text-sm">
                {state.errors.isActive[0]}
              </div>
            )}
          </Field>
        </div>

        <div className="ml-auto">
          <Field orientation="horizontal">
            <Button asChild variant="outline">
              <Link href="/dashboard/bills">Cancel</Link>
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
