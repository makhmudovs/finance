import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { categoryEnum, transactionTypeEnum } from "./enums";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  transaction_type: transactionTypeEnum("transaction_type").notNull(),
  category: categoryEnum("category").notNull(),

  description: text("description"),
  merchant: text("merchant"),

  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TransactionType = InferSelectModel<typeof transactionsTable>;
export type TransactionTableInsertType = InferInsertModel<
  typeof transactionsTable
>;
