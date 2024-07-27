import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    boolean,
  } from "drizzle-orm/pg-core";
  
  export const todoListTable = pgTable("todolist", {
    id: uuid("id").primaryKey().defaultRandom(),
    todoText: varchar("todo_text", { length: 255 }).notNull(),
    isDone: boolean("is_done").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(
        () => new Date()
    ),
    tag: varchar("tag", { length: 255 }).notNull(),
    dueDate: timestamp("due_date"),
  });
  