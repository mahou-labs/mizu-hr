import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { jobSelectSchema } from "@mizu-hr/schemas/job";
import { orpc } from "./orpc-client";

const electricUrl = `${import.meta.env.VITE_API_URL}/electric/jobs`;

export const jobsCollection = createCollection(
  electricCollectionOptions({
    id: "jobs",
    schema: jobSelectSchema,
    shapeOptions: {
      url: electricUrl,
      params: { table: "jobs" },
      columnMapper: snakeCamelMapper(),
      fetchClient: Object.assign(
        (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, credentials: "include" }),
        { preconnect: fetch.preconnect },
      ),
    },
    getKey: (job) => job.id,

    onInsert: async ({ transaction }) => {},
    onUpdate: async ({ transaction }) => {},
    onDelete: async ({ transaction }) => {
      const jobToDelete = transaction.mutations[0].original;
      await orpc.job.delete.call({ id: jobToDelete.id });

      // const deletedItem = transaction.mutations[0].original;
      // const { txid } = await deleteWorkbook({
      //   data: { id: deletedItem.id },
      // });
      // return { txid };
    },
  }),
);
