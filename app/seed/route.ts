import bcrypt from "bcrypt";
import { db } from "@/db/index";
import {
  user,
  transactionsTable,
  budgetsTable,
  potsTable,
  recurringBillsTable,
} from "@/db/schema/index";
import {
  dummyUsers,
  dummyTransactions,
  dummyBudgets,
  dummyPots,
  dummyRecurringBills,
} from "@/app/lib/placeholder-data";

// async function seedUsers() {
//   // Optional: hash passwords before inserting (recommended!)
//   const usersWithHashedPasswords = await Promise.all(
//     dummyUsers.map(async (user) => ({
//       ...user,
//       password: await bcrypt.hash(user.password, 10),
//     }))
//   );

//   const insertedUsers = await db
//     .insert(user)
//     .values(usersWithHashedPasswords)
//     .returning({
//       id: user.id,
//       email: user.email,
//     });

//   return insertedUsers;
// }

async function seedTransactions() {
  return db.insert(transactionsTable).values(dummyTransactions);
}

async function seedBudgets() {
  return db.insert(budgetsTable).values(dummyBudgets);
}

async function seedPots() {
  return db.insert(potsTable).values(dummyPots);
}

async function seedRecurringBills() {
  return db.insert(recurringBillsTable).values(dummyRecurringBills);
}

export async function GET() {
  try {
    // 1. Seed users first (because other tables reference userId)
    // const users = await seedUsers();
    // console.log(`→ Inserted ${users.length} users`);

    // 2. Then seed everything else (can be parallel)
    const [transactions, budgets, pots, bills] = await Promise.all([
      seedTransactions(),
      seedBudgets(),
      seedPots(),
      seedRecurringBills(),
    ]);

    console.log(
      `→ Transactions: ${transactions.rowCount ?? 0}`,
      `Budgets: ${budgets.rowCount ?? 0}`,
      `Pots: ${pots.rowCount ?? 0}`,
      `Recurring Bills: ${bills.rowCount ?? 0}`
    );

    return Response.json({
      success: true,
      message: "Database seeded successfully",
      // usersInserted: users.length,
      details: {
        transactions: transactions.rowCount ?? 0,
        budgets: budgets.rowCount ?? 0,
        pots: pots.rowCount ?? 0,
        recurringBills: bills.rowCount ?? 0,
      },
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}