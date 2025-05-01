import { buildTree, HeadingNode } from "@/components/mind-map/utils";
import {
  transformChildrenStructure,
  transformInitialStructure,
} from "@/lib/utils";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateChildren } from "../prompts/generateChildren";
import { fetchInitialStructure } from "../prompts/generateInitialTopics";
import {
  getAllDescendantIds,
  insertNodes,
  queryNodeById,
  queryNodesForSubject,
  setNodesCompleted,
} from "../queries/nodes";
import { querySubjectFn } from "./subjects";

export const storeTreeFn = createServerFn({ method: "POST" })
  .validator((data: { subjectId: string; rootNode: HeadingNode }) => data)
  .handler(async ({ data: { subjectId, rootNode } }) => {
    const idMap = new Map<string, string>();
  });

export const getSubjectTreeFn = createServerFn({ method: "GET" })
  .validator((subjectId: unknown) =>
    z
      .object({
        subjectId: z.string(),
      })
      .parse(subjectId)
  )
  .handler(async ({ data: { subjectId } }) => {
    const data = await queryNodesForSubject(subjectId);
    // if (error) throw notFound();
    const tree = buildTree(data);
    return tree;
  });

export const getInitialTreeRootNodeFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        topic: z.string(),
        syllabus: z.string().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data: { topic, syllabus } }) => {
    const initialStructure = await fetchInitialStructure(topic, syllabus || "");
    console.log(initialStructure);
    const rootNode = transformInitialStructure(initialStructure);
    return rootNode;
  });

export const appendNodesFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        parentId: z.string(),
        children: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            children: z.array(z.any()).optional(), // TODO: fix this any
          })
        ),
        userId: z.string(), // for spending credits
      })
      .parse(data)
  )
  .handler(async ({ data: { parentId, children, userId } }) => {
    const parentNode = await queryNodeById(parentId);
    if (!parentNode) throw new Error("Parent node not found");

    const nodesToInsert = children.map((child, index) => ({
      subjectId: parentNode.subjectId,
      parentId,
      title: child.title,
      position: index,
    }));

    console.log("before inserting nodes");

    const insertedNodes = await insertNodes(nodesToInsert);
    if (!insertedNodes) throw new Error("Failed to insert nodes");

    console.log(
      `inserted nodes with ids ${children.map((n) => n.id).join(", ")} as ${insertedNodes.map((n) => n.id).join(", ")}`
    );

    // await spendUserCreditsFn({
    //   data: {
    //     userId,
    //     credits: 10,
    //     purpose: "generate-node-children",
    //   },
    // });

    return insertedNodes;
  });

export const generateNodeChildrenFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        title: z.string(),
        topic: z.string(),
        currentArticle: z.string(),
        syllabus: z.string().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data: { title, topic, currentArticle, syllabus } }) => {
    const children = await generateChildren(
      title,
      topic,
      currentArticle,
      syllabus
    );
    const childNodes = transformChildrenStructure(children);
    // TODO: add children to db
    return childNodes;
  });

export const setNodeCompletedFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        nodeId: z.string(),
        completed: z.boolean(),
      })
      .parse(data)
  )
  .handler(async ({ data: { nodeId, completed } }) => {
    // Get all descendant node IDs
    const descendantIds = await getAllDescendantIds(nodeId);
    const allIds = [nodeId, ...descendantIds];

    // Update all affected nodes in a single transaction
    console.log(
      `setting nodes ${allIds.join(", ")} to completed: ${completed}`
    );
    await setNodesCompleted(allIds, completed);
  });

export const setNodeAndParentsCompletedFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        nodeUpdates: z.array(
          z.object({
            nodeId: z.string(),
            completed: z.boolean(),
          })
        ),
      })
      .parse(data)
  )
  .handler(async ({ data: { nodeUpdates } }) => {
    // Group node IDs by completion status
    const completedIds = nodeUpdates
      .filter((update) => update.completed)
      .map((update) => update.nodeId);
    const uncompletedIds = nodeUpdates
      .filter((update) => !update.completed)
      .map((update) => update.nodeId);

    // Update nodes in parallel if needed
    const updatePromises = [];
    if (completedIds.length > 0) {
      updatePromises.push(setNodesCompleted(completedIds, true));
    }
    if (uncompletedIds.length > 0) {
      updatePromises.push(setNodesCompleted(uncompletedIds, false));
    }

    await Promise.all(updatePromises);
  });

export async function loadSubjectTreeFn(subjectId: string) {
  const subject = await querySubjectFn({ data: { id: subjectId } });
  const tree = await getSubjectTreeFn({
    data: { subjectId },
  });
  if (!tree) {
    // TODO: handle no tree found in db
    throw redirect({
      to: "/",
    });
  }
  return { subject, tree };
}
