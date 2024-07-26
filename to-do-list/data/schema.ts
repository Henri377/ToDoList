import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.number(),
  userId: z.string(),
  title: z.string(),
  status: z.enum(["BACKLOG", "TODO","PROGRESS","DONE","CANCELED"]),
  priority: z.enum(["MEDIUM", "HIGH","LOW"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Task = z.infer<typeof taskSchema>