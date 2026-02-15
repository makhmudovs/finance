"use server";

import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export type CreateTransactionState = {
  errors?: {
    merchant?: string[];
    amount?: string[];
    transaction_type?: string[];
    transaction_category?: string[];
    date?: string[];
    description?: string[];
  };
  message?: string | null;
};

/* ---------------------------------- */
/* Schema                             */
/* ---------------------------------- */

const FormSchema = z.object({
  merchant: z.string().min(1, "Merchant cannot be empty"),
  amount: z.coerce.number().gt(0, "Please enter an amount greater than $0"),
  transaction_type: z.enum(["expense", "income"], {
    message: "Please select transaction type",
  }),
  transaction_category: z.enum(
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
    }
  ),
  date: z.string().min(1, "Please enter a date"),
  description: z.string().min(1, "Please enter a description"),
});

/* ---------------------------------- */
/* Server Action                      */
/* ---------------------------------- */

export async function createTransaction(
  _prevState: CreateTransactionState | undefined,
  formData: FormData
): Promise<CreateTransactionState> {
  /* ---------- Auth ---------- */
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  /* ---------- Validation ---------- */
  const parsed = FormSchema.safeParse({
    merchant: formData.get("merchant"),
    amount: formData.get("amount"),
    transaction_type: formData.get("transaction_type"),
    transaction_category: formData.get("transaction_category"),
    date: formData.get("date"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return {
      errors: {
        merchant: errors.properties?.merchant?.errors,
        amount: errors.properties?.amount?.errors,
        transaction_type: errors.properties?.transaction_type?.errors,
        transaction_category: errors.properties?.transaction_category?.errors,
        date: errors.properties?.date?.errors,
        description: errors.properties?.description?.errors,
      },
      message: "Validation failed",
    };
  }

  /* ---------- DB Insert ---------- */
  const {
    merchant,
    amount,
    transaction_type,
    transaction_category,
    date,
    description,
  } = parsed.data;

  const amountInCents = (amount * 100).toString();

  try {
    await db.insert(transactionsTable).values({
      userId,
      amount: amountInCents,
      transaction_type,
      category: transaction_category,
      description,
      merchant,
      date: new Date(date),
      createdAt: new Date(),
    });

    revalidatePath("/dashboard/transactions");

    return {
      message: "Transaction created successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Create transaction failed:", error);

    return {
      message: "Something went wrong while creating the transaction.",
    };
  }
}

export type UpdateTransactionState = {
  errors?: {
    merchant?: string[];
    amount?: string[];
    transaction_type?: string[];
    transaction_category?: string[];
    date?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function updateTransaction(
  id: string,
  _prevState: UpdateTransactionState,
  formData: FormData
): Promise<UpdateTransactionState> {
  /* ---------- Validation ---------- */
  const parsed = FormSchema.safeParse({
    merchant: formData.get("merchant"),
    amount: formData.get("amount"),
    transaction_type: formData.get("transaction_type"),
    transaction_category: formData.get("transaction_category"),
    date: formData.get("date"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);
    return {
      errors: {
        merchant: errors.properties?.merchant?.errors,
        amount: errors.properties?.amount?.errors,
        transaction_type: errors.properties?.transaction_type?.errors,
        transaction_category: errors.properties?.transaction_category?.errors,
        date: errors.properties?.date?.errors,
        description: errors.properties?.description?.errors,
      },
      message: "Validation failed",
    };
  }

  /* ---------- DB Update ---------- */
  const {
    merchant,
    amount,
    transaction_type,
    transaction_category,
    date,
    description,
  } = parsed.data;

  const amountInCents = (amount * 100).toString();

  try {
    await db
      .update(transactionsTable)
      .set({
        merchant,
        amount: amountInCents,
        transaction_type,
        category: transaction_category,
        date: new Date(date),
        description,
      })
      .where(eq(transactionsTable.id, id));

    revalidatePath(`/transactions/${id}/edit`);

    return {
      message: "Transaction updated successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Update transaction failed:", error);
    return {
      message: "Something went wrong while updating the transaction.",
    };
  }
}

export async function deleteTransaction(id: string) {
  try {
    await db.delete(transactionsTable).where(eq(transactionsTable.id, id));

    revalidatePath("/dashboard/transactions");

    return { message: "Transaction deleted successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete transaction.");
  }
}
