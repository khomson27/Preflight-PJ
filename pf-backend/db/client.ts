import { drizzle } from "drizzle-orm/postgres-js";
import * as todolist from "@db/todolist";
import postgres from "postgres";
import { connectionString } from "@db/utils";

export const dbConn = postgres(connectionString);

export const dbClient = drizzle(dbConn, { schema: todolist, logger: true });
