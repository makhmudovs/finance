import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  varchar,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { userTypeEnum } from "./enums";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  created_time: timestamp("created_time").notNull(),
  updated_time: timestamp("updated_time"),
  deleted: boolean("deleted").default(false),
  user_type: userTypeEnum("user_type").notNull(),
});

export type UsersType = InferSelectModel<typeof usersTable>;
