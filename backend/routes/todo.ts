import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';
import { z } from 'zod';


const { TodoSchema } = require('../validation_schemas/todo.schema');
const prisma = new PrismaClient();
type TodoItem = z.infer<typeof TodoSchema>;
const createTodoItemSchema = TodoSchema.omit({ id: true });

export const todoRoute = new Hono()
    .get('/', async (c) => {
        try {
            const todoItems = await prisma.todoList.findMany();
            return c.json(todoItems);
        }
        catch (error) {
            return c.json({ error: 'Internal server error' }, 500);
          }
    })
    .get('/:id', async (c) => {
        try {
            const id = Number(c.req.param('id'));
            const todoItem = await prisma.todoList.findUnique({ where: { id } });
            return c.json(todoItem);
        }
        catch (error) {
            return c.json({ error: 'Internal server error' }, 500);
        }
    })
    .post('/', zValidator('json',createTodoItemSchema), async (c) => {
        try {
            const todoItem:TodoItem = await c.req.valid("json")
            const createdTodoItem = await prisma.todoList.create({ data: { ...todoItem } });
            return c.json(createdTodoItem);   
        }
        catch (error) {
            console.error('Error creating TodoItem:', error);
            return c.json({ error: 'Internal server error' }, 500);
          }
    }
)

   
   