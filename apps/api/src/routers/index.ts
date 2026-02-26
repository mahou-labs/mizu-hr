import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../utils/orpc";
import { candidateRouter } from "./candidate";
import { jobRouter } from "./job";
import { orgInviteRouter } from "./org-invite";
import { organizationRouter } from "./organization";
import { userRouter } from "./user";
import { waitlistRouter } from "./waitlist";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.user,
    };
  }),
  candidate: candidateRouter,
  job: jobRouter,
  organization: organizationRouter,
  orgInvite: orgInviteRouter,
  user: userRouter,
  waitlist: waitlistRouter,
};

export type AppRouterClient = RouterClient<typeof appRouter>;
