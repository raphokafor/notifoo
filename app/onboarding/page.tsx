import { getUser } from "@/lib/db-actions";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";

const OnboardingPage = async () => {
  const user = await getUser();

  // set initial step to 0
  let currentStep = 0;

  if (user?.phone) {
    currentStep = 1;
  }

  return (
    <OnboardingClient user={user as User} currentStep={currentStep as number} />
  );
};

export default OnboardingPage;
