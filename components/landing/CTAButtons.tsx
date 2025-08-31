"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const CTAButtons = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:justify-center lg:justify-start">
      {/* <Button
        variant="default"
        size="lg"
        className="w-full sm:w-auto text-white bg-orange-400 hover:bg-orange-400"
      >
        Request a Demo
      </Button> */}
      {session ? (
        <Link href="/signup" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Get Started Free
          </Button>
        </Link>
      ) : null}
    </div>
  );
};

export default CTAButtons;
