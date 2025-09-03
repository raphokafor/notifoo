import { getUser } from "@/lib/db-actions";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";

const OnboardingPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/signup");
  }

  // set initial step to 0
  let currentStep = 0;

  // check if user has onboarded
  // const isOnboarded = user.hasOnboarded;
  // if (isOnboarded) {
  //   redirect("/dashboard");
  // }

  return (
    <OnboardingClient user={user as User} currentStep={currentStep as number} />
  );
};

export default OnboardingPage;
