"use client";

import HeaderComponent from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRightIcon,
  CreditCard,
  CreditCardIcon,
  Crown,
  Users,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type PlanType = "starter" | "pro";
type BillingCycle = "monthly" | "yearly";

// create color system for the subscription status
const subscriptionStatusColor = {
  active: "bg-green-500",
  trialing: "bg-blue-500",
  past_due: "bg-yellow-500",
  canceled: "bg-red-500",
  incomplete: "bg-gray-500",
};
const subscriptionStatusText = {
  active: "Active",
  trialing: "Trialing",
  past_due: "Past Due",
  canceled: "Canceled",
  incomplete: "Incomplete",
};

interface ISubscriptionData {
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  rate: number;
  interval: string;
  current_period_start: Date;
  current_period_end: Date;
  status: string;
  trial_end: Date;
  cancel_at_period_end: boolean;
}

export default function CustomerBillingClient({
  user,
  subscriptionData,
}: {
  user: User;
  subscriptionData: ISubscriptionData;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>(
    (user?.subscriptionPlan as PlanType) ?? "starter"
  ); // User's current plan
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(
    (user?.subscriptionPlan as PlanType) ?? "starter"
  ); // Plan they want to change to
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    starter: {
      name: "Starter",
      icon: CreditCardIcon,
      monthly: 2.99,
      yearly: 19.99,
      popular: false, // Add this line
      features: [
        "Up to 5 team members",
        "10GB storage",
        "Basic analytics",
        "Email support",
        "5 reminders",
        "Standard integrations",
      ],
      limits: {
        users: "5 users",
        storage: "10GB",
        reminders: "5 reminders",
        apiCalls: "1,000/month",
      },
    },
    pro: {
      name: "Pro",
      icon: Crown,
      monthly: 9.99,
      yearly: 99.99,
      popular: true,
      features: [
        "Up to 50 team members",
        "500GB storage",
        "Advanced analytics",
        "Priority support",
        "Unlimited reminders",
        "All integrations",
        "Custom workflows",
        "API access",
      ],
      limits: {
        users: "50 users",
        storage: "500GB",
        reminders: "Unlimited",
        apiCalls: "50,000/month",
      },
    },
    premium: {
      name: "Premium Pro",
      icon: Crown,
      monthly: 19.99,
      yearly: 199.99,
      popular: true,
      features: [
        "Up to 100 team members",
        "500GB storage",
        "Advanced analytics",
        "Priority support",
        "Unlimited reminders",
        "All integrations",
        "Custom workflows",
        "API access",
      ],
      limits: {
        users: "50 users",
        storage: "500GB",
        reminders: "Unlimited",
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

  const handleManagePayment = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/stripe/manage", {
        method: "POST",
      });

      if (!res.ok) {
        setError("Failed to manage payment");
        toast.error("Failed to manage payment");
        return;
      }

      toast.success("Redirecting to Stripe's secure checkout");
      const data = await res.json();
      window.location.href = data.url;

      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Failed to manage payment");
      toast.error("Failed to manage payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex justify-between items-center pr-4 h-28 w-full bg-white sticky top-0 z-50">
        <HeaderComponent
          title="Billing"
          description="Manage your subscription and billing information"
        />
      </div>
      <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
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
                    <div className="text-white font-mono text-sm md:text-xl tracking-widest">
                      •••• •••• •••• {subscriptionData.last4}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pt-4">
                    <div className="mt-6">
                      <div className="text-white/70 text-xs uppercase tracking-wide mb-1">
                        Card Holder
                      </div>
                      <div className="text-white text-xs md:text-sm font-medium">
                        {user.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs uppercase tracking-wide mb-1">
                        Expires
                      </div>
                      <div className="text-white text-xs md:text-sm font-medium font-mono">
                        {subscriptionData.exp_month}/
                        {subscriptionData.exp_year.toString().slice(-2)}
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
                <div className="space-y-6">
                  {/* Subscription Details Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Crown className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            Subscription Details
                          </h3>
                          <p className="text-sm text-gray-600">
                            {subscriptionData.status !== "trialing" && (
                              <>
                                Starter -{" "}
                                {formatCurrency(subscriptionData.rate, "USD")}/
                                {subscriptionData.interval === "month"
                                  ? "Monthly"
                                  : "Yearly"}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`
                          px-3 py-1 text-xs font-medium rounded-full
                          ${
                            subscriptionData.status === "active"
                              ? "bg-green-100 text-green-800"
                              : subscriptionData.status === "trialing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        `}
                      >
                        {subscriptionData.status === "trialing"
                          ? "Free Trial"
                          : subscriptionData.status}
                      </Badge>
                    </div>

                    {/* Next Billing */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600">
                          {subscriptionData.status === "trialing"
                            ? "Trial Ends"
                            : "Next Billing"}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {subscriptionData.status === "trialing"
                          ? moment(subscriptionData.trial_end).format(
                              "MMM DD, YYYY"
                            )
                          : moment(subscriptionData.current_period_end).format(
                              "MMM DD, YYYY"
                            )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {subscriptionData.status === "trialing"
                          ? `${moment(subscriptionData.trial_end).diff(moment(), "days")} days left`
                          : ``}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 w-full">
              <Button
                onClick={handleManagePayment}
                className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-800 "
              >
                Manage Subscription
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {canChangeplan && (
          <div className="flex justify-center">
            <div className="bg-white md:p-6 rounded-lg shadow-sm border max-w-md w-full">
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
                  onClick={handleManagePayment}
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
          <p>All payments are processed securely through Stripe.</p>
          <p className="text-xs text-gray-500">
            We do not store your credit card information in any way.
          </p>
          <p className="text-xs text-gray-500">
            Need help? Contact support at{" "}
            <Link href="/contact" className="text-blue-500">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
