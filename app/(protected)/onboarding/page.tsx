import React from "react";
import OnboardingClient from "./OnboardingClient";
import { getCurrentUser } from "@/lib/db-actions";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

const OnboardingPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signup");
  }

  // set initial step to 0
  const currentStep = 0;

  // check if user has onboarded
  const isOnboarded = user.hasOnboarded;
  if (isOnboarded) {
    redirect("/dashboard");
  }

  return <OnboardingClient user={user as User} currentStep={currentStep} />;
};

export default OnboardingPage;
