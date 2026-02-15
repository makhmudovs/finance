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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BudgetType } from "@/db/schema";
import { toast } from "sonner";
import { updateBudget, UpdateBudgetState } from "@/app/lib/budget-actions";

export function EditBudgetForm({ budget }: { budget: BudgetType }) {
  const router = useRouter();
  const [isFormEditable, setIsFormEditable] = useState<boolean>(false);

  const initialState: UpdateBudgetState = { errors: {}, message: null };

  // Fix: bind returns a new function, wrap it properly
  const [state, formAction, isPending] = useActionState(
    updateBudget.bind(null, budget.id),
    initialState,
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
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Mackdonalds or Starbucks"
            aria-describedby="name-error"
            defaultValue={budget.name || ""}
            disabled={!isFormEditable}
          />
          {state.errors?.name && (
            <div className="text-red-500 text-sm">{state.errors.name[0]}</div>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <input
            type="hidden"
            name="category"
            id="category_hidden"
            defaultValue={budget.category}
          />
          <Select
            onValueChange={(value) => {
              const input = document.getElementById(
                "category_hidden",
              ) as HTMLInputElement;
              if (input) input.value = value;
            }}
            disabled={!isFormEditable}
            defaultValue={budget.category}
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
          {state.errors?.category && (
            <div className="text-red-500 text-sm">
              {state.errors.category[0]}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="limit">Limit</FieldLabel>
            <Input
              id="limit"
              name="limit"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              aria-describedby="limit-error"
              defaultValue={budget.limit}
              disabled={!isFormEditable}
            />
            {state.errors?.limit && (
              <div className="text-red-500 text-sm">
                {state.errors.limit[0]}
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="spent">Spent</FieldLabel>
            <Input
              id="spent"
              name="spent"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              aria-describedby="spent-error"
              defaultValue={budget.spent}
              disabled={!isFormEditable}
            />
            {state.errors?.spent && (
              <div className="text-red-500 text-sm">
                {state.errors.spent[0]}
              </div>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              placeholder="Start Date"
              aria-describedby="startDate-error"
              defaultValue={formatDateForInput(budget.startDate)}
              disabled={!isFormEditable}
            />
            {state.errors?.startDate && (
              <div className="text-red-500 text-sm">
                {state.errors.startDate[0]}
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="endDate">End Date</FieldLabel>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              placeholder="End Date"
              aria-describedby="endDate-error"
              defaultValue={formatDateForInput(budget.endDate)}
              disabled={!isFormEditable}
            />
            {state.errors?.endDate && (
              <div className="text-red-500 text-sm">
                {state.errors.endDate[0]}
              </div>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="period">Period</FieldLabel>
            <Input
              id="period"
              name="period"
              type="text"
              placeholder="2017/2027"
              aria-describedby="period-error"
              defaultValue={budget.period || ""}
              disabled={!isFormEditable}
            />
            {state.errors?.period && (
              <div className="text-red-500 text-sm">
                {state.errors.period[0]}
              </div>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="isActive">Status</FieldLabel>
            <input
              type="hidden"
              name="isActive"
              id="isActive_hidden"
              defaultValue={String(budget.isActive)}
            />
            <Select
              onValueChange={(value) => {
                const input = document.getElementById(
                  "isActive_hidden",
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={String(budget.isActive)}
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
              <Link href="/dashboard/budgets">Cancel</Link>
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
