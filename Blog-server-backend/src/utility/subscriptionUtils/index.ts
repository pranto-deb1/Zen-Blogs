import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../lib/stripe";

export const handleSubscriptionChange = async (
  payload: Stripe.Subscription,
) => {
  const subscriptionId = payload.id;

  const isSubscriptionExists = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!isSubscriptionExists) {
    return console.log("Subscription data not found", 404);
  }

  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCLED
        : SubscriptionStatus.EXPIRED;

  // get time period and convert it into date
  const currentPeriodEndInMili = payload.items.data[0]?.current_period_end!;
  const currentPeriodEnd = new Date(currentPeriodEndInMili * 1000);

  // update subscription on prisma
  await prisma.subscription.update({
    where: {
      id: subscriptionId,
    },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};

export const handleSubscriptionComplete = async (
  session: Stripe.Checkout.Session,
) => {
  // get the stripe session from event

  // get user id, customer id, subscription id from session
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  // check if all data exists
  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    return console.log("Webhook failed", 400);
  }

  // retrive subscription data from stripe
  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  // get time period and convert it into date
  const currentPeriodStartInMili =
    stripeSubscription.items.data[0]?.current_period_start!;
  const currentPeriodEndInMili =
    stripeSubscription.items.data[0]?.current_period_end!;

  const currentPeriodStart = new Date(currentPeriodStartInMili * 1000);
  const currentPeriodEnd = new Date(currentPeriodEndInMili * 1000);

  // call prisma and store data in db
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      stripeSubscriptionId,
      userId,
      stripeCustomerId,
      currentPeriodStart,
      currentPeriodEnd,
    },
    update: {
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodStart,
      currentPeriodEnd,
    },
  });
};
