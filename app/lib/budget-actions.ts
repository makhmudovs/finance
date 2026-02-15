"use server";

import { db } from "@/db/index";
import { budgetsTable, user } from "@/db/schema/index";
import { auth } from "@/lib/auth";
import { reddit } from "better-auth";
import { or, ilike, sql, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const ITEMS_PER_PAGE = 6;
export async function fetchBudgetPages(query: string) {
  try {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(budgetsTable)
      .innerJoin(user, sql`${budgetsTable.userId} = ${user.id}`)
      .where(
        or(
          ilike(sql`${budgetsTable.category}::text`, `%${query}%`),

          // text columns
          ilike(budgetsTable.name, `%${query}%`),
          ilike(budgetsTable.period, `%${query}%`),

          // numeric / timestamp → text
          ilike(sql`${budgetsTable.limit}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.spent}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.startDate}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.endDate}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.createdAt}::text`, `%${query}%`),
        ),
      );

    const totalPages = Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of budgets.");
  }
}

export async function fetchFilteredBudgets(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const result = await db
      .select({
        id: budgetsTable.id,
        name: budgetsTable.name,
        category: budgetsTable.category,
        limit: budgetsTable.limit,
        spent: budgetsTable.spent,
        period: budgetsTable.period,
        startDate: budgetsTable.startDate,
        endDate: budgetsTable.endDate,
        isActive: budgetsTable.isActive,
        createdAt: budgetsTable.createdAt,
      })
      .from(budgetsTable)
      .innerJoin(user, sql`${budgetsTable.userId} = ${user.id}`)
      .where(
        or(
          // ✅ ENUM → TEXT
          ilike(sql`${budgetsTable.category}::text`, `%${query}%`),

          // text columns
          ilike(budgetsTable.name, `%${query}%`),
          ilike(budgetsTable.period, `%${query}%`),

          // numeric / timestamp → text
          ilike(sql`${budgetsTable.limit}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.spent}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.startDate}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.endDate}::text`, `%${query}%`),
          ilike(sql`${budgetsTable.createdAt}::text`, `%${query}%`),
        ),
      )
      .orderBy(desc(budgetsTable.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch budget.");
  }
}

export async function fetchBudgetById(id: string) {
  try {
    const data = await db
      .select()
      .from(budgetsTable)
      .where(eq(budgetsTable.id, id))
      .limit(1);

    if (!data[0]) {
      throw new Error("Transaction not found");
    }

    // Convert amount from cents to dollars
    const budget = {
      ...data[0],
      limit: String(parseFloat(data[0].limit) / 100),
      spent: String(parseFloat(data[0].spent) / 100),
    };

    return budget;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch budget.");
  }
}

export type CreateBudgetState = {
  errors?: {
    name?: string[];
    category?: string[];
    limit?: string[];
    spent?: string[];
    period?: string[];
    startDate?: string[];
    endDate?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  name: z.string().min(3, "Name cannot be empty"),
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
      message: "Please select transaction category",
    },
  ),
  limit: z.coerce.number().gt(0, "Please enter an amount greater than $0"),
  spent: z.coerce.number().gt(0, "Please enter an amount greater than $0"),
  period: z.string().min(1, "Please enter a description"),
  startDate: z.string().min(1, "Please enter a description"),
  endDate: z.string().min(1, "Please enter a description"),
  isActive: z.boolean().optional(),
});

export async function createBudget(
  _prevState: CreateBudgetState | undefined,
  formData: FormData,
): Promise<CreateBudgetState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const parsed = FormSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    limit: formData.get("limit"),
    spent: formData.get("spent"),
    period: formData.get("period"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return {
      errors: {
        name: errors.properties?.name?.errors,
        category: errors.properties?.category?.errors,
        limit: errors.properties?.limit?.errors,
        spent: errors.properties?.spent?.errors,
        period: errors.properties?.period?.errors,
        startDate: errors.properties?.startDate?.errors,
        endDate: errors.properties?.endDate?.errors,
      },
      message: "Validation failed",
    };
  }

  const { name, category, limit, spent, period, startDate, endDate } =
    parsed.data;

  const limitInCents = (limit * 100).toString();
  const spentInCents = (spent * 100).toString();

  try {
    await db.insert(budgetsTable).values({
      userId,
      name,
      category,
      limit: limitInCents,
      spent: spentInCents,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdAt: new Date(),
    });

    revalidatePath("/dashboard/budgets");
    return {
      message: "Transaction created successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Budget creation failed:", error);
    return {
      message: "Something went wrong while creating the transaction.",
    };
  }
}

export async function deleteBudget(id: string) {
  try {
    await db.delete(budgetsTable).where(eq(budgetsTable.id, id));

    revalidatePath("/dashboard/budgets");

    return { message: "Budget deleted successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete budget.");
  }
}

export type UpdateBudgetState = {
  errors?: {
    name?: string[];
    category?: string[];
    limit?: string[];
    spent?: string[];
    period?: string[];
    startDate?: string[];
    endDate?: string[];
    isActive?: string[];
  };
  message?: string | null;
};

export async function updateBudget(
  id: string,
  _prevState: UpdateBudgetState,
  formData: FormData,
): Promise<UpdateBudgetState> {
  /* ---------- Validation ---------- */

  const rawIsActive = formData.get("isActive");
  const isActiveBoolean = rawIsActive === "true";

  const parsed = FormSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    limit: formData.get("limit"),
    spent: formData.get("spent"),
    period: formData.get("period"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    isActive: isActiveBoolean,
  });

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);
    return {
      errors: {
        name: errors.properties?.name?.errors,
        category: errors.properties?.category?.errors,
        limit: errors.properties?.limit?.errors,
        spent: errors.properties?.spent?.errors,
        period: errors.properties?.period?.errors,
        startDate: errors.properties?.startDate?.errors,
        endDate: errors.properties?.endDate?.errors,
        isActive: errors.properties?.isActive?.errors,
      },
      message: "Validation failed",
    };
  }

  /* ---------- DB Update ---------- */
  const { name, category, limit, spent, period, startDate, endDate, isActive } =
    parsed.data;

  const limitInCents = (limit * 100).toString();
  const spentInCents = (spent * 100).toString();

  console.log("form", {
    name,
    category,
    limit,
    spent,
    period,
    startDate,
    endDate,
    isActive,
  });

  try {
    await db
      .update(budgetsTable)
      .set({
        name,
        category,
        limit: limitInCents,
        spent: spentInCents,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      })
      .where(eq(budgetsTable.id, id));

    revalidatePath(`/budgets/${id}/edit`);
    return {
      message: "Budget updated successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Update budget failed:", error);
    return {
      message: "Something went wrong while updating the budget.",
    };
  }
}

export async function deleteTransaction(id: string) {
  try {
    await db.delete(budgetsTable).where(eq(budgetsTable.id, id));

    revalidatePath("/dashboard/budgets");

    return { message: "Budget deleted successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete budget.");
  }
}
