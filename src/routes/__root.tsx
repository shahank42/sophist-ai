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
        description: `SophistAI is your intelligent study companion that turns any course syllabus into an interactive knowledge map. Just upload your syllabus, and watch as our advanced AI transforms it into a beautiful, navigable universe of connected concepts. No more chaos, just clarity.`,
      }),
    ],
    scripts: [
      {
        src: "https://cdn.paritydeals.com/banner.js",
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
        <ScriptOnce>
          {`function resolvePdSDKFunction(e,...t){return new Promise((n,i)=>{!function r(){window.ParityDealsSDK&&"function"==typeof window.ParityDealsSDK[e]?window.ParityDealsSDK[e](...t).then(n).catch(i):setTimeout(r,100)}()})}!function(e,t,n,i,r,a,c){e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(Array.prototype.slice.call(arguments))},a=t.createElement(n),c=t.getElementsByTagName(n)[0],a.id="parity-deals-sdk",a.async=1,a.src=r,c.parentNode.insertBefore(a,c)}(window,document,"script","ParityDealsSDK","https://cdn.paritydeals.com/paritydeals-sdk/0.0.3/paritydeals-sdk.min.js"),window.ParityDeals={init:function(e){ParityDealsSDK("init",e)},getUpdatedPrice:function(e,t){return resolvePdSDKFunction("getUpdatedPrice",e,t)},updatePriceElement:function(e,t){return resolvePdSDKFunction("updatePriceElement",e,t)},updatePrice:function(e){return resolvePdSDKFunction("updatePrice",e)}};

// Initialize ParityDeals SDK
ParityDeals.init({
  convertToLocal: true, // Convert prices to local currency
  // Pass options as needed
});`}
        </ScriptOnce>

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
