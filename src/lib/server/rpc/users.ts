import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "../auth";
import { getUserProStatus } from "../queries/users";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  const user = session?.user || null;
  console.log("User from server:", headers, session, user);
  return user;
});

export const getUserProStatusFn = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data: { userId } }) => {
    const user = await getUserProStatus(userId);
    if (!user) {
      throw new Error("User not authenticated");
    }
    return {
      isPro: user.isPro,
      proStartDate: user.proStartDate,
      proEndDate: user.proEndDate,
    };
  });

// export const setUserProFn = createServerFn({ method: "POST" })
//   .validator((data: unknown) =>
//     z
//       .object({
//         isPro: z.boolean(),
//       })
//       .parse(data)
//   )
//   .handler(async ({ data: { isPro } }) => {
//     const user = await getUser();

//     if (!user) {
//       throw new Error("User not authenticated");
//     }

//     await setUserProStatus(user.id, isPro);

//     return { success: true, newProStatus: isPro };
//   });
