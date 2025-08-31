import OldCallbox from "@/public/callbox_nbg.png";
import heroPhone from "@/public/heropic.png";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import CTAButtons from "../CTAButtons";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#296465] py-20 lg:py-32 flex items-center w-full justify-center">
      <div className="container relative">
        <div className="grid items-center gap-8 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-8 text-center lg:text-left pl-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
                The Future of Intercom Callboxes
              </h1>
              <p className="lg:text-xl text-white/60 text-xs">
                Notifoo will allow you to manage your entire community access
                control from car gates to amenity doors.
              </p>
            </div>

            <CTAButtons />
          </div>

          <div className="flex flex-col items-center justify-center">
            <Image
              src={OldCallbox}
              alt="Old Callbox"
              className="h-[300px] w-[300px] rounded-2xl"
            />
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-lg">
              <Image
                src={heroPhone}
                alt="Gatewise mobile app in action"
                className="w-full rounded-2xl shadow-2xl"
              />

              {/* Success notification overlay */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-elegant p-4 flex items-center space-x-3 border">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold text-sm">
                    UPS Delivery Gate Opened!
                  </p>
                </div>
              </div>

              {/* User profile overlay */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-elegant p-4 flex items-center space-x-3 border">
                <div className="w-10 h-10 rounded-full bg-[#296465]"></div>
                <div>
                  <p className="font-semibold text-sm">Alicia M.</p>
                  <p className="text-xs text-muted-foreground">Resident</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
