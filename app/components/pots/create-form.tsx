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
import { createPot, CreatePotState } from "@/app/lib/pot-actions";

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

const ICON_OPTIONS = [
  {
    value: "PiggyBank",
    label: "General Savings",
    icon: PiggyBank,
    color: "text-pink-500",
  },
  { value: "Car", label: "Vehicle", icon: Car, color: "text-blue-500" },
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
  { value: "Travel", label: "Travel", icon: Plane, color: "text-sky-500" },
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

export function Form() {
  const initialState: CreatePotState = { message: null, errors: {} };

  const [state, action] = useActionState(createPot, initialState);

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
            placeholder="Pot name"
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
            <FieldLabel htmlFor="targetAmount">Target Amount</FieldLabel>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              aria-describedby="targetAmount-error"
            />
            <div id="targetAmount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.targetAmount &&
                state.errors.targetAmount.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="currentAmount">Current Amount</FieldLabel>
            <Input
              id="currentAmount"
              name="currentAmount"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              aria-describedby="currentAmount-error"
            />
            <div id="currentAmount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.currentAmount &&
                state.errors.currentAmount.map((error) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Field>
            <FieldLabel htmlFor="color">Color</FieldLabel>
            <input type="hidden" name="color" />

            <Select
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
                    className={`${color.twClass} cursor-pointer`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`${color.bgClass} w-4 h-4 rounded-full shrink-0`}
                      />
                      <span className="ml-4">{color.name}</span>
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
            <input type="hidden" name="icon" id="icon_hidden" />

            <Select
              onValueChange={(value) => {
                const input = document.getElementById(
                  "icon_hidden",
                ) as HTMLInputElement;
                if (input) input.value = value;
              }}
            >
              <SelectTrigger id="icon" className="w-full">
                {/* SelectValue automatically shows the content of the selected SelectItem */}
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

        <Field>
          <FieldLabel htmlFor="startDate">Target Date</FieldLabel>
          <Input
            id="targetDate"
            name="targetDate"
            type="datetime-local"
            placeholder="Target date"
            aria-describedby="targetDate-error"
          />
          <div id="targetDate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.targetDate &&
              state.errors.targetDate.map((error) => (
                <p className="text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </Field>

        <div className="ml-auto">
          <Field orientation="horizontal">
            <Button asChild variant="outline">
              <Link href="/dashboard/pots">Cancel</Link>
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
