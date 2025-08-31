"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Users, Database, Zap, Crown, CreditCard } from "lucide-react";
import HeaderComponent from "@/components/header";

type PlanType = "starter" | "pro";
type BillingCycle = "monthly" | "yearly";

export default function CustomerBillingClient() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>("starter"); // User's current plan
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("starter"); // Plan they want to change to
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    starter: {
      name: "Starter",
      icon: Users,
      monthly: 19,
      yearly: 190,
      popular: false, // Add this line
      features: [
        "Up to 5 team members",
        "10GB storage",
        "Basic analytics",
        "Email support",
        "5 projects",
        "Standard integrations",
      ],
      limits: {
        users: "5 users",
        storage: "10GB",
        projects: "5 projects",
        apiCalls: "1,000/month",
      },
    },
    pro: {
      name: "Pro",
      icon: Crown,
      monthly: 49,
      yearly: 490,
      popular: true,
      features: [
        "Up to 50 team members",
        "500GB storage",
        "Advanced analytics",
        "Priority support",
        "Unlimited projects",
        "All integrations",
        "Custom workflows",
        "API access",
      ],
      limits: {
        users: "50 users",
        storage: "500GB",
        projects: "Unlimited",
        apiCalls: "50,000/month",
      },
    },
  };

  const current = plans[currentPlan];
  const selected = plans[selectedPlan];
  const currentPrice =
    billingCycle === "monthly" ? current.monthly : current.yearly;
  const selectedPrice =
    billingCycle === "monthly" ? selected.monthly : selected.yearly;

  const isUpgrade = selectedPrice > currentPrice;
  const isDowngrade = selectedPrice < currentPrice;
  const canChangeplan = currentPlan !== selectedPlan;

  const handlePlanChange = async () => {
    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(() => {
      // Redirect to Stripe hosted checkout/billing portal
      const stripeUrl = `https://billing.stripe.com/p/session/test_YWNjdF8xTzVCQ0xLMkJuVmtaWGl0LF9QaXBBVGVzdGluZ1N0cmlwZQ`;
      window.location.href = stripeUrl;
    }, 1000);
  };

  const handleManagePayment = () => {
    // Redirect to Stripe customer portal
    const stripePortalUrl = `https://billing.stripe.com/p/login/test_00000000000000`;
    window.location.href = stripePortalUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderComponent
        title="Manage Your Subscription"
        description="Upgrade or downgrade your plan anytime"
      />
      <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
        {/* Current Plan */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <current.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Current Plan: {current.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    ${currentPrice}/
                    {billingCycle === "monthly" ? "month" : "year"} • Next
                    billing: Dec 15, 2024
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1"
              >
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{current.limits.users}</span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{current.limits.storage}</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{current.limits.projects}</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{current.limits.apiCalls}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method - Credit Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Your subscription will be charged to this payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Credit Card Visual */}
              <div className="w-full max-w-sm">
                <div className="relative h-56 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Card Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>

                  {/* Card Brand Logo // TODO: add card brand logo based on stripe subscription */}
                  {/* <div className="absolute top-6 right-6">
                    <div className="w-12 h-8 bg-white/90 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-800">
                        VISA
                      </span>
                    </div>
                  </div> */}

                  {/* Chip */}
                  {/* <div className="absolute top-16 left-6">
                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md shadow-sm">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-300/50 to-transparent rounded-md"></div>
                    </div>
                  </div> */}

                  {/* Contactless Symbol */}
                  <div className="absolute top-16 right-16">
                    <div className="w-6 h-6 border-2 border-white/40 rounded-full">
                      <div className="w-4 h-4 border-2 border-white/60 rounded-full m-0.5">
                        <div className="w-2 h-2 border border-white/80 rounded-full m-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="absolute top-32 left-6 right-6">
                    <div className="text-white font-mono md:text-xl tracking-widest">
                      •••• •••• •••• 4242
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pt-4">
                    <div className="mt-6">
                      <div className="text-white/70 text-xs uppercase tracking-wide mb-1">
                        Card Holder
                      </div>
                      <div className="text-white font-medium">John Doe</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs uppercase tracking-wide mb-1">
                        Expires
                      </div>
                      <div className="text-white font-medium font-mono">
                        12/28
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-8 left-6 w-2 h-2 bg-white/30 rounded-full"></div>
                  <div className="absolute top-12 left-8 w-1 h-1 bg-white/20 rounded-full"></div>
                  <div className="absolute bottom-16 right-8 w-3 h-3 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-20 right-12 w-1 h-1 bg-white/20 rounded-full"></div>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex-1 space-y-4">
                <div className="md:flex items-center justify-between hidden">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <p className="text-sm font-mono">•••• •••• •••• 4242</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Expires
                    </label>
                    <p className="text-lg font-mono">12/28</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <label className="text-sm font-medium text-gray-700">
                    Cardholder Name
                  </label>
                  <p className="text-lg">John Doe</p>
                </div>
                <div className="pt-4 w-full">
                  <Button
                    variant="outline"
                    onClick={handleManagePayment}
                    className="w-full lg:w-auto bg-transparent"
                  >
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Cycle Toggle */}
        {/* <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm">
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"
              }`}
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
              className={`text-sm font-medium ${
                billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div> */}

        {/* Plan Options */}
        {/* <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(plans).map(([key, plan]) => {
            const PlanIcon = plan.icon;
            const isCurrentPlan = currentPlan === key;
            const isSelected = selectedPlan === key;
            const planPrice =
              billingCycle === "monthly" ? plan.monthly : plan.yearly;

            return (
              <Card
                key={key}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : "hover:shadow-md"
                } ${plan.popular ? "border-blue-200" : ""}`}
                onClick={() => setSelectedPlan(key as PlanType)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center gap-2 mb-2">
                    {plan.popular && (
                      <Badge className="text-xs">Most Popular</Badge>
                    )}
                    {isCurrentPlan && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-800"
                      >
                        Current Plan
                      </Badge>
                    )}
                    {isSelected && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-800"
                      >
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-center mb-3">
                    <PlanIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      ${planPrice}
                      <span className="text-lg font-normal text-gray-600">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <p className="text-sm text-green-600">
                        Save ${plan.monthly * 12 - plan.yearly} per year
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-3">
                        Plan Limits
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{plan.limits.users}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{plan.limits.storage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {plan.limits.projects}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {plan.limits.apiCalls}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-3">
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {plan.features.slice(0, 4).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 4 && (
                          <li className="text-sm text-gray-500 ml-6">
                            +{plan.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div> */}

        {/* Action Buttons */}
        {canChangeplan && (
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md w-full">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {isUpgrade ? "Upgrade" : "Downgrade"} to {selected.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isUpgrade
                      ? `You'll be charged $${
                          selectedPrice - currentPrice
                        } more per ${
                          billingCycle === "monthly" ? "month" : "year"
                        }`
                      : `You'll save $${currentPrice - selectedPrice} per ${
                          billingCycle === "monthly" ? "month" : "year"
                        }`}
                  </p>
                </div>
                <Button
                  className="w-full h-12 text-lg"
                  onClick={handlePlanChange}
                  disabled={isProcessing}
                  variant={isUpgrade ? "default" : "secondary"}
                >
                  {isProcessing
                    ? "Redirecting..."
                    : isUpgrade
                      ? `Upgrade to ${selected.name}`
                      : `Downgrade to ${selected.name}`}
                </Button>
                <p className="text-xs text-gray-500">
                  You'll be redirected to Stripe's secure checkout
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>
            Changes to your subscription will be processed securely through
            Stripe.
          </p>
          <p>Need help? Contact support at support@example.com</p>
        </div>
      </div>
    </div>
  );
}
