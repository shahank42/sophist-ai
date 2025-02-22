import {
  AnyPgColumn,
  foreignKey,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  boolean, // add this import
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export const subjects = pgTable(
  "subjects",
  {
    id: text("id")
      .$defaultFn(() => generateRandomString(10))
      .primaryKey(),
    name: text("name").notNull(),
    rawSyllabus: text("raw_syllabus"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      createdByIndex: index("subjects_created_by_idx").on(table.createdBy),
    };
  }
);

export const nodes = pgTable(
  "nodes",
  {
    id: text("id")
      .$defaultFn(() => generateRandomString(10))
      .primaryKey(),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    parentId: text("parent_id").references((): AnyPgColumn => nodes.id),
    title: text("title").notNull(),
    position: integer("position").default(0).notNull(),
    completed: boolean("completed").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      subjectIdIndex: index("nodes_subject_id_idx").on(table.subjectId),
    };
  }
);

export const articles = pgTable(
  "articles",
  {
    id: text("id")
      .$defaultFn(() => generateRandomString(10))
      .primaryKey(),
    nodeId: text("node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    llmModel: text("llm_model"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      nodeIdIndex: index("articles_node_id_idx").on(table.nodeId),
    };
  }
);

export * from "./auth-schema";
