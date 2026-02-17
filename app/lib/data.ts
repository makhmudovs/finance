"use server";

import { db } from "@/db/index";
import { transactionsTable, user } from "@/db/schema/index";
import { and, or, ilike, sql, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function validateUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    auth.api.signOut();
    redirect("/login");
  }

  return session.user.id;
}

const ITEMS_PER_PAGE = 6;
export async function fetchTransactionPages(query: string) {
  const userId = await validateUser();
  try {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(transactionsTable)
      // Join users only if you actually need to search by user.name or user.email
      .innerJoin(user, eq(transactionsTable.userId, user.id))
      .where(
        and(
          eq(transactionsTable.userId, userId), // CRITICAL: Security scoping
          or(
            ilike(user.name, `%${query}%`),
            ilike(user.email, `%${query}%`),
            ilike(sql`${transactionsTable.amount}::text`, `%${query}%`),
            ilike(sql`${transactionsTable.date}::text`, `%${query}%`),
          ),
        ),
      );

    const totalPages = Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredTransactions(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    auth.api.signOut();
    redirect("/login");
  }

  const userId = session.user.id;
  try {
    const result = await db
      .select({
        id: transactionsTable.id,
        amount: transactionsTable.amount,
        transaction_type: transactionsTable.transaction_type,
        category: transactionsTable.category,
        description: transactionsTable.description,
        merchant: transactionsTable.merchant,
        date: transactionsTable.date,
        createdAt: transactionsTable.createdAt,
      })
      .from(transactionsTable)
      .innerJoin(user, sql`${transactionsTable.userId} = ${user.id}`)
      .where(
        and(
          eq(transactionsTable.userId, userId),
          or(
            // ✅ ENUM → TEXT
            ilike(
              sql`${transactionsTable.transaction_type}::text`,
              `%${query}%`,
            ),
            ilike(sql`${transactionsTable.category}::text`, `%${query}%`),

            // text columns
            ilike(transactionsTable.description, `%${query}%`),
            ilike(transactionsTable.merchant, `%${query}%`),

            // numeric / timestamp → text
            ilike(sql`${transactionsTable.amount}::text`, `%${query}%`),
            ilike(sql`${transactionsTable.date}::text`, `%${query}%`),
            ilike(sql`${transactionsTable.createdAt}::text`, `%${query}%`),
          ),
        ),
      )
      .orderBy(desc(transactionsTable.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transactions.");
  }
}

export async function fetchTransactionById(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    auth.api.signOut();
    redirect("/login");
  }

  const userId = session.user.id;
  try {
    const data = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, id))
      .limit(1);

    if (!data[0]) {
      throw new Error("Transaction not found");
    }

    // Convert amount from cents to dollars
    const transaction = {
      ...data[0],
      amount: String(parseFloat(data[0].amount) / 100),
    };

    return transaction;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transaction.");
  }
}
