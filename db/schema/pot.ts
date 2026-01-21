import { pgTable, text, numeric, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const potsTable = pgTable("pots", {
  id: uuid("id").defaultRandom().primaryKey(),

  
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  targetAmount: numeric("target_amount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),

  color: text("color"),
  icon: text("icon"),
  targetDate: timestamp("target_date"),

  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PotType = InferSelectModel<typeof potsTable>;
export type PotTableInsertType = InferInsertModel<typeof potsTable>;
