const { z } = require('zod');

const TodoSchema = z.object({
  id: z.string().optional(), 
  title: z.string().min(1, { message: "Title must not be empty" }), 
  description: z.string().optional(), 
  completed: z.boolean(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
});

module.exports = { TodoSchema };