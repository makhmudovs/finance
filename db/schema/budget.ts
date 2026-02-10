import {
  pgTable,
  text,
  numeric,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { categoryEnum } from "./enums";
import { user } from "./auth-schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const budgetsTable = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  category: categoryEnum("category").notNull(),

  limit: numeric("limit", { precision: 12, scale: 2 }).notNull(),
  spent: numeric("spent", { precision: 12, scale: 2 }).default("0").notNull(),

  period: text("period").notNull(), // e.g. 2025-01
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BudgetType = InferSelectModel<typeof budgetsTable>;
export type BudgetTableInsertType = InferInsertModel<typeof budgetsTable>;
