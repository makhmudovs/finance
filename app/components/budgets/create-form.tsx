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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createBudget, CreateBudgetState } from "@/app/lib/budget-actions";

export function Form() {
  const initialState: CreateBudgetState = { message: null, errors: {} };

  const [state, action] = useActionState(createBudget, initialState);

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
            placeholder="Budget name"
            aria-describedby="name-error"
          />
        </Field>
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error) => (
              <p className="text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
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
            />
            <div id="limit-error" aria-live="polite" aria-atomic="true">
              {state.errors?.limit &&
                state.errors.limit.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
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
            />
            <div id="spent-error" aria-live="polite" aria-atomic="true">
              {state.errors?.spent &&
                state.errors.spent.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="category">Budget Category</FieldLabel>
            <input type="hidden" name="category" />

            <Select
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="category"]'
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
            <FieldLabel htmlFor="period">Period</FieldLabel>
            <Input
              id="period"
              name="period"
              type="text"
              placeholder="2020/2028"
              aria-describedby="period-error"
            />
            <div id="period-error" aria-live="polite" aria-atomic="true">
              {state.errors?.period &&
                state.errors.period.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              placeholder="Start date"
              aria-describedby="startDate-error"
            />
            <div id="startDate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.startDate &&
                state.errors.startDate.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="startDate">End Date</FieldLabel>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              placeholder="end date"
              aria-describedby="endDate-error"
            />
            <div id="endDate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.endDate &&
                state.errors.endDate.map((error) => (
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
              <Link href="/dashboard/budgets">Cancel</Link>
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
