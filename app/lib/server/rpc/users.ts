import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "@tanstack/start/server";
import { auth } from "../auth";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user || null;
});
