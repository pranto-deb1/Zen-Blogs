import Stripe from "stripe";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";
import {
  ActiveStatus,
  SubscriptionStatus,
} from "../../../generated/prisma/enums";
import {
  handleSubscriptionChange,
  handleSubscriptionComplete,
} from "../../utility/subscriptionUtils";

// create stripe checkout session
const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // find the user
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      include: { subscription: true },
    });

    let stripeCustomarId = user.subscription?.stripeCustomerId;

    if (!stripeCustomarId) {
      // create stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      stripeCustomarId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomarId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/home?success=false`,
      metadata: { userId: user.id },
    });

    return session.url;
  });

  return { paymemtUrl: transactionResult };
};

const handleWebhook = async (payload: Buffer, stgnature: string) => {
  // get the stripe webhook end point secret from .env
  const endpointSecret = config.stripe_webhook_secret;

  // create and stripe event from req.body || payload
  const event = stripe.webhooks.constructEvent(
    payload,
    stgnature,
    endpointSecret,
  );

  // create a switch for defferent event type
  switch (event.type) {
    case "checkout.session.completed":
      // Occurs when a Checkout Session has been successfully completed.

      await handleSubscriptionComplete(event.data.object);

      break;
    case "customer.subscription.updated":
      // Occurs whenever a subscription changes
      await handleSubscriptionChange(event.data.object);
      break;

    case "customer.subscription.deleted":
      // Occurs whenever a customer’s subscription ends.
      await handleSubscriptionChange(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    throw CreateErrorRes("Subscription does not exists", 404);
  }

  const isActive =
    subscription.status === "ACTIVE" &&
    subscription.currentPeriodEnd &&
    new Date(subscription.currentPeriodEnd) > new Date();


  return {
    status: subscription.status,
    isSubscribed: isActive,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
  };
};

export const SubscriptionService = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
};
