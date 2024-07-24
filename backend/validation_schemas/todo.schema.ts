const { z } = require('zod');

const TodoSchema = z.object({
  id: z.string().optional(), 
  title: z.string().min(1, { message: "Title must not be empty" }), 
  task: z.string().optional(), 
  status: z.enum(["BACKLOG", "TODO","PROGRESS","DONE","CANCELED"]).optional().default('BACKLOG'),
  priority: z.enum(["MEDIUM", "HIGH","LOW"]).optional().default('LOW'),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
});

module.exports = { TodoSchema };