import { zValidator } from "@hono/zod-validator";
import { Prisma, PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";
import { getUser } from "../src/kinde";

const { TodoSchema } = require("../validation_schemas/todo.schema");
const prisma = new PrismaClient();
type TodoItem = z.infer<typeof TodoSchema>;
const createTodoItemSchema = TodoSchema.omit({ id: true, task: true });


export const todoRoute = new Hono()
  
  .get("/",getUser, async (c) => {
    try {
      const user = c.var.user;
      const todoItems = await prisma.todoList.findMany({
        where: { userId: user.id },
      });
      return c.json(todoItems);
    } catch (error) {
      console.error("Error getting TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .get("/:id",getUser, async (c) => {
    try {
      const id = c.req.param('id');
      const user = c.var.user;
      const todoItem = await prisma.todoList.findUnique({
        where: { id: Number(id) },
      });
      if (!todoItem) {
        return c.json({ error: "TodoItem not found" }, 404);
      }
      if (todoItem.userId !== user.id) {
        return c.json({ error: "Forbidden: You do not have permission to view this item" }, 403);
      }
    
      return c.json(todoItem);
    } catch (error) {
      console.error("Error getting TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post("/",getUser, zValidator("json", createTodoItemSchema), async (c) => {
    try {
      const todoItem: TodoItem = await c.req.valid("json");
      const createdTodoItem = await prisma.todoList.create({
        data: { ...todoItem},
      });
      return c.json(createdTodoItem);
    } catch (error) {
      console.error("Error creating TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .delete("/:id",getUser, async (c) => {
    try {

      const idUrl = Number(c.req.param("id"));
      const user = c.var.user;
      
      const deletedTodoItem = await prisma.todoList.delete({
        where: { 
          id: Number(idUrl),
          userId: user.id
        },
      });


      if (deletedTodoItem.userId !== user.id) {
        return c.json({ error: "Forbidden: You do not have permission to delete this item" }, 403);
      }

      return c.json(deletedTodoItem);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        return c.json({ error: "TodoItem not found" }, 404);
      }
      console.error("Error deleting TodoItem:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .patch("/:id/done",getUser, async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const user = c.var.user;
      const updatedTodoItem = await prisma.todoList.update({
        where: { 
          id: Number(id),
          userId: user.id
        },
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
  .put("/:id",getUser,zValidator("json", createTodoItemSchema), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const todoItem: TodoItem = await c.req.valid("json");
      
      const updatedItem = await prisma.todoList.update({
        where: { id: Number(id) },
        data: {...todoItem}
      })
      return c.json(updatedItem);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        return c.json({ error: "TodoItem not found" }, 404);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  });
