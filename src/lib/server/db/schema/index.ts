import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
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

export const paymentTypeEnum = pgEnum("payment_type", [
  "one_time",
  "subscription",
]);

export const payments = pgTable(
  "payments",
  {
    id: text("id")
      .$defaultFn(() => generateRandomString(10))
      .primaryKey(),
    // userId: text("user_id")
    //   .notNull()
    //   .references(() => user.id, { onDelete: "cascade" }),
    customerId: text("customer_id").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    status: text("status").notNull(), // succeeded, failed, pending
    paymentId: text("payment_id").notNull(),
    paymentType: paymentTypeEnum("payment_type").notNull().default("one_time"),
    paymentLink: text("payment_link"),
    paymentMethod: text("payment_method"), // debit, credit, upi_collect
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      paymentIdIndex: index("payments_payment_id_idx").on(table.paymentId),
      customerIdIndex: index("payments_customer_id_idx").on(table.customerId),
    };
  }
);

export const creditBundles = pgTable("credit_bundles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
  price: integer("price").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  buttonText: text("button_text").notNull().default("Buy Now"),
  features: text("features").array().notNull(),
});

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "purchase",
  "spend",
]);

export const creditTransactions = pgTable("credit_transactions", {
  id: text("id")
    .$defaultFn(() => generateRandomString(10))
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // bundleId: text("bundle_id")
  //   .notNull()
  //   .references(() => creditBundles.id),
  transactionType: creditTransactionTypeEnum("transaction_type").notNull(),
  amount: integer("amount").notNull(),
  relatedId: text("related_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const planTypeEnum = pgEnum("plan_type", [
  "single.weekly",
  "single.monthly",
]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id")
      .$defaultFn(() => generateRandomString(10))
      .primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    plan: planTypeEnum("plan"),
    status: text("status").notNull(),

    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
    }).notNull(),

    // trialStart: timestamp("trial_start", { withTimezone: true }),
    // trialEnd: timestamp("trial_end", { withTimezone: true }),

    // cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    // canceledAt: timestamp("canceled_at", { withTimezone: true }),
    // endedAt: timestamp("ended_at", { withTimezone: true }),

    // gatewaySubscriptionId: text("gateway_subscription_id"),

    // metadata: jsonb("metadata")
    //   .notNull()
    //   .default(sql`{}`),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
  // (table) => ({
  //   // GIST index on the period range for fast range queries
  //   periodGistIndex: index("subscriptions_period_gist_idx")
  //     .using("gist", )
  //     .on(sql`tsrange(${table.currentPeriodStart}, ${table.currentPeriodEnd})`),
  // })
);

export * from "./auth-schema";
