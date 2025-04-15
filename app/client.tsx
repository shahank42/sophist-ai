// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/start";
import { createRouter } from "./router";
// import { ThemeProvider } from "./components/providers/theme-provider";

const router = createRouter();

hydrateRoot(
  document!,
  <>
    {/* <ThemeProvider> */}
    <StartClient router={router} />
    {/* </ThemeProvider> */}
  </>
);
