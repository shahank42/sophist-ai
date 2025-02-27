import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscriptions } from "../db/schema";

// Subscription status enum
export enum SubscriptionStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
  HALTED = "HALTED",
}

/**
 * Creates a new subscription or updates an existing one with INACTIVE status using upsert
 * @param userId - ID of the user
 * @param razorpaySubscriptionId - Razorpay subscription ID
 * @param razorpayPaymentId - Razorpay payment ID (null until payment is complete)
 * @param razorpaySignature - Razorpay signature (null until payment is complete)
 * @param amount - Subscription amount
 */
export const createOrUpdateInactiveSubscription = async (
  userId: string,
  razorpaySubscriptionId: string,
  razorpayPaymentId: string | null,
  razorpaySignature: string | null,
  amount: number,
  currentPeriodStart?: Date,
  currentPeriodEnd?: Date
) => {
  const now = new Date();

  // Prepare the values object with conditional properties for optional fields
  const values = {
    userId,
    razorpaySubscriptionId,
    status: SubscriptionStatus.INACTIVE,
    amount: amount.toString(),
    currentPeriodStart: currentPeriodStart || now,
    currentPeriodEnd: currentPeriodEnd || now,
    createdAt: now,
    updatedAt: now,
    // Only include payment ID and signature if they're provided
    ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
    ...(razorpaySignature ? { razorpaySignature } : {}),
  };

  // Use upsert operation
  const data = await db
    .insert(subscriptions)
    .values(values)
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: {
        userId,
        status: SubscriptionStatus.INACTIVE,
        razorpaySubscriptionId,
        amount: amount.toString(),
        currentPeriodStart: currentPeriodStart || now,
        currentPeriodEnd: currentPeriodEnd || now,
        updatedAt: now,
        // Only update payment ID and signature if they're provided
        ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
        ...(razorpaySignature ? { razorpaySignature } : {}),
      },
    })
    .returning();

  return data.length === 0 ? undefined : data[0];
};

/**
 * Updates a subscription status to ACTIVE
 * @param subscriptionId - ID of the subscription to activate
 * @param razorpayPaymentId - Razorpay payment ID
 * @param razorpaySignature - Razorpay signature
 */
export const activateSubscription = async (
  subscriptionId: string,
  razorpayPaymentId?: string,
  razorpaySignature?: string
) => {
  const now = new Date();

  const data = await db
    .update(subscriptions)
    .set({
      status: SubscriptionStatus.ACTIVE,
      lastPaymentDate: now,
      updatedAt: now,
      ...(razorpayPaymentId && { razorpayPaymentId }),
      ...(razorpaySignature && { razorpaySignature }),
    })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  return data.length === 0 ? undefined : data[0];
};

/**
 * Get subscription by ID
 * @param id - Subscription ID
 */
export const getSubscriptionById = async (id: string) => {
  const data = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, id));

  return data.length === 0 ? undefined : data[0];
};

/**
 * Get subscription by Razorpay subscription ID
 * @param razorpaySubscriptionId - Razorpay subscription ID
 */
export const getSubscriptionByRazorpayId = async (
  razorpaySubscriptionId: string
) => {
  const data = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubscriptionId));

  return data.length === 0 ? undefined : data[0];
};

/**
 * Get all subscriptions for a user
 * @param userId - User ID
 */
export const getUserSubscriptions = async (userId: string) => {
  const data = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(subscriptions.createdAt);

  return data;
};

/**
 * Cancel subscription
 * @param subscriptionId - Subscription ID
 */
export const cancelSubscription = async (subscriptionId: string) => {
  const now = new Date();

  const data = await db
    .update(subscriptions)
    .set({
      status: SubscriptionStatus.CANCELED,
      updatedAt: now,
    })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  return data.length === 0 ? undefined : data[0];
};

/**
 * Cancel subscription by Razorpay subscription ID
 * @param razorpaySubscriptionId - Razorpay subscription ID
 */
export const cancelSubscriptionByRazorpayId = async (
  razorpaySubscriptionId: string
) => {
  const data = await db
    .delete(subscriptions)
    .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubscriptionId))
    .returning();

  return data.length === 0 ? undefined : data[0];
};

/**
 * Mark subscription as PENDING
 * @param subscriptionId - Subscription ID
 */
export const markSubscriptionAsPending = async (subscriptionId: string) => {
  const now = new Date();

  const data = await db
    .update(subscriptions)
    .set({
      status: SubscriptionStatus.PENDING,
      updatedAt: now,
    })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  return data.length === 0 ? undefined : data[0];
};

/**
 * Halt subscription
 * @param subscriptionId - Subscription ID
 */
export const haltSubscription = async (subscriptionId: string) => {
  const now = new Date();

  const data = await db
    .update(subscriptions)
    .set({
      status: SubscriptionStatus.HALTED,
      updatedAt: now,
    })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  return data.length === 0 ? undefined : data[0];
};
