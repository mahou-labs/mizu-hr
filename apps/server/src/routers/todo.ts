import { eq } from "drizzle-orm";
import z from "zod";
import { todo } from "../schema/todo";
import { getDb } from "../utils/db";
import { publicProcedure } from "../utils/orpc";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    return await getDb().select().from(todo);
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      return await getDb().insert(todo).values({
        text: input.text,
      });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      return await getDb()
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await getDb().delete(todo).where(eq(todo.id, input.id));
    }),
};
