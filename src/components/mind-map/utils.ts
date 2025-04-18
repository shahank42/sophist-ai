import { Edge, MarkerType, Node } from "@xyflow/react";

// Deep clone utility to avoid direct state mutations
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const updateNodeChildren = (
  tree: HeadingNode,
  nodeId: string,
  newChildren: HeadingNode[]
): HeadingNode => {
  // If current node matches the target ID, update its children
  if (tree.id === nodeId) {
    return {
      ...tree,
      children: newChildren,
    };
  }

  // If no children or no match found in current node, return as is
  if (!tree.children) {
    return tree;
  }

  // Recursively search and update in children
  return {
    ...tree,
    children: tree.children.map((child) =>
      updateNodeChildren(child, nodeId, newChildren)
    ),
  };
};

// Usage with React state
export const updateTreeNodeChildren = (
  tree: HeadingNode,
  nodeId: string,
  newChildren: HeadingNode[]
): HeadingNode => {
  const treeCopy = deepClone(tree);
  return updateNodeChildren(treeCopy, nodeId, newChildren);
};

export interface HeadingNode {
  id: string;
  title: string;
  data: {
    completed: boolean;
  };
  children?: HeadingNode[];
}

interface Position {
  x: number;
  y: number;
}

const nodeWidth = 200;
const horizontalSpacing = 100;
const verticalSpacing = 150;

export function convertToReactFlowElements(
  data: HeadingNode,
  position: Position = { x: 0, y: 0 },
  depth: number = 0,
  expandedNodes: Set<string>,
  selectedNodeId?: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const hasChildren = data.children && data.children.length > 0;

  const node: Node = {
    id: data.id,
    data: {
      label: data.title,
      expandable: hasChildren,
      expanded: expandedNodes.has(data.id),
      selected: data.id === selectedNodeId,
      completed: data.data.completed,
    },
    position,
    type: "mindmapNode",
  };

  nodes.push(node);

  if (hasChildren && expandedNodes.has(data.id)) {
    const childrenCount = data.children ? data.children.length : 0;
    const totalChildHeight = (childrenCount - 1) * verticalSpacing;
    const startY = position.y - totalChildHeight / 2;

    data.children?.forEach((child, index) => {
      const childPosition = {
        x: position.x + nodeWidth + horizontalSpacing,
        y: startY + index * verticalSpacing,
      };

      const { nodes: childNodes, edges: childEdges } =
        convertToReactFlowElements(
          child,
          childPosition,
          depth + 1,
          expandedNodes,
          selectedNodeId
        );

      nodes.push(...childNodes);
      edges.push(...childEdges);

      edges.push({
        id: `${data.id}-${child.id}`,
        source: data.id,
        target: child.id,
        type: "bezier",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        // label: "default arrow",
      });
    });
  }

  return { nodes, edges };
}

interface DatabaseNode {
  id: string;
  title: string;
  parentId: string | null;
  completed: boolean;
  position: number;
}

export function buildTree(nodes: DatabaseNode[]): HeadingNode | null {
  if (nodes.length === 0) return null;

  // Create a map for quick lookup
  const nodeMap = new Map<string, HeadingNode>();

  // First pass: Create all nodes
  for (const node of nodes) {
    nodeMap.set(node.id, {
      id: node.id.toString(), // Convert to string for consistency
      title: node.title,
      data: {
        completed: node.completed,
      },
      children: [],
    });
  }

  // Second pass: Build the hierarchy
  let rootNode: HeadingNode | null = null;
  for (const node of nodes) {
    const currentNode = nodeMap.get(node.id)!;
    if (node.parentId === null) {
      rootNode = currentNode; // Found the root
    } else {
      const parentNode = nodeMap.get(node.parentId);
      if (parentNode) {
        parentNode.children!.push(currentNode);
      }
    }
  }

  return rootNode;
}

export const getNodeParentPath = (
  nodeId: string,
  getNode: (id: string) => Node | undefined,
  edges: Edge[]
): Node[] => {
  // Create a map of child -> parent relationships
  const parentMap = new Map<string, string>();
  edges.forEach((edge) => {
    parentMap.set(edge.target, edge.source);
  });

  const path: Node[] = [];
  const visited = new Set<string>();
  let currentNodeId = nodeId;

  while (currentNodeId && !visited.has(currentNodeId)) {
    const currentNode = getNode(currentNodeId);
    if (!currentNode) break;

    visited.add(currentNodeId);
    path.push(currentNode);

    // Get parent from our edge relationship map
    const parentId = parentMap.get(currentNodeId);
    if (!parentId) break;

    currentNodeId = parentId;
  }

  return path.reverse();
};

export const findPathToNode = (
  root: HeadingNode,
  targetId: string,
  path: string[] = []
): string[] | null => {
  if (root.id === targetId) return [...path, root.id];

  if (!root.children) return null;

  for (const child of root.children) {
    const childPath = findPathToNode(child, targetId, [...path, root.id]);
    if (childPath) return childPath;
  }

  return null;
};

export const getNodeLevel = (
  root: HeadingNode,
  targetId: string,
  level = 0
): number | null => {
  if (root.id === targetId) return level;
  if (!root.children) return null;

  for (const child of root.children) {
    const result = getNodeLevel(child, targetId, level + 1);
    if (result !== null) return result;
  }
  return null;
};

export const updateNodeAndChildrenCompletion = (
  tree: HeadingNode,
  nodeId: string,
  completed: boolean
): HeadingNode => {
  if (tree.id === nodeId) {
    // Update current node and all its children recursively
    return {
      ...tree,
      data: { completed },
      children: tree.children?.map((child) =>
        updateNodeAndChildrenCompletion(child, child.id, completed)
      ),
    };
  }

  // If no match in current node, recursively search children
  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map((child) =>
        updateNodeAndChildrenCompletion(child, nodeId, completed)
      ),
    };
  }

  return tree;
};

// New function to check if any node's children are incomplete
export const hasIncompleteChildren = (node: HeadingNode): boolean => {
  if (!node.children || node.children.length === 0) return false;
  return node.children.some(
    (child) => !child.data.completed || hasIncompleteChildren(child)
  );
};

// New function to check if all node's children are complete
export const hasAllChildrenComplete = (node: HeadingNode): boolean => {
  if (!node.children || node.children.length === 0) return true;
  return node.children.every(
    (child) => child.data.completed && hasAllChildrenComplete(child)
  );
};

// Modify updateParentNodesCompletion to use the new check
export const updateParentNodesCompletion = (
  tree: HeadingNode,
  nodeId: string,
  parentPath: string[]
): HeadingNode => {
  if (!parentPath.length) return tree;

  const updateNode = (node: HeadingNode): HeadingNode => {
    if (parentPath.includes(node.id)) {
      // If this node is in the parent path, check its children's completion status
      const allChildrenComplete = hasAllChildrenComplete(node);
      return {
        ...node,
        data: { completed: allChildrenComplete },
        children: node.children?.map(updateNode),
      };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(updateNode),
      };
    }

    return node;
  };

  return updateNode(tree);
};
