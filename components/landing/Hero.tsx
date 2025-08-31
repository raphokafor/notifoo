// app/components/landing-hero.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Optional: Lottie
// import Lottie from "lottie-react";
// import animationData from "@/public/animation.json";

export default function Hero() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 py-20 max-w-7xl mx-auto px-6">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Save Time on Documentation.
        </h1>
        <p className="text-gray-600 text-lg">
          Our software helps Georgia DBHDD providers skip the paperwork and stay
          audit-ready with secure, real-time daily logs.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button className="text-base">Start Free Trial</Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" className="text-base">
              Book a Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-md h-[300px]">
        {/* Use an animated Lottie or fallback image */}
        {/* <Lottie animationData={animationData} loop /> */}
        <Image
          src="/illustration.svg"
          alt="Illustration"
          fill
          className="object-contain"
        />
      </div>
    </section>
  );
}
