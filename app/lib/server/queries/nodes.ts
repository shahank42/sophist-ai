import { eq, inArray } from "drizzle-orm";
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
    .where(eq(nodes.subjectId, subjectId))
    .orderBy(nodes.position);
  return data;
};

export const queryNodeById = async (id: string) => {
  const data = await db.select().from(nodes).where(eq(nodes.id, id));
  return data[0];
};

export const setNodeCompleted = async (id: string, completed: boolean) => {
  const data = await db
    .update(nodes)
    .set({
      completed,
    })
    .where(eq(nodes.id, id))
    .returning();
};

export const setNodesCompleted = async (ids: string[], completed: boolean) => {
  const data = await db
    .update(nodes)
    .set({ completed })
    .where(inArray(nodes.id, ids))
    .returning();
  return data;
};

// Get all descendant node IDs for a given node
export const getAllDescendantIds = async (
  nodeId: string
): Promise<string[]> => {
  const result: string[] = [];
  let currentIds = [nodeId];

  while (currentIds.length > 0) {
    const children = await db
      .select()
      .from(nodes)
      .where(inArray(nodes.parentId, currentIds));

    const childIds = children.map((child) => child.id);
    result.push(...childIds);
    currentIds = childIds;
  }

  return result;
};
