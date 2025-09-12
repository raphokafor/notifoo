"use client";

import HeaderComponent from "@/components/header";
import { PricingSection } from "@/components/landing/Pricing";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@prisma/client";
import { AlertCircle, Check } from "lucide-react";
import React from "react";

interface BillingNoSubscriptionProps {
  user: User;
}

const BillingNoSubscription: React.FC<BillingNoSubscriptionProps> = ({
  user,
}) => {
  // const plans = [
  //   {
  //     name: "Starter",
  //     monthlyPrice: 2.99,
  //     yearlyPrice: 19.99,
  //     features: [
  //       "Up to 50 reminders (perfect for memory rookies)",
  //       "Email notifications (digital nudges to your inbox)",
  //       "Basic recurring reminders (because some things need repeating)",
  //       "Mobile app access (pocket-sized memory dojo)",
  //     ],
  //     popular: false,
  //     monthlyPriceId: process.env
  //       .NEXT_PUBLIC_MONTHLY_STRIPE_STARTER_PRICE_ID as string,
  //     yearlyPriceId: process.env
  //       .NEXT_PUBLIC_YEARLY_STRIPE_STARTER_PRICE_ID as string,
  //   },
  //   {
  //     name: "Pro",
  //     monthlyPrice: 9.99,
  //     yearlyPrice: 79.99,
  //     features: [
  //       "Unlimited reminders (memory black belt status)",
  //       "SMS & email notifications (double-tap reminder strikes)",
  //       "Advanced recurring patterns (master-level scheduling kung fu)",
  //       "Team collaboration (assemble your memory warriors)",
  //       "Priority support (VIP treatment from the Notifoo ninjas)",
  //     ],
  //     popular: true,
  //     monthlyPriceId: process.env
  //       .NEXT_PUBLIC_MONTHLY_STRIPE_PRO_PRICE_ID as string,
  //     yearlyPriceId: process.env
  //       .NEXT_PUBLIC_YEARLY_STRIPE_PRO_PRICE_ID as string,
  //   },
  //   {
  //     name: "Premium Pro",
  //     monthlyPrice: 19.99,
  //     yearlyPrice: 199.99,
  //     features: [
  //       "Unlimited everything (notification grandmaster level)",
  //       "Custom notification channels (build your own reminder dojo)",
  //       "Advanced analytics & reporting (track your memory victories)",
  //       "API access & integrations (connect all your digital weapons)",
  //       "24/7 dedicated support (personal memory sensei on speed dial)",
  //     ],
  //     popular: false,
  //     monthlyPriceId: process.env
  //       .NEXT_PUBLIC_MONTHLY_STRIPE_PREMIUM_PRO_PRICE_ID as string,
  //     yearlyPriceId: process.env
  //       .NEXT_PUBLIC_YEARLY_STRIPE_PREMIUM_PRO_PRICE_ID as string,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex justify-between items-center pr-4 h-28 w-full bg-white sticky top-0 z-50">
        <HeaderComponent
          title="Lets get you started"
          description="We like to keep things simple with billing."
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* No Subscription Alert */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You don't have an active subscription yet. Choose a plan below to
            get started with all our features.
          </AlertDescription>
        </Alert>

        {/* pricing section */}
        <PricingSection user={user} />

        {/* Trust Signals */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include 24/7 support and a 30-day money-back guarantee
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-[#3b82f6]" />
              No setup fees
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-[#3b82f6]" />
              Cancel anytime
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-[#3b82f6]" />
              Secure payments
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-[#3b82f6]" />
              Instant activation
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10 max-w-3xl mx-auto">
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
