"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import {
  Check,
  Loader2,
  MailCheckIcon,
  PhoneCallIcon,
  TabletIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function PricingSection({ user }: { user?: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const features = [
    "Email notifications (digital nudges to your inbox)",
    "SMS notifications (double-tap reminder strikes)",
    "Call notifications (WE WILL LITERALLY CALL YOU!)",
    "Advanced recurring patterns (master-level scheduling kung fu)",
    // "Team collaboration (assemble your memory warriors)",
    "Custom notification channels (build your own reminder dojo)",
    // "Advanced analytics & reporting (track your memory victories)",
    "Priority support (VIP treatment from the Notifoo ninjas)",
  ];

  const onConnect = async () => {
    try {
      setIsLoading(true);
      if (user) {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
        });

        if (!res.ok) {
          toast.error("Failed to create checkout session");
          return;
        }

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        router.push("/signup");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create checkout session");
    }
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[#3b82f6] font-semibold italic font-serif text-lg mb-4"
          style={{ fontFamily: "cursive" }}
        >
          Pricing
        </p>
        <h1 className="text-4xl md:text-4xl font-bold text-zinc-700 mb-8 leading-tight">
          Unlimited reminders (memory black belt status)
        </h1>
      </div>

      {/* Key Features */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <MailCheckIcon className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-muted-foreground">
            Email notifications (digital nudges to your inbox)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
            <TabletIcon className="w-4 h-4 text-orange-600" />
          </div>
          <span className="text-muted-foreground">
            SMS notifications (double-tap reminder strikes)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <PhoneCallIcon className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-muted-foreground">
            Call notifications (voice-to-voice reminders)
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mb-12">
        <Button
          size="lg"
          disabled={isLoading}
          onClick={onConnect}
          className="bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white px-8 py-3 text-base font-medium"
        >
          Start your 7-day free trial
          {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
        </Button>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <Check className="w-3 h-3 text-[#3b82f6]" />
            </div>
            <span className="text-muted-foreground leading-relaxed">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
