import React from "react";
import CustomerBillingClient from "./CustomerBillingClient";
import { getUser } from "@/lib/db-actions";
import { redirect } from "next/navigation";
import BillingNoSubscription from "./BillingNoSubscription";

const BillingPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  if (!user.subscriptionId) {
    return <BillingNoSubscription user={user as any} />;
  }

  return <CustomerBillingClient user={user as any} />;
};

export default BillingPage;
