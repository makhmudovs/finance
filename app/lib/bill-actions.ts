"use server";

import { db } from "@/db/index";
import { recurringBillsTable, user } from "@/db/schema/index";
import { or, ilike, sql, desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { validateUser } from "./data";

const ITEMS_PER_PAGE = 6;
export async function fetchBillPages(query: string) {
  const userId = await validateUser();
  try {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(recurringBillsTable)
      .innerJoin(user, sql`${recurringBillsTable.userId} = ${user.id}`)
      .where(
        and(
          eq(recurringBillsTable.userId, userId),
          or(
            ilike(sql`${recurringBillsTable.category}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.frequency}::text`, `%${query}%`),
            // text columns
            ilike(recurringBillsTable.name, `%${query}%`),

            // numeric / timestamp → text
            ilike(sql`${recurringBillsTable.amount}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.nextDueDate}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.lastPaidDate}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.reminderDays}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.createdAt}::text`, `%${query}%`),
          ),
        ),
      );

    const totalPages = Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of bills.");
  }
}

export async function fetchFilteredBills(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const userId = await validateUser();
  try {
    const result = await db
      .select({
        id: recurringBillsTable.id,
        name: recurringBillsTable.name,
        amount: recurringBillsTable.amount,
        category: recurringBillsTable.category,
        frequency: recurringBillsTable.frequency,
        nextDueDate: recurringBillsTable.nextDueDate,
        lastPaidDate: recurringBillsTable.lastPaidDate,
        reminderDays: recurringBillsTable.reminderDays,
        isActive: recurringBillsTable.isActive,
        createdAt: recurringBillsTable.createdAt,
      })
      .from(recurringBillsTable)
      .innerJoin(user, sql`${recurringBillsTable.userId} = ${user.id}`)
      .where(
        and(
          eq(recurringBillsTable.userId, userId),
          or(
            ilike(sql`${recurringBillsTable.category}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.frequency}::text`, `%${query}%`),
            // text columns
            ilike(recurringBillsTable.name, `%${query}%`),

            // numeric / timestamp → text
            ilike(sql`${recurringBillsTable.amount}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.nextDueDate}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.lastPaidDate}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.reminderDays}::text`, `%${query}%`),
            ilike(sql`${recurringBillsTable.createdAt}::text`, `%${query}%`),
          ),
        ),
      )
      .orderBy(desc(recurringBillsTable.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch bill.");
  }
}

export async function fetchBillById(id: string) {
  const userId = await validateUser();
  try {
    const data = await db
      .select()
      .from(recurringBillsTable)
      .where(
        and(
          eq(recurringBillsTable.id, id),
          eq(recurringBillsTable.userId, userId),
        ),
      )
      .limit(1);

    if (!data[0]) {
      throw new Error("Transaction not found");
    }

    // Convert amounts from cents to dollars
    const pot = {
      ...data[0],
      amount: String(parseFloat(data[0].amount) / 100),
    };

    return pot;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch bill.");
  }
}

export type CreateBillState = {
  errors?: {
    name?: string[];
    amount?: string[];
    category?: string[];
    frequency?: string[];
    nextDueDate?: string[];
    lastPaidDate?: string[];
    reminderDays?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  name: z.string().min(3, "Name cannot be empty"),
  amount: z.coerce.number().gt(0, "Please enter an amount greater than $0"),
  category: z.enum(
    [
      "groceries",
      "transport",
      "entertainment",
      "bills",
      "shopping",
      "dining",
      "salary",
      "other",
    ],
    {
      message: "Please select bill category",
    },
  ),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"], {
    message: "Please select a frequency",
  }),

  nextDueDate: z.string().min(1, "Please enter a due date"),
  lastPaidDate: z.string().min(1, "Please enter last paid date"),
  reminderDays: z.coerce
    .number()
    .gt(0, "Please enter an amount greater than $0"),
  isActive: z.boolean().optional(),
  autoDeduct: z.boolean().optional(),
});

export async function createBill(
  _prevState: CreateBillState | undefined,
  formData: FormData,
): Promise<CreateBillState> {
  const userId = await validateUser();

  const parsed = FormSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    frequency: formData.get("frequency"),
    nextDueDate: formData.get("nextDueDate"),
    lastPaidDate: formData.get("lastPaidDate"),
    reminderDays: formData.get("reminderDays"),
  });

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return {
      errors: {
        name: errors.properties?.name?.errors,
        amount: errors.properties?.amount?.errors,
        category: errors.properties?.category?.errors,
        frequency: errors.properties?.frequency?.errors,
        nextDueDate: errors.properties?.nextDueDate?.errors,
        lastPaidDate: errors.properties?.lastPaidDate?.errors,
        reminderDays: errors.properties?.reminderDays?.errors,
      },
      message: "Validation failed",
    };
  }

  const {
    name,
    amount,
    category,
    frequency,
    nextDueDate,
    lastPaidDate,
    reminderDays,
  } = parsed.data;

  const amountInCents = Math.round(amount * 100).toString();

  try {
    await db.insert(recurringBillsTable).values({
      userId,
      name,
      amount: amountInCents,
      category,
      frequency,
      nextDueDate: new Date(nextDueDate),
      lastPaidDate: new Date(lastPaidDate),
      reminderDays,
      createdAt: new Date(),
    });

    revalidatePath("/dashboard/bills");
    return {
      message: "Bill created successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Bill creation failed:", error);
    return {
      message: "Something went wrong while creating the Bill.",
    };
  }
}

export type UpdateBillState = {
  errors?: {
    name?: string[];
    amount?: string[];
    category?: string[];
    frequency?: string[];
    nextDueDate?: string[];
    lastPaidDate?: string[];
    reminderDays?: string[];
    isActive?: string[];
    autoDeduct?: string[];
  };
  message?: string | null;
};

export async function updateBill(
  id: string,
  _prevState: UpdateBillState,
  formData: FormData,
): Promise<UpdateBillState> {
  const userId = await validateUser();

  const rawIsActive = formData.get("isActive");
  const isActiveBoolean = rawIsActive === "true";

  const rawAutoDeduct = formData.get("autoDeduct");
  const autoDeductBoolean = rawAutoDeduct === "true";

  const parsed = FormSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    frequency: formData.get("frequency"),
    nextDueDate: formData.get("nextDueDate"),
    lastPaidDate: formData.get("lastPaidDate"),
    reminderDays: formData.get("reminderDays"),
    autoDeduct: autoDeductBoolean,
    isActive: isActiveBoolean,
  });

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);
    return {
      errors: {
        name: errors.properties?.name?.errors,
        amount: errors.properties?.amount?.errors,
        category: errors.properties?.category?.errors,
        frequency: errors.properties?.frequency?.errors,
        nextDueDate: errors.properties?.nextDueDate?.errors,
        lastPaidDate: errors.properties?.lastPaidDate?.errors,
        reminderDays: errors.properties?.reminderDays?.errors,
      },
      message: "Validation failed",
    };
  }

  /* ---------- DB Update ---------- */

  const data = parsed.data;
  const amountInCents = Math.round(data.amount * 100).toString();

  try {
    await db
      .update(recurringBillsTable)
      .set({
        ...data,
        amount: amountInCents,
        nextDueDate: new Date(data.nextDueDate),
        lastPaidDate: new Date(data.lastPaidDate),
      })
      .where(
        and(
          eq(recurringBillsTable.id, id),
          eq(recurringBillsTable.userId, userId),
        ),
      );

    revalidatePath(`/bills/${id}/edit`);
    return {
      message: "Bill updated successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Update bill failed:", error);
    return {
      message: "Something went wrong while updating the bill.",
    };
  }
}

export async function deleteBill(id: string) {
  const userId = await validateUser();

  try {
    await db
      .delete(recurringBillsTable)
      .where(
        and(
          eq(recurringBillsTable.userId, userId),
          eq(recurringBillsTable.id, id),
        ),
      );

    revalidatePath("/dashboard/bills");

    return { message: "Bill deleted successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete bill.");
  }
}
