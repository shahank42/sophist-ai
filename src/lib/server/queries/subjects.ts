import { eq } from "drizzle-orm";
import { db } from "../db";
import { subjects } from "../db/schema";

export const getSubjectById = async (id: string) => {
  const data = await db.select().from(subjects).where(eq(subjects.id, id));

  return data[0];
};

export const getSubjectsByUser = async (userId: string) => {
  const data = await db
    .select()
    .from(subjects)
    .where(eq(subjects.createdBy, userId));

  return data;
};

export const insertSubject = async (
  name: string,
  syllabus: string,
  userId: string
) => {
  const data = await db
    .insert(subjects)
    .values({
      name,
      rawSyllabus: syllabus,
      createdBy: userId,
    })
    .returning();

  return data.length === 0 ? undefined : data[0];
};

export const deleteSubject = async (id: string) => {
  const data = await db.delete(subjects).where(eq(subjects.id, id)).returning();

  return data[0];
};
