import { os } from "@orpc/server";
import { z } from "zod";
import type { Context } from "./context";

export const o = os.$context<Context>();

const requireAuth = o
  .errors({
    UNAUTHORIZED: {
      status: 401,
      message: "Unauthorized",
      data: z.object({ invalidSession: z.boolean() }),
    },
  })
  .middleware(({ context, errors, next }) => {
    if (!context?.user) {
      throw errors.UNAUTHORIZED({ data: { invalidSession: true } });
    }

    return next({
      context: {
        session: context.session,
      },
    });
  });

export const publicProcedure = o;
export const protectedProcedure = publicProcedure.use(requireAuth);
