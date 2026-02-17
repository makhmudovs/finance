"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { updatePot, UpdatePotState } from "@/app/lib/pot-actions";

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
import { PotType } from "@/db/schema";
import { toast } from "sonner";

import {
  Circle,
  PiggyBank,
  Car,
  House,
  GraduationCap,
  Plane,
  ShieldCheck,
  Smartphone,
  Heart,
  Gamepad2,
  ShoppingBag,
} from "lucide-react";
import { formatDateForInput, formatDateToLocal } from "@/app/lib/utils";

const ICON_OPTIONS = [
  {
    value: "PiggyBank",
    label: "General Savings",
    icon: PiggyBank,
    color: "text-pink-500",
  },
  { value: "car", label: "Vehicle", icon: Car, color: "text-blue-500" },
  {
    value: "House",
    label: "Home/Rent",
    icon: House,
    color: "text-emerald-500",
  },
  {
    value: "GraduationCap",
    label: "Education",
    icon: GraduationCap,
    color: "text-purple-500",
  },
  { value: "travel", label: "Travel", icon: Plane, color: "text-sky-500" },
  {
    value: "ShieldCheck",
    label: "Emergency Fund",
    icon: ShieldCheck,
    color: "text-red-500",
  },
  {
    value: "Smartphone",
    label: "Electronics",
    icon: Smartphone,
    color: "text-slate-500",
  },
  {
    value: "Heart",
    label: "Health & Charity",
    icon: Heart,
    color: "text-rose-500",
  },
  {
    value: "Gamepad2",
    label: "Entertainment",
    icon: Gamepad2,
    color: "text-indigo-500",
  },
  {
    value: "ShoppingBag",
    label: "Shopping",
    icon: ShoppingBag,
    color: "text-orange-500",
  },
  { value: "other", label: "Other", icon: Circle, color: "text-gray-400" },
];

const COLOR_OPTIONS = [
  { name: "Red", value: "red", twClass: "text-red-500", bgClass: "bg-red-500" },
  {
    name: "Orange",
    value: "orange",
    twClass: "text-orange-500",
    bgClass: "bg-orange-500",
  },
  {
    name: "Amber",
    value: "amber",
    twClass: "text-amber-500",
    bgClass: "bg-amber-500",
  },
  {
    name: "Yellow",
    value: "yellow",
    twClass: "text-yellow-500",
    bgClass: "bg-yellow-500",
  },
  {
    name: "Lime",
    value: "lime",
    twClass: "text-lime-500",
    bgClass: "bg-lime-500",
  },
  {
    name: "Green",
    value: "green",
    twClass: "text-green-500",
    bgClass: "bg-green-500",
  },
  {
    name: "Emerald",
    value: "emerald",
    twClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
  },
  {
    name: "Teal",
    value: "teal",
    twClass: "text-teal-500",
    bgClass: "bg-teal-500",
  },
  {
    name: "Cyan",
    value: "cyan",
    twClass: "text-cyan-500",
    bgClass: "bg-cyan-500",
  },
  { name: "Sky", value: "sky", twClass: "text-sky-500", bgClass: "bg-sky-500" },
  {
    name: "Blue",
    value: "blue",
    twClass: "text-blue-500",
    bgClass: "bg-blue-500",
  },
  {
    name: "Indigo",
    value: "indigo",
    twClass: "text-indigo-500",
    bgClass: "bg-indigo-500",
  },
  {
    name: "Violet",
    value: "violet",
    twClass: "text-violet-500",
    bgClass: "bg-violet-500",
  },
  {
    name: "Purple",
    value: "purple",
    twClass: "text-purple-500",
    bgClass: "bg-purple-500",
  },
  {
    name: "Fuchsia",
    value: "fuchsia",
    twClass: "text-fuchsia-500",
    bgClass: "bg-fuchsia-500",
  },
  {
    name: "Pink",
    value: "pink",
    twClass: "text-pink-500",
    bgClass: "bg-pink-500",
  },
  {
    name: "Rose",
    value: "rose",
    twClass: "text-rose-500",
    bgClass: "bg-rose-500",
  },
  {
    name: "Slate",
    value: "slate",
    twClass: "text-slate-500",
    bgClass: "bg-slate-500",
  },
  {
    name: "Gray",
    value: "gray",
    twClass: "text-gray-500",
    bgClass: "bg-gray-500",
  },
  {
    name: "Zinc",
    value: "zinc",
    twClass: "text-zinc-500",
    bgClass: "bg-zinc-500",
  },
];

export function EditPotForm({ pot }: { pot: PotType }) {
  const [isFormEditable, setIsFormEditable] = useState<boolean>(false);

  const initialState: UpdatePotState = { errors: {}, message: null };

  // Fix: bind returns a new function, wrap it properly
  const [state, formAction, isPending] = useActionState(
    updatePot.bind(null, pot.id),
    initialState,
  );

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
            defaultValue={pot.name || ""}
            disabled={!isFormEditable}
          />
          {state.errors?.name && (
            <div className="text-red-500 text-sm">{state.errors.name[0]}</div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="targetAmount">Target Amount</FieldLabel>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              aria-describedby="targetAmount-error"
              defaultValue={pot.targetAmount}
              disabled={!isFormEditable}
            />
            {state.errors?.targetAmount && (
              <div className="text-red-500 text-sm">
                {state.errors.targetAmount[0]}
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="spent">Curent Amount</FieldLabel>
            <Input
              id="currentAmount"
              name="currentAmount"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              aria-describedby="currentAmount-error"
              defaultValue={pot.currentAmount}
              disabled={!isFormEditable}
            />
            {state.errors?.currentAmount && (
              <div className="text-red-500 text-sm">
                {state.errors.currentAmount[0]}
              </div>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="color">Color</FieldLabel>
            {/* Add defaultValue here so the form action receives it if unchanged */}
            <input type="hidden" name="color" defaultValue={pot.color || ""} />

            <Select
              disabled={!isFormEditable}
              defaultValue={pot.color || ""} // Pre-selects the current value
              onValueChange={(value) => {
                const input = document.querySelector(
                  'input[name="color"]',
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
            >
              <SelectTrigger id="color">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((color) => (
                  <SelectItem
                    key={color.value}
                    value={color.value}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`${color.bgClass} w-4 h-4 rounded-full shrink-0`}
                      />
                      <span>{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div id="color-error" aria-live="polite" aria-atomic="true">
              {state.errors?.color &&
                state.errors.color.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="icon">Icon</FieldLabel>
            {/* Add defaultValue here */}
            <input
              type="hidden"
              name="icon"
              id="icon_hidden"
              defaultValue={pot.icon || ""}
            />

            <Select
              disabled={!isFormEditable}
              defaultValue={pot.icon || ""} // Pre-selects the current value
              onValueChange={(value) => {
                const input = document.getElementById(
                  "icon_hidden",
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
            >
              <SelectTrigger id="icon" className="w-full">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>

              <SelectContent>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <opt.icon className={`h-4 w-4 ${opt.color}`} />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div id="icon-error" aria-live="polite" aria-atomic="true">
              {state.errors?.icon &&
                state.errors.icon.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="startDate">Target Date</FieldLabel>
            <Input
              id="targetDate"
              name="targetDate"
              type="datetime-local"
              placeholder="Target Date"
              aria-describedby="targetDate-error"
              defaultValue={pot.targetDate ? formatDateForInput(pot.targetDate) : ""}
              disabled={!isFormEditable}
            />
            {state.errors?.targetDate && (
              <div className="text-red-500 text-sm">
                {state.errors.targetDate[0]}
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="isArchived">Status</FieldLabel>
            <input
              type="hidden"
              name="isArchived"
              id="isArchived_hidden"
              defaultValue={String(pot.isArchived)}
            />
            <Select
              onValueChange={(value) => {
                const input = document.getElementById(
                  "isArchived_hidden",
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
              disabled={!isFormEditable}
              defaultValue={String(pot.isArchived)}
            >
              <SelectTrigger id="isArchived">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Archived</SelectItem>
                <SelectItem value="false">Unarchived</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.isArchived && (
              <div className="text-red-500 text-sm">
                {state.errors.isArchived[0]}
              </div>
            )}
          </Field>
        </div>

        <div className="ml-auto">
          <Field orientation="horizontal">
            <Button asChild variant="outline">
              <Link href="/dashboard/pots">Cancel</Link>
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
