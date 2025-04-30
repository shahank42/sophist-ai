import { useArticleContent } from "@/hooks/use-article-content";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  appendNodesFn,
  generateNodeChildrenFn,
  setNodeAndParentsCompletedFn,
} from "@/lib/server/rpc/nodes";
import { loadSubjectTreeQueryOptions } from "@/lib/server/rpc/subjects";
import { getUserCreditsQueryOptions } from "@/lib/server/rpc/users";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import {
  addEdge,
  Background,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MindmapNode from "./mind-map-node";
import {
  convertToReactFlowElements,
  findPathToNode,
  getNodeLevel,
  HeadingNode,
  updateNodeAndChildrenCompletion,
  updateParentNodesCompletion,
  updateTreeNodeChildren,
} from "./utils";

interface MindmapProps {
  data: HeadingNode;
  setData: React.Dispatch<React.SetStateAction<HeadingNode>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  centeringOffset?: { x: number; y: number };
}

const nodeTypes = { mindmapNode: MindmapNode };

const DEFAULT_OFFSET = { x: 200, y: 75 };

const Mindmap: React.FC<MindmapProps> = ({
  data,
  setData,
  selectedNode,
  setSelectedNode,
  centeringOffset = DEFAULT_OFFSET,
}) => {
  // const {
  //   subject: { name: topic, rawSyllabus: syllabus },
  // } = getRouteApi("/study/$subjectId").useLoaderData();

  const rootContext = getRouteApi("__root__").useRouteContext();
  const user = rootContext.user!; // TODO: ts

  const { subjectId } = getRouteApi("/study/$subjectId").useParams();
  const { data: subjectTree } = useSuspenseQuery(
    loadSubjectTreeQueryOptions(subjectId)
  );

  const {
    subject: { name: topic, rawSyllabus: syllabus },
  } = subjectTree;

  console.log(subjectTree);

  const { data: userCredits } = useQuery(getUserCreditsQueryOptions(user!.id));

  const { data: currentArticle } = useArticleContent(selectedNode);

  const [expandedByLevel, setExpandedByLevel] = useState(
    () => new Map([[0, data.id]])
  );

  const expandedNodes = useMemo(
    () => new Set(expandedByLevel.values()),
    [expandedByLevel]
  );
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () =>
      convertToReactFlowElements(
        data,
        { x: 0, y: 0 },
        0,
        expandedNodes,
        selectedNode?.id
      ),
    [data, expandedNodes, selectedNode]
  );

  const isMobile = useIsMobile();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setCenter, getNode } = useReactFlow();

  const centerAndSelectNode = useCallback(
    (nodeId: string, offset = -200) => {
      const node = getNode(nodeId);
      if (node) {
        setCenter(
          node.position.x + centeringOffset.x + offset,
          node.position.y + centeringOffset.y,
          { duration: 800, zoom: 0.9 }
        );
        setSelectedNode(node);
      }
    },
    [getNode, setCenter, centeringOffset, setSelectedNode]
  );

  const expandPathToNode = useCallback(
    (targetId: string) => {
      const path = findPathToNode(data, targetId);
      if (!path) return;

      setExpandedByLevel((prev) => {
        const next = new Map(prev);
        path.slice(0, -1).forEach((nodeId, index) => {
          next.set(index, nodeId);
        });
        return next;
      });
    },
    [data]
  );

  const handleNodeSelection = useCallback(
    (nodeId: string) => {
      const node = getNode(nodeId);
      if (node) {
        setSelectedNode(node);
        const updatedNodes = nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            selected: n.id === nodeId,
          },
        }));
        setNodes(updatedNodes);
      }
    },
    [getNode, setSelectedNode, nodes, setNodes]
  );

  const handleNodeCompletion = useCallback(
    async (nodeId: string, completed: boolean) => {
      const findNodeById = (
        tree: HeadingNode,
        nodeId: string
      ): HeadingNode | null => {
        if (tree.id === nodeId) return tree;
        if (!tree.children) return null;
        for (const child of tree.children) {
          const found = findNodeById(child, nodeId);
          if (found) return found;
        }
        return null;
      };

      setData((prevData) => {
        if (!prevData) return prevData;

        const path = findPathToNode(prevData, nodeId)?.slice(0, -1) || [];

        const updatedData = updateNodeAndChildrenCompletion(
          prevData,
          nodeId,
          completed
        );

        const finalData = updateParentNodesCompletion(
          updatedData,
          nodeId,
          path
        );

        interface NodeUpdate {
          nodeId: string;
          completed: boolean;
        }
        const nodeUpdates: NodeUpdate[] = [];

        const collectChildUpdates = (node: HeadingNode) => {
          nodeUpdates.push({ nodeId: node.id, completed: node.data.completed });
          node.children?.forEach(collectChildUpdates);
        };

        const findAndCollectUpdates = (node: HeadingNode) => {
          if (node.id === nodeId) {
            collectChildUpdates(node);
            return true;
          }
          return node.children?.some(findAndCollectUpdates) || false;
        };
        findAndCollectUpdates(finalData);

        path.forEach((parentId) => {
          const parentNode = findNodeById(finalData, parentId);
          if (parentNode) {
            nodeUpdates.push({
              nodeId: parentId,
              completed: parentNode.data.completed,
            });
          }
        });

        setNodeAndParentsCompletedFn({ data: { nodeUpdates } });

        return finalData;
      });
    },
    [setData]
  );

  const [generatingNodes, setGeneratingNodes] = useState<{
    [key: string]: boolean;
  }>({});

  const handlers = useMemo(
    () => ({
      nodeselect: (e: CustomEvent) => {
        const node = getNode(e.detail.id);
        if (!node) return;

        handleNodeSelection(e.detail.id);
        centerAndSelectNode(e.detail.id, isMobile ? -100 : -200);
        if (isMobile) {
          console.log("open sheet");
        }
      },
      nodeexpandtoggle: (e: CustomEvent) => {
        const { id: nodeId } = e.detail;
        const level = getNodeLevel(data, nodeId);
        if (level === null) return;

        setExpandedByLevel((prev) => {
          const next = new Map(prev);
          if (prev.get(level) === nodeId) {
            for (const [mapLevel] of prev) {
              if (mapLevel >= level) next.delete(mapLevel);
            }
          } else {
            next.set(level, nodeId);
            for (const [mapLevel] of prev) {
              if (mapLevel > level) next.delete(mapLevel);
            }
          }
          return next;
        });
        centerAndSelectNode(nodeId, isMobile ? 150 : 0);
      },
      nodegeneratechildren: async (e: CustomEvent) => {
        const nodeId = e.detail.id;
        const node = getNode(nodeId);
        if (!node || generatingNodes[nodeId]) return;

        // if (userCredits && userCredits.credits < 10) {
        //   toast.info("You don't have enough credits to generate children!");
        //   return;
        // }

        try {
          setGeneratingNodes((prev) => ({ ...prev, [nodeId]: true }));

          const childNodes = await generateNodeChildrenFn({
            data: {
              title: node.data.label as string,
              topic,
              currentArticle,
              syllabus,
            },
          });

          const insertedNodes = await appendNodesFn({
            data: { parentId: nodeId, children: childNodes, userId: user.id },
          });

          const transformedNodes = insertedNodes.map((node) => ({
            ...node,
            data: { completed: node.completed },
          }));

          setData(
            (prev) =>
              prev && updateTreeNodeChildren(prev, nodeId, transformedNodes)
          );
        } finally {
          setGeneratingNodes((prev) => ({ ...prev, [nodeId]: false }));
        }
      },
      treenodeselect: (e: CustomEvent) => {
        expandPathToNode(e.detail.id);
        setTimeout(() => centerAndSelectNode(e.detail.id), 100);
      },
      nodecompletion: (e: CustomEvent) => {
        const { id, completed } = e.detail;
        handleNodeCompletion(id, completed);
      },
    }),
    [
      getNode,
      handleNodeSelection,
      centerAndSelectNode,
      isMobile,
      data,
      topic,
      currentArticle,
      syllabus,
      setData,
      expandPathToNode,
      handleNodeCompletion,
      generatingNodes,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();
    Object.entries(handlers).forEach(([event, handler]) => {
      document.addEventListener(event, handler as EventListener, {
        signal: controller.signal,
      });
    });
    return () => controller.abort();
  }, [handlers]);

  useEffect(() => {
    setSelectedNode((prev) => (prev ? prev : nodes[0]));
  }, [setSelectedNode, nodes]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = convertToReactFlowElements(
      data,
      { x: 0, y: 0 },
      0,
      expandedNodes,
      selectedNode?.id
    );
    setNodes(
      newNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isGenerating: generatingNodes[node.id] || false,
        },
      }))
    );
    setEdges(newEdges);
  }, [expandedNodes, data, setNodes, setEdges, selectedNode, generatingNodes]);

  return (
    <div className="h-[calc(100dvh-48px-24px)] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

const MindmapWithProvider: React.FC<MindmapProps> = (props) => (
  <ReactFlowProvider>
    <Mindmap {...props} />
  </ReactFlowProvider>
);

export default MindmapWithProvider;
