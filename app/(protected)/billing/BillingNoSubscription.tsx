"use client";

import React, { useState } from "react";
import { Check, Star, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import HeaderComponent from "@/components/header";
import { User } from "@prisma/client";

interface BillingNoSubscriptionProps {
  user: User;
}

const BillingNoSubscription: React.FC<BillingNoSubscriptionProps> = ({
  user,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again later.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again later.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 2.99,
      yearlyPrice: 19.99,
      features: [
        "Up to 50 reminders (perfect for memory rookies)",
        "Email notifications (digital nudges to your inbox)",
        "Basic recurring reminders (because some things need repeating)",
        "Mobile app access (pocket-sized memory dojo)",
      ],
      popular: false,
      monthlyPriceId: process.env
        .NEXT_PUBLIC_MONTHLY_STRIPE_STARTER_PRICE_ID as string,
      yearlyPriceId: process.env
        .NEXT_PUBLIC_YEARLY_STRIPE_STARTER_PRICE_ID as string,
    },
    {
      name: "Pro",
      monthlyPrice: 9.99,
      yearlyPrice: 79.99,
      features: [
        "Unlimited reminders (memory black belt status)",
        "SMS & email notifications (double-tap reminder strikes)",
        "Advanced recurring patterns (master-level scheduling kung fu)",
        "Team collaboration (assemble your memory warriors)",
        "Priority support (VIP treatment from the Notifoo ninjas)",
      ],
      popular: true,
      monthlyPriceId: process.env
        .NEXT_PUBLIC_MONTHLY_STRIPE_PRO_PRICE_ID as string,
      yearlyPriceId: process.env
        .NEXT_PUBLIC_YEARLY_STRIPE_PRO_PRICE_ID as string,
    },
    {
      name: "Premium Pro",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        "Unlimited everything (notification grandmaster level)",
        "Custom notification channels (build your own reminder dojo)",
        "Advanced analytics & reporting (track your memory victories)",
        "API access & integrations (connect all your digital weapons)",
        "24/7 dedicated support (personal memory sensei on speed dial)",
      ],
      popular: false,
      monthlyPriceId: process.env
        .NEXT_PUBLIC_MONTHLY_STRIPE_PREMIUM_PRO_PRICE_ID as string,
      yearlyPriceId: process.env
        .NEXT_PUBLIC_YEARLY_STRIPE_PREMIUM_PRO_PRICE_ID as string,
    },
  ];

  const getPrice = (plan: (typeof plans)[0]) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getPriceId = (plan: (typeof plans)[0]) => {
    return billingCycle === "monthly"
      ? plan.monthlyPriceId
      : plan.yearlyPriceId;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderComponent
        title="Choose Your Plan"
        description="Start your journey with the perfect plan for your needs"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* No Subscription Alert */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You don't have an active subscription yet. Choose a plan below to
            get started with all our features.
          </AlertDescription>
        </Alert>

        {/* Billing Toggle */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Select the perfect plan for your team's needs. Upgrade or downgrade
            at any time.
          </p>

          <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
            <span
              className={`text-sm font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <Switch
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) =>
                setBillingCycle(checked ? "yearly" : "monthly")
              }
            />
            <span
              className={`text-sm font-medium ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}
            >
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Save up to 33%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-2 border-blue-500 shadow-2xl scale-105 bg-white"
                  : "border border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className={`text-center pb-8 pt-8 `}>
                <CardTitle
                  className={`text-2xl font-bold mb-2 ${
                    plan.popular ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span
                    className={`text-5xl font-bold ${
                      plan.popular ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    ${getPrice(plan)}
                  </span>
                  <span className="text-gray-500 text-lg">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <Badge
                    variant="outline"
                    className="text-green-700 border-green-300"
                  >
                    Save {getSavings(plan)}%
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="px-6 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check
                        className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "text-blue-500" : "text-green-500"
                        }`}
                      />
                      <span className="text-gray-700 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(getPriceId(plan))}
                  disabled={loading === getPriceId(plan)}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading === getPriceId(plan) ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Subscribe to {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include 24/7 support and a 30-day money-back guarantee
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-green-500" />
              No setup fees
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-green-500" />
              Cancel anytime
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-green-500" />
              Secure payments
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-green-500" />
              Instant activation
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I change my plan later?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes will be prorated and take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What payment methods do you accept?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards (Visa, MasterCard, American
                  Express) and debit cards. All payments are processed securely
                  through Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Is there a free trial?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee on all plans. If you're
                  not satisfied, contact us within 30 days for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingNoSubscription;
