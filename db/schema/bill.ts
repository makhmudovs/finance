import {
  pgTable,
  text,
  numeric,
  timestamp,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { categoryEnum, frequencyEnum } from "./enums";
import { usersTable } from "./user";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const recurringBillsTable = pgTable("recurring_bills", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

  category: categoryEnum("category").notNull(),
  frequency: frequencyEnum("frequency").notNull(),

  nextDueDate: timestamp("next_due_date").notNull(),
  lastPaidDate: timestamp("last_paid_date"),

  autoDeduct: boolean("auto_deduct").default(false).notNull(),
  reminderDays: integer("reminder_days").default(3),

  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BillType = InferSelectModel<typeof recurringBillsTable>;
export type BillTableInsertType = InferInsertModel<typeof recurringBillsTable>;
