import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { dbClient } from "@db/client";
import { todoTable } from "@db/schema";
import { eq } from "drizzle-orm";

//Intializing the express app
const app = express();

//Middleware
app.use(helmet());
app.use(
  cors({
    origin: false, // Disable CORS
    // origin: "*", // Allow all origins
  })
);
// Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());

// Query
app.get("/todo", async (req, res, next) => {
  try {
    const results = await dbClient.query.todoTable.findMany();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Insert
app.put("/todo", async (req, res, next) => {
  try {
    const todoText = req.body.todoText ?? "";
    if (!todoText) throw new Error("Empty todoText");
    const result = await dbClient
      .insert(todoTable)
      .values({
        todoText,
      })
      .returning({ id: todoTable.id, todoText: todoTable.todoText });
    res.json({ msg: `Insert successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// Update
app.patch("/todo", async (req, res, next) => {
  try {
    const id = req.body.id ?? "";
    const todoText = req.body.todoText ?? "";
    if (!todoText || !id) throw new Error("Empty todoText or id");

    // Check for existence if data
    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    const result = await dbClient
      .update(todoTable)
      .set({ todoText })
      .where(eq(todoTable.id, id))
      .returning({ id: todoTable.id, todoText: todoTable.todoText });
    res.json({ msg: `Update successfully`, data: result });
  } catch (err) {
    next(err);
  }
});

// Delete
app.delete("/todo", async (req, res, next) => {
  try {
    const id = req.body.id ?? "";
    if (!id) throw new Error("Empty id");

    // Check for existence if data
    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    await dbClient.delete(todoTable).where(eq(todoTable.id, id));
    res.json({
      msg: `Delete successfully`,
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

app.post("/todo/all", async (req, res, next) => {
  try {
    await dbClient.delete(todoTable);
    res.json({
      msg: `Delete all rows successfully`,
      data: {},
    });
  } catch (err) {
    next(err);
  }
});

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let serializedError = JSON.stringify(err, Object.getOwnPropertyNames(err));
  serializedError = serializedError.replace(/\/+/g, "/");
  serializedError = serializedError.replace(/\\+/g, "/");
  res.status(500).send({ error: serializedError });
};
app.use(jsonErrorHandler);

// Running app
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
