"use server";

import { db } from "@/db/index";
import { budgetsTable, potsTable, user } from "@/db/schema/index";
import { auth } from "@/lib/auth";
import { or, ilike, sql, desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { validateUser } from "./data";
import { parse } from "path";

const ITEMS_PER_PAGE = 6;
export async function fetchPotPages(query: string) {
  const userId = await validateUser();
  try {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(potsTable)
      .innerJoin(user, sql`${potsTable.userId} = ${user.id}`)
      .where(
        and(
          eq(potsTable.userId, userId),
          or(
            // text columns
            ilike(potsTable.name, `%${query}%`),
            ilike(potsTable.color, `%${query}%`),

            // numeric / timestamp → text
            ilike(sql`${potsTable.targetAmount}::text`, `%${query}%`),
            ilike(sql`${potsTable.currentAmount}::text`, `%${query}%`),
            ilike(sql`${potsTable.targetDate}::text`, `%${query}%`),
            ilike(sql`${potsTable.createdAt}::text`, `%${query}%`),
          ),
        ),
      );

    const totalPages = Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of pots.");
  }
}

export async function fetchFilteredPots(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const userId = await validateUser();
  try {
    const result = await db
      .select({
        id: potsTable.id,
        name: potsTable.name,
        targetAmount: potsTable.targetAmount,
        currentAmount: potsTable.currentAmount,
        color: potsTable.color,
        icon: potsTable.icon,
        targetDate: potsTable.targetDate,
        isArchived: potsTable.isArchived,
        createdAt: potsTable.createdAt,
      })
      .from(potsTable)
      .innerJoin(user, sql`${potsTable.userId} = ${user.id}`)
      .where(
        and(
          eq(potsTable.userId, userId),
          or(
            // text columns
            ilike(potsTable.name, `%${query}%`),
            ilike(potsTable.color, `%${query}%`),

            // numeric / timestamp → text
            ilike(sql`${potsTable.targetAmount}::text`, `%${query}%`),
            ilike(sql`${potsTable.currentAmount}::text`, `%${query}%`),
            ilike(sql`${potsTable.targetDate}::text`, `%${query}%`),
            ilike(sql`${potsTable.createdAt}::text`, `%${query}%`),
          ),
        ),
      )
      .orderBy(desc(potsTable.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch pot.");
  }
}

export async function fetchPotById(id: string) {
  const userId = await validateUser();
  try {
    const data = await db
      .select()
      .from(potsTable)
      .where(and(eq(potsTable.id, id), eq(potsTable.userId, userId)))
      .limit(1);

    if (!data[0]) {
      throw new Error("Transaction not found");
    }

    // Convert amounts from cents to dollars
    const pot = {
      ...data[0],
      targetAmount: String(parseFloat(data[0].targetAmount) / 100),
      currentAmount: String(parseFloat(data[0].currentAmount) / 100),
    };

    return pot;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch pot.");
  }
}

export type CreatePotState = {
  errors?: {
    name?: string[];
    targetAmount?: string[];
    currentAmount?: string[];
    color?: string[];
    icon?: string[];
    targetDate?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  name: z.string().min(3, "Name cannot be empty"),
  targetAmount: z.coerce
    .number()
    .gt(0, "Please enter an amount greater than $0"),
  currentAmount: z.coerce
    .number()
    .gt(0, "Please enter an amount greater than $0"),
  color: z.enum(
    [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
      "slate",
      "gray",
      "zinc",
    ],
    {
      message: "Please select a color",
    },
  ),
  icon: z.enum(
    [
      "PiggyBank",
      "Car",
      "House",
      "GraduationCap",
      "Plane",
      "ShieldCheck",
      "Smartphone",
      "Heart",
      "Gamepad2",
      "ShoppingBag",
    ],
    {
      message: "Please select an icon",
    },
  ),

  targetDate: z.string().min(1, "Please enter a date"),
  isArchived: z.boolean().optional(),
});

export async function createPot(
  _prevState: CreatePotState | undefined,
  formData: FormData,
): Promise<CreatePotState> {
  const userId = await validateUser();

  const parsed = FormSchema.safeParse({
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    currentAmount: formData.get("currentAmount"),
    color: formData.get("color"),
    icon: formData.get("icon"),
    targetDate: formData.get("targetDate"),
  });
  console.log("formdata", parsed.data);
  console.log("error", parsed.error);

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return {
      errors: {
        name: errors.properties?.name?.errors,
        targetAmount: errors.properties?.targetAmount?.errors,
        currentAmount: errors.properties?.currentAmount?.errors,
        color: errors.properties?.color?.errors,
        targetDate: errors.properties?.targetDate?.errors,
      },
      message: "Validation failed",
    };
  }

  const { name, targetAmount, currentAmount, icon, color, targetDate } =
    parsed.data;

  const targetAmountInCents = (targetAmount * 100).toString();
  const currentAmountInCents = (currentAmount * 100).toString();

  try {
    await db.insert(potsTable).values({
      userId,
      name,
      targetAmount: targetAmountInCents,
      currentAmount: currentAmountInCents,
      color,
      icon,
      targetDate: new Date(targetDate),
      createdAt: new Date(),
    });

    revalidatePath("/dashboard/pots");
    return {
      message: "Pot created successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Pot creation failed:", error);
    return {
      message: "Something went wrong while creating the Pot.",
    };
  }
}

export type UpdatePotState = {
  errors?: {
    name?: string[];
    targetAmount?: string[];
    currentAmount?: string[];
    color?: string[];
    icon?: string[];
    targetDate?: string[];
    isArchived?: string[];
  };
  message?: string | null;
};

export async function updatePot(
  id: string,
  _prevState: UpdatePotState,
  formData: FormData,
): Promise<UpdatePotState> {
  const userId = await validateUser();

  const rawIsArchived = formData.get("isArchived");
  const isArchiveBoolean = rawIsArchived === "true";

  const parsed = FormSchema.safeParse({
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    currentAmount: formData.get("currentAmount"),
    color: formData.get("color"),
    icon: formData.get("icon"),
    targetDate: formData.get("targetDate"),
    isArchived: isArchiveBoolean,
  });

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);
    return {
      errors: {
        name: errors.properties?.name?.errors,
        targetAmount: errors.properties?.targetAmount?.errors,
        currentAmount: errors.properties?.currentAmount?.errors,
        color: errors.properties?.color?.errors,
        icon: errors.properties?.icon?.errors,
        targetDate: errors.properties?.targetDate?.errors,
        isArchived: errors.properties?.isArchived?.errors,
      },
      message: "Validation failed",
    };
  }

  /* ---------- DB Update ---------- */
  const {
    name,
    targetAmount,
    currentAmount,
    color,
    icon,
    targetDate,
    isArchived,
  } = parsed.data;

  const targetAmountInCents = (targetAmount * 100).toString();
  const currentAmountInCents = (currentAmount * 100).toString();

  try {
    await db
      .update(potsTable)
      .set({
        name,
        targetAmount: targetAmountInCents,
        currentAmount: currentAmountInCents,
        color,
        icon,
        targetDate: new Date(targetDate),
        isArchived,
      })
      .where(and(eq(potsTable.id, id), eq(potsTable.userId, userId)));

    revalidatePath(`/pots/${id}/edit`);
    return {
      message: "Pot updated successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Update pot failed:", error);
    return {
      message: "Something went wrong while updating the pot.",
    };
  }
}

export async function deletePot(id: string) {
  const userId = await validateUser();

  try {
    await db
      .delete(potsTable)
      .where(and(eq(potsTable.userId, userId), eq(potsTable.id, id)));

    revalidatePath("/dashboard/pots");

    return { message: "Pot deleted successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete pot.");
  }
}
