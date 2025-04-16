import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { z } from "zod";
import {
  deleteSubject,
  getSubjectById,
  getSubjectsByUser,
  insertSubject,
} from "../queries/subjects";
import { queryOptions } from "@tanstack/react-query";

export const registerSubjectFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string(),
        syllabus: z.string(),
        userId: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data: { name, syllabus, userId } }) => {
    const data = await insertSubject(name, syllabus, userId);
    if (!data) throw notFound();
    return data;
  });

export const querySubjectFn = createServerFn({ method: "GET" })
  .validator((id: unknown) =>
    z
      .object({
        id: z.string(),
      })
      .parse(id)
  )
  .handler(async ({ data: { id } }) => {
    const data = await getSubjectById(id);
    if (!data) throw notFound();
    return data;
  });

export const queryUserSubjectsFn = createServerFn({ method: "GET" })
  .validator((userId: unknown) =>
    z
      .object({
        userId: z.string(),
      })
      .parse(userId)
  )
  .handler(async ({ data: { userId } }) => {
    const data = await getSubjectsByUser(userId);
    // if (data.length === 0) throw notFound();
    return data;
  });

export const queryUserSubjectsOptions = (userId: string) =>
  queryOptions({
    queryKey: ["userSubjects", userId],
    queryFn: () =>
      queryUserSubjectsFn({
        data: { userId },
      }),
  });

export const deleteSubjectFn = createServerFn({ method: "POST" }) // TODO: change to DELETE
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data: { id } }) => {
    const data = await deleteSubject(id);
    if (!data) throw notFound();
    return data;
  });
