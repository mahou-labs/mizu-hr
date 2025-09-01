/** biome-ignore-all assist/source/organizeImports: react-scan */
import { scan } from "react-scan";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { orpc } from "@/utils/orpc";
import appCss from "../index.css?url";

type RouterAppContext = {
  orpc: typeof orpc;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      orpc.user.getSession.queryOptions()
    );

    return { session };
  },
});

function RootDocument() {
  useEffect(() => {
    scan({
      enabled: import.meta.env.DEV,
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: dark mode script
          dangerouslySetInnerHTML={{
            __html: `;(()=>{try{var s=localStorage.getItem('theme');var q=window.matchMedia('(prefers-color-scheme: dark)');var d=s?s==='dark':q.matches;var r=document.documentElement;r.classList.toggle('dark',d);var m=document.createElement('meta');m.name='color-scheme';m.content=d?'dark light':'light dark';document.head.appendChild(m);if(!s&&q.addEventListener){q.addEventListener('change',e=>{r.classList.toggle('dark',e.matches)})}}catch(e){}})();`,
          }}
        /> */}
      </head>
      <body>
        {/* <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: dark mode script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.toggle('dark',document.documentElement.classList.contains('dark'));`,
          }}
        /> */}
        <div className="h-svh bg-sidebar">
          <Outlet />
        </div>

        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
        <Scripts />
      </body>
    </html>
  );
}
