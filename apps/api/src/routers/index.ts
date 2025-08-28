import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../utils/orpc";
import { organizationRouter } from "./organization";
import { todoRouter } from "./todo";
import { userRouter } from "./user";

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
  user: userRouter,
};

export type AppRouterClient = RouterClient<typeof appRouter>;
