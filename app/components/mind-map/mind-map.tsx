import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  HeadingNode,
  convertToReactFlowElements,
  getNodeParentPath,
  findPathToNode,
  getNodeLevel,
} from "./utils";
import MindmapNode from "./mind-map-node";
import { updateTreeNodeChildren } from "./utils";
import { appendNodesFn, generateNodeChildrenFn } from "@/lib/server/rpc/nodes";
import { useArticleContent } from "@/hooks/use-article-content";
import { getRouteApi } from "@tanstack/react-router";
import { set } from "zod";

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
  // } = getRouteApi("/(app)/app/$subjectId").useRouteContext();
  const {
    subject: { name: topic, rawSyllabus: syllabus },
  } = getRouteApi("/(app)/app/$subjectId").useLoaderData();

  const { data: currentArticle } = useArticleContent(selectedNode);

  const [expandedByLevel, setExpandedByLevel] = useState(
    new Map([[0, data.id]])
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
    [getNode, setCenter, centeringOffset]
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

  useEffect(() => {
    setSelectedNode(nodes[0]);
  }, []);

  useEffect(() => {
    const handlers = {
      nodeselect: (e: CustomEvent) => {
        const node = getNode(e.detail.id);
        if (!node) return;

        centerAndSelectNode(e.detail.id);
        // setCurrentArticle("");
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
        centerAndSelectNode(nodeId, 0);
      },
      nodegeneratechildren: async (e: CustomEvent) => {
        const node = getNode(e.detail.id);
        if (!node) return;

        const childNodes = await generateNodeChildrenFn({
          data: {
            title: node.data.label as string,
            topic,
            currentArticle,
            syllabus,
          },
        });
        const insertedNodes = await appendNodesFn({
          data: { parentId: e.detail.id, children: childNodes },
        });
        setData(
          (prev) =>
            prev && updateTreeNodeChildren(prev, e.detail.id, insertedNodes)
        );
      },
      treenodeselect: (e: CustomEvent) => {
        expandPathToNode(e.detail.id);
        setTimeout(() => centerAndSelectNode(e.detail.id), 100);
      },
    };

    const controller = new AbortController();
    Object.entries(handlers).forEach(([event, handler]) => {
      document.addEventListener(event, handler as EventListener, {
        signal: controller.signal,
      });
    });
    return () => controller.abort();
  }, [
    data,
    getNode,
    centerAndSelectNode,
    topic,
    syllabus,
    currentArticle,
    edges,
    expandPathToNode,
  ]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = convertToReactFlowElements(
      data,
      { x: 0, y: 0 },
      0,
      expandedNodes,
      selectedNode?.id
    );
    setNodes(newNodes);
    setEdges(newEdges);
  }, [expandedNodes, data, setNodes, setEdges, selectedNode]);

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
