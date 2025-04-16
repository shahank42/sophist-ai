import { buildTree, HeadingNode } from "@/components/mind-map/utils";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  transformChildrenStructure,
  transformInitialStructure,
} from "@/lib/utils";
import {
  insertNodes,
  queryNodesForSubject,
  queryNodeById,
  getAllDescendantIds,
  setNodesCompleted,
} from "../queries/nodes";
import { fetchInitialStructure } from "../prompts/generateInitialTopics";
import { generateChildren } from "../prompts/generateChildren";

export const storeTreeFn = createServerFn({ method: "POST" })
  .validator((data: { subjectId: string; rootNode: HeadingNode }) => data)
  .handler(async ({ data: { subjectId, rootNode } }) => {
    const idMap = new Map<string, string>();

    // Process nodes level by level
    let currentLevel: Array<{
      node: HeadingNode;
      parentId: string | null;
      position: number;
    }> = [{ node: rootNode, parentId: null, position: 0 }];

    while (currentLevel.length > 0) {
      const nodesToInsert = currentLevel.map(
        ({ node, parentId, position }) => ({
          subjectId,
          parentId,
          title: node.title,
          position,
        })
      );

      // Insert current level
      const insertedNodes = await insertNodes(nodesToInsert);
      // if (error) throw error;
      if (!insertedNodes) throw new Error("Bulk insert failed");

      // Update ID map
      currentLevel.forEach(({ node }, index) => {
        idMap.set(node.id, insertedNodes[index].id);
      });

      // Prepare next level
      const nextLevel: Array<{
        node: HeadingNode;
        parentId: string | null;
        position: number;
      }> = [];

      currentLevel.forEach(({ node }) => {
        if (node.children) {
          node.children.forEach((child, index) => {
            nextLevel.push({
              node: child,
              parentId: idMap.get(node.id)!,
              position: index,
            });
          });
        }
      });

      currentLevel = nextLevel;
    }
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
      })
      .parse(data)
  )
  .handler(async ({ data: { parentId, children } }) => {
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
