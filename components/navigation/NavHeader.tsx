"use client";

import Image from "next/image";
import React from "react";
import Logo from "@/public/logo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

const NavHeader = () => {
  const { data: session } = useSession();

  return (
    <div>
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image src={Logo} alt="Notifoo" width={100} height={100} />
              <span className="text-2xl font-bold text-[#3b82f6]">Notifoo</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            {session?.user ? (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#3b82f6]"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#3b82f6]"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default NavHeader;
