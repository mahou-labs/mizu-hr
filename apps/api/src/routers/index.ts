import { protectedProcedure, publicProcedure } from "../utils/orpc";
import { organizationRouter } from "./organization";
import { todoRouter } from "./todo";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  todo: todoRouter,
  organization: organizationRouter,
};
export type AppRouter = typeof appRouter;
