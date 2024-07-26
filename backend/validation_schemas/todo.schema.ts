const { z } = require('zod');

const TodoSchema = z.object({
  id: z.number().optional(),
  userId: z.string(), 
  title: z.string().min(1, { message: "Title must not be empty" }), 
  status: z.enum(["BACKLOG", "TODO","PROGRESS","DONE","CANCELED"]).default('BACKLOG'),
  priority: z.enum(["MEDIUM", "HIGH","LOW"]).default('LOW'),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
});

module.exports = { TodoSchema };