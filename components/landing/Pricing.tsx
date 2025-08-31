import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Checkout failed. Try again later.");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Try again later.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Basic",
      price: 19.99,
      features: [
        "Unlimited daily logs",
        "Auto time in/out",
        "Staff access control",
        "Audit log exports",
      ],
      popular: false,
      priceId: "price_1QZ002FZ0000000000000000",
    },
    {
      name: "Standard",
      price: 39.99,
      features: [
        "All Basic features",
        "Monthly DBHDD summaries",
        "Incident tracking",
        "Goal progress reporting",
      ],
      popular: true,
      priceId: "price_1QZ002FZ0000000000000000",
    },
    {
      name: "Premium",
      price: 69.99,
      features: [
        "All Standard features",
        "Multi-staff dashboard",
        "Community integration logs",
        "Real-time alerts",
      ],
      popular: false,
      priceId: "price_1QZ002FZ0000000000000000",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your team's needs. Upgrade or downgrade
            at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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

              <CardHeader
                className={`text-center pb-8 pt-8 ${
                  plan.popular
                    ? "bg-gradient-to-br from-blue-50 to-purple-50"
                    : ""
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.popular ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span
                    className={`text-5xl font-bold ${
                      plan.popular ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 text-lg">/mo</span>
                </div>
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
                  onClick={() => handleCheckout(plan.priceId)}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include 24/7 support and a 30-day money-back guarantee
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
