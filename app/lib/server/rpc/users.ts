import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "@tanstack/start/server";
import { auth } from "../auth";
import { setUserProStatus } from "../queries/users";
import { z } from "zod";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user || null;
});

export const setUserProFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        isPro: z.boolean(),
      })
      .parse(data)
  )
  .handler(async ({ data: { isPro } }) => {
    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    await setUserProStatus(user.id, isPro);

    return { success: true, newProStatus: isPro };
  });
