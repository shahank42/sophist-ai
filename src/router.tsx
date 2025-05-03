// app/router.tsx
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

export function createRouter() {
  const queryClient = new QueryClient();

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: "intent",
      defaultPreloadStaleTime: 0,
      scrollRestoration: true,
    }),
    queryClient
  );

  nProgress.configure({
    showSpinner: false
  })

  const loadNProgress = async () => {
    let nProgress = await import('nprogress');
    await import('nprogress/nprogress.css');

    router.subscribe('onBeforeLoad', ({ pathChanged }) => {
      if (pathChanged) {
        nProgress.start();
      }
    });

    router.subscribe('onLoad', () => {
      nProgress.done();
    });
  };
  loadNProgress();
  
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
