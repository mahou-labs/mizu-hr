// import { env } from "./env";

// const ALLOWED_TABLES = ["jobs"] as const;
// type AllowedTable = (typeof ALLOWED_TABLES)[number];

// /** Per-table WHERE clauses that enforce organization-scoped row filtering. */
// const tableFilters: Record<AllowedTable, (orgId: string) => string> = {
//   jobs: (orgId) => `"organization_id" = '${orgId}'`,
// };

// export function isTableAllowed(table: string): table is AllowedTable {
//   return ALLOWED_TABLES.includes(table as AllowedTable);
// }

// /**
//  * Proxies a shape request to the local Electric SQL service,
//  * enforcing org-scoped row filtering on the given table.
//  */
// export async function proxyShapeRequest(opts: {
//   table: AllowedTable;
//   orgId: string;
//   clientUrl: URL;
//   ifNoneMatch?: string;
// }): Promise<Response> {
//   const { table, orgId, clientUrl, ifNoneMatch } = opts;
//   const clientParams = clientUrl.searchParams;

//   const electricParams = new URLSearchParams({
//     table,
//     where: tableFilters[table](orgId),
//     ...(clientParams.get("offset") && { offset: clientParams.get("offset")! }),
//     ...(clientParams.get("handle") && { handle: clientParams.get("handle")! }),
//     ...(clientParams.get("live") && { live: clientParams.get("live")! }),
//   });

//   const electricUrl = `${env.ELECTRIC_SQL_URL}/v1/shape?${electricParams.toString()}`;

//   const resp = await fetch(electricUrl, {
//     headers: {
//       ...(ifNoneMatch && { "if-none-match": ifNoneMatch }),
//     },
//   });

//   return new Response(resp.body, {
//     status: resp.status,
//     headers: resp.headers,
//   });
// }
