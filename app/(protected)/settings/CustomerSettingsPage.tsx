"use client";

import { updateUser } from "@/app/actions/user-actions";
import HeaderComponent from "@/components/header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Check, Eye, EyeOff, Loader2Icon, Shield, Trash } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Add these helper functions before the component
const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return "";

  // If it's an international format starting with +1 (US/Canada), convert to US format
  if (phone.startsWith("+1") && phone.length === 12) {
    const digits = phone.slice(2); // Remove +1
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // If it's already formatted or other international format, return as is
  return phone;
};

const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return "";

  // If it's a formatted US number like (404)-247-2337, convert to +1 format
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  // If it already starts with +, return as is
  if (phone.startsWith("+")) {
    return phone;
  }

  // Otherwise return as is
  return phone;
};

export default function CustomerSettingsPage({
  user,
  activities,
}: {
  user: any;
  activities: any[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: formatPhoneNumber(user.phone), // Format the initial phone number
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/delete", {
        method: "POST",
      });
      if (res.ok) {
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully.",
        });
        router.push("/signin");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModal = () => {
    setDeleteModalOpen((prev) => !prev);
  };

  const handleProfileSave = async () => {
    try {
      setIsLoading(true);
      console.log("line 49, profileData", profileData);
      const { success, message } = await updateUser({
        name: profileData.name,
        phone: normalizePhoneNumber(profileData.phone ?? ""), // Convert back to international format
      });
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved successfully.",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Check if it starts with + (international format)
    if (inputValue.startsWith("+")) {
      // For international numbers, allow + and digits only, with basic validation
      const cleanValue = inputValue.replace(/[^\d+]/g, "");

      // Limit international numbers to reasonable length (country code + number)
      if (cleanValue.length <= 15) {
        // E.164 format allows up to 15 digits
        setProfileData((prev) => ({
          ...prev,
          phone: cleanValue,
        }));
      }
    } else {
      // Existing US formatting logic
      const numericValue = inputValue.replace(/\D/g, "");

      // Apply formatting based on length
      let formattedValue = "";
      if (numericValue.length >= 1) {
        formattedValue = `(${numericValue.slice(0, 3)}`;
      }
      if (numericValue.length >= 4) {
        formattedValue = `(${numericValue.slice(0, 3)})-${numericValue.slice(3, 6)}`;
      }
      if (numericValue.length >= 7) {
        formattedValue = `(${numericValue.slice(0, 3)})-${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
      }
      if (numericValue.length === 0) {
        formattedValue = "";
      }

      // Limit to 10 digits max for US numbers
      if (numericValue.length <= 10) {
        setProfileData((prev) => ({
          ...prev,
          phone: formattedValue,
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
      {/* Header */}
      <HeaderComponent
        title="Account Settings"
        description="Manage your profile and security preferences"
      />
      <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-4 ring-slate-100">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                      {profileData.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    Profile Settings
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Manage your personal information and profile details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address{" "}
                  <span className="text-xs text-slate-500">
                    (for email notifications)
                  </span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={profileData.email}
                  disabled={true}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone Number{" "}
                  <span className="text-xs text-slate-500">
                    (Optional for SMS notifications)
                  </span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(404)-123-1234"
                  value={profileData.phone ?? ""}
                  onChange={handlePhoneChange}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-slate-300"
                />
              </div>
              <div className="flex w-full justify-center pt-4">
                <Button
                  disabled={isLoading}
                  onClick={handleProfileSave}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : null}`}
                  />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="lg:col-span-1 border-0 bg-white/80 backdrop-blur-sm h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Shield className="h-5 w-5 text-green-600" />
                Activity
              </CardTitle>
              <CardDescription className="text-slate-600">
                Account activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto flex-1">
              {activities?.length > 0 ? (
                activities?.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div key={activity.id} className="flex flex-col">
                      <span className="text-sm font-medium text-blue-600">
                        {activity.type}
                      </span>
                      <span className="text-xs text-blue-600">
                        {moment(activity.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-xs text-blue-600">
                    No Activities yet
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Password Change Card */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Shield className="h-5 w-5 text-amber-600" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-slate-600">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-medium text-slate-700"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwordData.current}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      current: e.target.value,
                    }))
                  }
                  className="border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordData.new}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        new: e.target.value,
                      }))
                    }
                    className="border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                    className="border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-center pt-4">
              <Button
                disabled={isLoading}
                onClick={handlePasswordChange}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Shield
                  className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : null}`}
                />
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full justify-center py-10">
        <Button
          disabled={isLoading}
          onClick={handleDeleteModal}
          variant="secondary"
        >
          <Trash className="h-4 w-4 text-red-600" />
          Delete Account
          {isLoading && (
            <Loader2Icon className="h-4 w-4 text-red-600 animate-spin" />
          )}
        </Button>
      </div>

      <AlertDialog open={deleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Whoa there! Are you really sure you want to delete your account?
              We promise we're not that annoying (okay, maybe a little).
            </AlertDialogTitle>
            <AlertDialogDescription>
              This is permanent, no take-backs, no do-overs - more final than
              your New Year's resolutions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full">
            <AlertDialogCancel
              onClick={handleDeleteModal}
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white hover:bg-red-600 w-full flex items-center justify-center"
              disabled={isLoading}
            >
              Delete Account{" "}
              {isLoading && (
                <Loader2Icon className="w-4 h-4 animate-spin ml-2" />
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
