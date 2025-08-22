import { getAuth } from "../utils/auth";
import { publicProcedure } from "../utils/orpc";

export const userRouter = {
  getUserSession: publicProcedure.handler(
    async ({ context: { headers, db } }) => {
      const auth = getAuth(db);
      return await auth.api.getSession({ headers });
    }
  ),
};
