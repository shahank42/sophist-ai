import { eq } from "drizzle-orm";
import { db } from "../db";
import { nodes } from "../db/schema";

// export const insertNode = async (
//   subjectId: string,
//   title: string,
//   parentId: string | null,
//   position: number
// ) => {
//   const data = await db
//     .insert(nodes)
//     .values({
//       subjectId,
//       parentId,
//       title,
//       position,
//     })
//     .returning();

//   return data.length === 0 ? undefined : data[0];
// };

export const insertNodes = async (
  nodesToInsert: Array<{
    subjectId: string;
    parentId: string | null;
    title: string;
    position: number;
  }>
) => {
  const data = await db.insert(nodes).values(nodesToInsert).returning();

  return data;
};

export const queryNodesForSubject = async (subjectId: string) => {
  const data = await db
    .select()
    .from(nodes)
    .where(eq(nodes.subjectId, subjectId));
  return data;
};

export const queryNodeById = async (id: string) => {
  const data = await db.select().from(nodes).where(eq(nodes.id, id));
  return data[0];
};
