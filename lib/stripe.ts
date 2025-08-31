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

export const updateSubscriptionCount = async (
  userId: string,
  count: number
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.subscriptionId) {
      throw new Error("User has no active subscription");
    }

    // First, get the current subscription to access its items
    const currentSubscription = await stripe.subscriptions.retrieve(
      user.subscriptionId
    );

    if (!currentSubscription.items.data.length) {
      throw new Error("Subscription has no items");
    }

    // Update the quantity of the first subscription item
    // (assuming single item subscription - modify if you have multiple items)
    const subscriptionItemId = currentSubscription.items.data[0].id;

    const updatedSubscription = await stripe.subscriptions.update(
      user.subscriptionId,
      {
        items: [
          {
            id: subscriptionItemId,
            quantity: count,
          },
        ],
        metadata: {
          count, // Keep metadata for reference
        },
      }
    );

    return updatedSubscription;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update subscription count");
  }
};

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
