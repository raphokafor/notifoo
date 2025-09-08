// get fresh data every time the page is loaded just in case user makes changes in the manage portal
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
export const revalidate = 0; // <- disable all caching

import React from "react";
import CustomerBillingClient from "./CustomerBillingClient";
import { getUser } from "@/lib/db-actions";
import { redirect } from "next/navigation";
import BillingNoSubscription from "./BillingNoSubscription";
import { getSubscription } from "@/lib/stripe";

const BillingPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }

  if (user?.subscriptionStatus !== "active") {
    return <BillingNoSubscription user={user as any} />;
  }

  // get the subscription data
  const subscriptionData = await getSubscription(user.subscriptionId as string);

  if (!subscriptionData) {
    console.error("Failed to retrieve subscription data");
    return <BillingNoSubscription user={user as any} />;
  }

  return (
    <CustomerBillingClient
      user={user as any}
      subscriptionData={subscriptionData as any}
    />
  );
};

export default BillingPage;
