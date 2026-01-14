import { pgEnum } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", ["admin", "user"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);
export const categoryEnum = pgEnum("transaction_category", [
  "groceries",
  "transport",
  "entertainment",
  "bills",
  "shopping",
  "dining",
  "salary",
  "other",
]);
export const frequencyEnum = pgEnum("frequencies", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);
