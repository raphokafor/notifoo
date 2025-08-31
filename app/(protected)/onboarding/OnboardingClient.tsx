"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2Icon,
  Building2,
  Users,
  Shield,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Package,
  Zap,
  Star,
  Crown,
  HomeIcon,
  HousePlusIcon,
  WarehouseIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const plans = [
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
];

type OnboardingData = {
  userType: string; // "property_management" or "individual"
  propertyType: string;
  buildingCount: string;
  unitCount: string;
  currentSolution: string;
  primaryConcern: string;
  planType: string;
};

export default function OnboardingClient({
  user,
  currentStep,
}: {
  user: User;
  currentStep: number;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingData>({
    userType: "",
    propertyType: "",
    buildingCount: "",
    unitCount: "",
    currentSolution: "",
    primaryConcern: "",
    planType: "",
  });

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate total steps based on user type
  const getTotalSteps = () => {
    if (data.userType === "property_management") {
      return 7; // userType, propertyType, details, currentSolution, primaryConcern, statistics, plans
    } else {
      return 6; // userType, propertyType, details, currentSolution, statistics, plans (skip primaryConcern)
    }
  };

  // Get the adjusted step for property management vs individual flow
  const getAdjustedStep = (currentStep: number) => {
    if (data.userType === "individual" && currentStep >= 4) {
      return currentStep + 1; // Skip the primary concern step for individuals
    }
    return currentStep;
  };

  const nextStep = () => {
    const maxStep = getTotalSteps() - 1;
    if (step < maxStep) {
      // Skip primary concern step for individuals
      if (data.userType === "individual" && step === 3) {
        setStep(step + 2); // Skip step 4 (primary concern)
      } else {
        setStep(step + 1);
      }
      setError("");
    }
  };

  const previousStep = () => {
    if (step > 0) {
      // Skip primary concern step for individuals when going back
      if (data.userType === "individual" && step === 5) {
        setStep(step - 2); // Skip step 4 (primary concern)
      } else {
        setStep(step - 1);
      }
      setError("");
    }
  };

  const isNextDisabled = () => {
    if (step === 0) return !data.userType;
    if (step === 1) return !data.propertyType;
    if (step === 2) return !data.unitCount;
    if (step === 3) return !data.currentSolution;
    if (step === 4) return !data.primaryConcern; // Only for property management
    if (step === 5) return false; // Statistics step
    if (step === 6) return !data.planType;
    return false;
  };

  const onStartFreeTrial = async () => {
    setIsLoading(true);
    try {
      track("onboarding_start_free_trial", {
        location: "onboarding_page",
        email: user?.email,
        propertyType: data.propertyType,
        buildingCount: data.buildingCount,
        planType: data.planType,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/free-trial`,
        {
          propertyType: data.propertyType,
          buildingCount: data.buildingCount,
          unitCount: data.unitCount,
          currentSolution: data.currentSolution,
          primaryConcern: data.primaryConcern,
          planType: data.planType,
        }
      );

      if (response.data.success) {
        toast({
          title: "Welcome to Notifoo!",
          description:
            "Your free trial has started. Setting up your dashboard...",
          variant: "default",
        });

        // Update user onboarding status
        await axios.post("/api/user/update", {
          hasOnboarded: true,
        });

        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.log("Free trial error:", err);
      toast({
        title: "Error starting free trial",
        description: "Please try again",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep) {
      setStep(currentStep);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col items-center justify-center mb-8">
        <Image
          width={120}
          height={120}
          className="object-contain h-32 w-32 mb-6"
          src={"/logo.png"}
          alt="Notifoo Logo"
        />
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Welcome to Notifoo
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Let's set up your smart call box system in just a few steps
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between">
            {Array.from({ length: getTotalSteps() }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all mx-2 duration-500",
                  i <= step
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-gray-200"
                )}
                style={{ width: `${100 / getTotalSteps()}%` }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Step {step + 1} of {getTotalSteps()}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {step === 0 && (
              <UserTypeStep
                value={data.userType}
                onChange={(value) => updateData("userType", value)}
              />
            )}

            {step === 1 && (
              <PropertyTypeStep
                value={data.propertyType}
                onChange={(value) => updateData("propertyType", value)}
                userType={data.userType}
              />
            )}

            {step === 2 && (
              <PropertyDetailsStep
                buildingCount={data.buildingCount}
                unitCount={data.unitCount}
                onBuildingChange={(value) => updateData("buildingCount", value)}
                onUnitChange={(value) => updateData("unitCount", value)}
                userType={data.userType}
              />
            )}

            {step === 3 && (
              <CurrentSolutionStep
                value={data.currentSolution}
                onChange={(value) => updateData("currentSolution", value)}
              />
            )}

            {step === 4 && data.userType === "property_management" && (
              <PrimaryConcernStep
                value={data.primaryConcern}
                onChange={(value) => updateData("primaryConcern", value)}
              />
            )}

            {((step === 5 && data.userType === "property_management") ||
              (step === 4 && data.userType === "individual")) && (
              <StatisticsStep data={data} />
            )}

            {((step === 6 && data.userType === "property_management") ||
              (step === 5 && data.userType === "individual")) && (
              <PlanSelectionStep
                value={data.planType}
                onChange={(value) => updateData("planType", value)}
                data={data}
                onStartFreeTrial={onStartFreeTrial}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {step < getTotalSteps() - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex gap-3 max-w-lg mx-auto"
          >
            {step > 0 && (
              <Button
                onClick={previousStep}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
            )}
            <Button
              onClick={nextStep}
              disabled={isNextDisabled()}
              className={cn(
                "flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
                step === 0 && "w-full"
              )}
              size="lg"
            >
              {(step === 5 && data.userType === "property_management") ||
              (step === 4 && data.userType === "individual")
                ? "Choose Plan"
                : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-500 text-center mt-3 text-sm">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// New UserTypeStep component
function UserTypeStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const userTypes = [
    {
      id: "property_management",
      title: "Property Management",
      description:
        "I manage properties and need call box solutions for my buildings",
      icon: Building2,
    },
    {
      id: "individual",
      title: "Resident/Business",
      description: "I need a better way to manage my personal call box",
      icon: Users,
    },
  ];

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">
          How would you describe yourself?
        </h2>
        <p className="text-gray-600">This helps us customize your experience</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {userTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(type.id)}
            className={cn(
              "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
              value === type.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center space-x-3">
              <type.icon
                className={cn(
                  "h-6 w-6",
                  value === type.id ? "text-blue-500" : "text-gray-400"
                )}
              />
              <div>
                <h3 className="font-medium text-gray-800">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Update PropertyTypeStep to include userType
function PropertyTypeStep({
  value,
  onChange,
  userType,
}: {
  value: string;
  onChange: (value: string) => void;
  userType: string;
}) {
  const propertyTypes = [
    {
      id: "apartment",
      title: "Apartment Complex",
      description: "Multi-unit apartment buildings",
      icon: Building2,
    },
    {
      id: "houses",
      title: "Houses",
      description: "Single-family homes",
      icon: HousePlusIcon,
    },
    {
      id: "other",
      title: "Other",
      description: "Custom property type",
      icon: WarehouseIcon,
    },
  ];

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">
          What type of property do you manage?
        </h2>
        <p className="text-gray-600">
          This helps us customize your call box system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {propertyTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(type.id)}
            className={cn(
              "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
              value === type.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center space-x-3">
              <type.icon
                className={cn(
                  "h-6 w-6",
                  value === type.id ? "text-blue-500" : "text-gray-400"
                )}
              />
              <div>
                <h3 className="font-medium text-gray-800">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Update PropertyDetailsStep to include userType
function PropertyDetailsStep({
  buildingCount,
  unitCount,
  onBuildingChange,
  onUnitChange,
  userType,
}: {
  buildingCount: string;
  unitCount: string;
  onBuildingChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  userType: string;
}) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Tell us about you</h2>
        <p className="text-gray-600">
          {userType === "property_management"
            ? "This helps us recommend the right call box setup for your properties"
            : "This helps us customize your call box solution"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="units" className="text-sm font-medium text-gray-700">
            {userType === "property_management"
              ? "Total number of call boxes you want to create"
              : "How many call boxes do you need?"}
          </Label>
          <Input
            id="units"
            type="number"
            value={unitCount}
            onChange={(e) => onUnitChange(e.target.value)}
            placeholder={
              userType === "property_management" ? "e.g., 50" : "e.g., 1"
            }
            className="mt-1"
            min="1"
          />
        </div>
      </div>
    </motion.div>
  );
}

function CurrentSolutionStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const solutions = [
    {
      id: "traditional",
      title: "Traditional Intercom System",
      description: "Old-school intercom with physical buttons",
    },
    {
      id: "none",
      title: "No Access Control System",
      description: "Currently using keys or no system at all",
    },
    {
      id: "other",
      title: "Other Solution",
      description: "Different type of access control",
    },
  ];

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">
          What's your current access control solution?
        </h2>
        <p className="text-gray-600">
          Understanding your current setup helps us plan the transition
        </p>
      </div>

      <div className="space-y-3">
        {solutions.map((solution) => (
          <motion.div
            key={solution.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(solution.id)}
            className={cn(
              "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
              value === solution.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2",
                  value === solution.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                )}
              />
              <div>
                <h3 className="font-medium text-gray-800">{solution.title}</h3>
                <p className="text-sm text-gray-600">{solution.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PrimaryConcernStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">
          What's your primary concern?
        </h2>
        <p className="text-gray-600">
          Help us understand what matters most to you
        </p>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Security issues, maintenance costs, resident complaints, delivery management..."
        className="min-h-32"
        autoFocus
      />

      <div className="text-sm text-gray-500">
        <p>Common concerns include:</p>
        <ul className="mt-2 space-y-1 text-xs">
          <li>• Unauthorized building access</li>
          <li>• Package delivery coordination</li>
          <li>• Maintenance and repair costs</li>
          <li>• Resident satisfaction with entry system</li>
        </ul>
      </div>
    </motion.div>
  );
}

// Update StatisticsStep to show different content based on userType
function StatisticsStep({ data }: { data: OnboardingData }) {
  const isPropertyManagement = data.userType === "property_management";

  const stats = isPropertyManagement
    ? [
        {
          title: "Average Setup Time",
          value: "< 2 hours",
          description: "Most properties are fully operational within 2 hours",
          icon: Clock,
          color: "text-green-600",
        },
        {
          title: "Security Incidents Reduced",
          value: "87%",
          description:
            "Properties report significant reduction in unauthorized access",
          icon: Shield,
          color: "text-blue-600",
        },
        {
          title: "Resident Satisfaction",
          value: "94%",
          description: "Residents love the convenience and security features",
          icon: Users,
          color: "text-purple-600",
        },
        {
          title: "Maintenance Cost Savings",
          value: "65%",
          description: "Smart diagnostics reduce maintenance calls",
          icon: TrendingUp,
          color: "text-orange-600",
        },
      ]
    : [
        {
          title: "Setup Time",
          value: "< 30 min",
          description: "Quick and easy installation for personal use",
          icon: Clock,
          color: "text-green-600",
        },
        {
          title: "Security Improvement",
          value: "10x Better",
          description: "Enhanced security compared to traditional systems",
          icon: Shield,
          color: "text-blue-600",
        },
        {
          title: "User Satisfaction",
          value: "98%",
          description: "Individual users love the convenience",
          icon: Users,
          color: "text-purple-600",
        },
        {
          title: "Cost Savings",
          value: "80%",
          description: "Significant savings vs traditional intercom systems",
          icon: TrendingUp,
          color: "text-orange-600",
        },
      ];

  const packageInsights = isPropertyManagement
    ? [
        {
          title: "Missing: Smart Analytics",
          description:
            "78% of properties benefit from visitor analytics and access logs",
          percentage: 78,
        },
        {
          title: "Missing: Mobile App Integration",
          description: "92% of residents prefer mobile-first access control",
          percentage: 92,
        },
        {
          title: "Missing: Delivery Management",
          description:
            "85% of properties need automated delivery notifications",
          percentage: 85,
        },
      ]
    : [
        {
          title: "Missing: Smart Notifications",
          description: "90% of individuals want instant mobile notifications",
          percentage: 90,
        },
        {
          title: "Missing: Remote Access",
          description: "85% prefer controlling access remotely",
          percentage: 85,
        },
        {
          title: "Missing: Modern Interface",
          description: "95% want a modern, app-based solution",
          percentage: 95,
        },
      ];

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">
          {isPropertyManagement
            ? "See what you're missing"
            : "Why upgrade your call box?"}
        </h2>
        <p className="text-gray-600">
          {isPropertyManagement
            ? "Industry insights based on your property type"
            : "Benefits you'll get with a modern solution"}
        </p>
      </div>

      {/* Industry Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
              <span className={cn("text-2xl font-bold", stat.color)}>
                {stat.value}
              </span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm">{stat.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Update PlanSelectionStep to show different plans based on userType
function PlanSelectionStep({
  value,
  onChange,
  data,
  onStartFreeTrial,
  isLoading,
  setIsLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  data: OnboardingData;
  onStartFreeTrial: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) {
  const isPropertyManagement = data.userType === "property_management";
  const onConnect = async () => {
    setIsLoading(true);
    try {
      track("onboarding_connect_stripe_click", {
        location: "onboarding_page",
        userType:
          data.userType === "property_management"
            ? "property_management"
            : "individual",
      });

      // make request to the connect endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/onboarding`,
        {
          propertyType: data?.propertyType,
          buildingCount: data?.buildingCount,
          unitCount: data?.unitCount,
          currentSolution: data?.currentSolution,
          primaryConcern: data?.primaryConcern,
          planType: data?.planType,
        }
      );

      window.location.href = response.data.url;
    } catch (err) {
      console.log("there was an error", err);
      toast({
        title: "There was an error connecting to Stripe",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Choose your plan</h2>
        <p className="text-gray-600">
          {isPropertyManagement
            ? "Special property management pricing - One year no contract"
            : "Start with a 7-day free trial, no credit card required"}
        </p>
      </div>

      {/* Plan Cards */}
      <div
        className={cn(
          "grid gap-6",
          isPropertyManagement
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 lg:grid-cols-2"
        )}
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(plan.id)}
            className={cn(
              "relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200",
              value === plan.id
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300",
              plan.popular && "ring-2 ring-purple-500 ring-opacity-50"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 right-6 bg-purple-500">
                Most Popular
              </Badge>
            )}

            <div className="flex flex-col items-center text-center">
              <plan.icon
                className={cn(
                  "h-12 w-12 mb-4",
                  value === plan.id ? "text-blue-500" : "text-gray-400"
                )}
              />

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-800">
                  {plan.name === "Enterprise" ? "Call Us" : `$${plan.price}`}
                </div>
                {isPropertyManagement && "originalPrice" in plan && (
                  <div className="text-sm text-gray-500 line-through">
                    ${plan.originalPrice}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  {plan.name !== "Enterprise" ? "per month" : ""}
                </div>
              </div>

              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 max-w-lg mx-auto"
      >
        <Button
          onClick={onConnect}
          disabled={!value || isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-6 text-lg"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
              Setting up your free trial...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              {isPropertyManagement
                ? "No Contract First Year"
                : "Start 7-day Free Trial"}
            </>
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            ✅ Cancel anytime • ✅ Full access to all features • ✅ No charge
          </p>
          <p className="text-xs text-gray-500">
            You can upgrade, downgrade, or cancel your plan at any time
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
