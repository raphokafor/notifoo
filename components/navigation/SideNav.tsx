"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.png";
import { User } from "@prisma/client";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "../ui/use-toast";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   name: "Reminders",
  //   href: "/reminders",
  //   icon: FileText,
  // },
  // {
  //   name: "Call Boxes",
  //   href: "/callboxes",
  //   icon: MailboxIcon,
  // },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  // {
  //   name: "Tenants",
  //   href: "/tenants",
  //   icon: Users,
  // },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SideNavProps {
  className?: string;
}

export default function SideNav({ className }: SideNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  // Filter navigation based on user role
  const user = session?.user as User;

  // Mobile detection and auto-collapse
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(isMobileView);

      // Only auto-collapse on initial mount if mobile
      if ((!hasInitialized && isMobileView) || !user?.hasOnboarded) {
        setCollapsed(true);
        setHasInitialized(true);
      } else if (!hasInitialized) {
        // Set initialized even if not mobile
        setHasInitialized(true);
      }
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events (but only update isMobile, not auto-collapse)
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [hasInitialized]);

  const handleToggleCollapse = () => {
    if (!user?.hasOnboarded) {
      toast({
        title: "Please complete onboarding",
        description: "Please complete onboarding to continue",
        variant: "destructive",
      });
      return;
    }

    // Allow manual toggle on both mobile and desktop
    setCollapsed(!collapsed);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        // Remove the hidden class for mobile
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            {/* <Image src={Logo} alt="Notifoo" width={100} height={100} /> */}
            <Bell className="text-primary" size={38} />
            <span className="font-bold text-slate-600">Notifoo</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Bell className="text-primary" size={36} />
          </div>
        )}
      </div>

      {/* Collapse/Expand Button - positioned on border */}
      {/* Show toggle button on both mobile and desktop */}
      <Button
        size="sm"
        onClick={handleToggleCollapse}
        className="absolute top-11 -right-4 z-10 p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" color="black" />
        ) : (
          <ChevronLeft className="w-4 h-4" color="black" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-2 pt4 space-y-4 mt-4">
        {navigation.map((item) => {
          const isItemActive = item.href ? isActive(item.href) : false;

          return (
            <div key={item.name}>
              <Link href={user?.hasOnboarded ? item.href! : "#"}>
                <Button
                  variant="ghost"
                  disabled={!user?.hasOnboarded}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    collapsed && "justify-center px-2",
                    isItemActive
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      : "hover:bg-slate-100"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", !collapsed && "mr-2")} />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* User Info and Logout */}
      {session && (
        <div className="p-2">
          {!collapsed ? (
            <div className="space-y-2">
              {/* User Info */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* User Avatar */}
              <div className="flex justify-center p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
