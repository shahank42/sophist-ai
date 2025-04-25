import { NotFound } from "@/components/not-found";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { seo } from "@/lib/seo";
import { getUser } from "@/lib/server/rpc/users";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
  ScrollRestoration,
} from "@tanstack/react-router";
import React, { ReactNode, Suspense } from "react";
import appCss from "../styles/app.css?url";

// export const __filename = fileURLToPath(import.meta.url);
// export const __dirname = dirname(__filename);

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async ({ context }) => {
    // const user = await getUser();
    const user = await context.queryClient.fetchQuery({
      queryKey: ["user"],
      queryFn: ({ signal }) => getUser({ signal }),
    });
    return { user };
  },

  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "SophistAI - Your Personal Syllabus Navigator",
        description: `Transform your course syllabus into an interactive knowledge map with SophistAI. Boost your studying efficiency and ace your exams with our AI-powered study companion.`,
        image: "/og-image.png",
        keywords:
          "Syllabus Navigator, Interactive Knowledge Map, AI-powered Study Companion, Study Efficiency, Exam Preparation, Mind Map, Syllabus, Syllabus Map, Study Tool, AI Study Assistant, Curriculum Mapping, Personalized Learning, Academic Success, Study Planner, Adaptive Learning, Knowledge Graph, Sophist App",
      }),
    ],
    scripts: [
      {
        defer: true,
        src: "https://sophistai-analytics.vercel.app/script.js",
        "data-website-id": "48fb1526-8d79-4b62-b52c-b402775b37fa",
      },
      {
        src: "https://analytics.ahrefs.com/analytics.js",
        "data-key": "TGCXIlJ08CgTgavhRPRnQg",
        async: true,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      { rel: "shortcut icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "apple-mobile-web-app-title", content: "SophistAI" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),

  component: RootComponent,

  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body className="font-nunito">
        {/* <ScriptOnce>
          {`

          `}
        </ScriptOnce> */}

        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>

        <SidebarProvider data-vaul-drawer-wrapper="">
          {children}
        </SidebarProvider>
        <ScrollRestoration />
        <Toaster richColors />

        <Suspense>
          <ReactQueryDevtools
            initialIsOpen={false}
            position="top"
            buttonPosition="bottom-right"
          />
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>

        <Scripts />
      </body>
    </html>
  );
}
