import Stripe from "stripe";
import { prisma } from "./prisma";
import { Building2, Crown, Star, Users } from "lucide-react";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

export const createSubscription = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create subscription");
  }
};

export const plans = (isPropertyManagement: boolean) => {
  return isPropertyManagement
    ? [
        {
          id: "premium",
          name: "Premium",
          price: 2,
          originalPrice: 49,
          description: "Perfect for small properties",
          features: [
            "Up to 10 call boxes",
            "Basic access control",
            "Mobile app access",
            "Email support",
            "Basic analytics",
          ],
          icon: Building2,
          popular: false,
        },
        {
          id: "pro",
          name: "Pro",
          price: 3,
          originalPrice: 129,
          description: "Ideal for growing properties",
          features: [
            "Up to 50 call boxes",
            "Advanced access control",
            "Delivery management",
            "Priority support",
            "Advanced analytics",
            "Multi-building sync",
          ],
          icon: Crown,
          popular: true,
        },
        {
          id: "enterprise",
          name: "Enterprise",
          description: "For large property portfolios",
          features: [
            "Unlimited call boxes",
            "Custom integrations",
            "Dedicated support",
            "White-label options",
            "Advanced security features",
            "Custom analytics dashboard",
          ],
          icon: Star,
          popular: false,
        },
      ]
    : [
        {
          id: "pro",
          name: "Pro",
          price: 19,
          description: "Perfect for individual use",
          features: [
            "1 call box",
            "Mobile app access",
            "Smart notifications",
            "Remote access control",
            "Email support",
          ],
          icon: Users,
          popular: true,
        },
        {
          id: "premium",
          name: "Premium",
          price: 39,
          description: "For small businesses",
          features: [
            "Up to 3 call boxes",
            "Business features",
            "Priority support",
            "Advanced notifications",
            "Access logs",
            "Multiple users",
          ],
          icon: Building2,
          popular: false,
        },
        {
          id: "enterprise",
          name: "Enterprise",
          description: "For large property portfolios",
          features: [
            "Unlimited call boxes",
            "Custom integrations",
            "Dedicated support",
            "White-label options",
            "Advanced security features",
            "Custom analytics dashboard",
          ],
          icon: Star,
          popular: false,
        },
      ];
};

export const getSubscriptionStatus = async (userId: string) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: userId as string },
    });
    if (!subscription) {
      return false;
    }
    return subscription;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getSubscription = async (subscriptionId: string) => {
  try {
    // Retrieve the subscription with the default payment method expanded
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    });

    // Get the payment method details
    const paymentMethod =
      subscription.default_payment_method as Stripe.PaymentMethod;

    // Get the subscription item
    const subscriptionItem = subscription.items.data[0];

    // Extract card details including last 4 digits
    return {
      // sub card details
      last4: paymentMethod?.card?.last4,
      brand: paymentMethod?.card?.brand,
      exp_month: paymentMethod?.card?.exp_month,
      exp_year: paymentMethod?.card?.exp_year,

      // sub data
      rate: subscriptionItem?.plan?.amount
        ? subscriptionItem?.plan?.amount / 100
        : 0,
      interval: subscriptionItem?.price?.recurring?.interval, // month, year, week, day
      current_period_start: new Date(
        subscriptionItem?.current_period_start * 1000
      ), // The date the subscription will start
      current_period_end: new Date(subscriptionItem?.current_period_end * 1000), // This is your next billing date
      status: subscription.status, // active, past_due, canceled, unpaid, trialing, incomplete, incomplete_expired
      trial_end: new Date(
        subscription.trial_end ? subscription.trial_end * 1000 : 0
      ), // The date the trial will end
      cancel_at_period_end: subscription.cancel_at_period_end, // The date the subscription will be canceled this is a boolean
    };
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getSubscriptionWithPaymentMethod = async (
  subscriptionId: string
) => {
  try {
    // Retrieve the subscription with the default payment method expanded
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    });

    // Get the payment method details
    const paymentMethod =
      subscription.default_payment_method as Stripe.PaymentMethod;

    // Extract card details including last 4 digits
    return {
      last4: paymentMethod?.card?.last4,
      brand: paymentMethod?.card?.brand,
      exp_month: paymentMethod?.card?.exp_month,
      exp_year: paymentMethod?.card?.exp_year,
    };
  } catch (error) {
    console.error("Error retrieving subscription with payment method:", error);
    return false;
  }
};
