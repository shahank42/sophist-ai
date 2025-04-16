import { AppSidebar } from "@/components/layout/app-sidebar";
import Navbar from "@/components/layout/navbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  createRootRoute,
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import appCss from "../styles/app.css?url";
import { seo } from "@/lib/seo";
import { Meta } from "@tanstack/react-start";
import React, { ReactNode, Suspense } from "react";
import { NotFound } from "@/components/not-found";
import { getUser } from "@/lib/server/rpc/users";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ScriptOnce } from "@tanstack/react-router";
import { Scripts } from "@tanstack/react-router";
import { HeadContent } from "@tanstack/react-router";

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
        description: `SophistAI is your intelligent study companion that turns any course syllabus into an interactive knowledge map. Just upload your syllabus, and watch as our advanced AI transforms it into a beautiful, navigable universe of connected concepts. No more chaos, just clarity.`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
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

  beforeLoad: async () => {
    const user = await getUser();
    return { user };
  },

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
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>

        <SidebarProvider>{children}</SidebarProvider>
        <ScrollRestoration />
        <Toaster richColors />

        <Suspense>
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
            buttonPosition="bottom-right"
          />
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>

        <Scripts />
      </body>
    </html>
  );
}
