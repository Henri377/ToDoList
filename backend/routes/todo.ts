import { zValidator } from "@hono/zod-validator";
import { Prisma, PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";

const { TodoSchema } = require("../validation_schemas/todo.schema");
const prisma = new PrismaClient();
type TodoItem = z.infer<typeof TodoSchema>;
const createTodoItemSchema = TodoSchema.omit({ id: true, task: true });

export const todoRoute = new Hono()
  .get("/", async (c) => {
    try {
      const todoItems = await prisma.todoList.findMany();
      return c.json(todoItems);
    } catch (error) {
      console.error("Error getting TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .get("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const todoItem = await prisma.todoList.findUnique({
        where: { id: Number(id) },
      });
      if (!todoItem) {
        return c.json({ error: "TodoItem not found" }, 404);
      }
      return c.json(todoItem);
    } catch (error) {
      console.error("Error getting TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post("/", zValidator("json", createTodoItemSchema), async (c) => {
    try {
      const todoItem: TodoItem = await c.req.valid("json");
      const createdTodoItem = await prisma.todoList.create({
        data: { ...todoItem },
      });
      return c.json(createdTodoItem);
    } catch (error) {
      console.error("Error creating TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const deletedTodoItem = await prisma.todoList.delete({
        where: { id: Number(id) },
      });
      return c.json(deletedTodoItem);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        return c.json({ error: "TodoItem not found" }, 404);
      }
      console.error("Error deleting TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .patch("/:id/done", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const updatedTodoItem = await prisma.todoList.update({
        where: { id: Number(id) },
        data: { status: "DONE" },
      });
      return c.json(updatedTodoItem);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        return c.json({ error: "TodoItem not found" }, 404);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .put("/:id", zValidator("json", TodoSchema), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const data = await c.req.json();
      const upadatedItem = await prisma.todoList.update({
        where: { id: Number(id) },
        data: { ...data }
      })
      return c.json(upadatedItem);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        return c.json({ error: "TodoItem not found" }, 404);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  });
