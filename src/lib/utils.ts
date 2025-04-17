import { HeadingNode } from "@/components/mind-map/utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
import { ChildrenStructure } from "./server/prompts/generateChildren";
import { InitialStructure } from "./server/prompts/generateInitialTopics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a flat heading node structure into a nested heading node structure
 * @param input The input heading node with string array children
 * @returns A HeadingNode with nested HeadingNode children
 */
export function transformInitialStructure(
  input: InitialStructure
): HeadingNode {
  // const transformedChildren: HeadingNode[] = input.children.map(
  //   (childTitle, index) => ({
  //     id: nanoid(),
  //     title: childTitle,
  //     children: [],
  //   })
  // );

  return {
    id: "0",
    title: input.title,
    children: input.children,
  };
}

export function transformChildrenStructure(input: ChildrenStructure) {
  return input.children.map((child) => ({
    id: nanoid(),
    title: child.title,
    children: [],
  }));
}
