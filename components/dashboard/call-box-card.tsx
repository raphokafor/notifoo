"use client";

import { disableCallBox } from "@/app/actions/callBox-action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CallBox } from "@prisma/client";
import { Building2, Edit, Phone, Power } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../form-error";

const CallBoxCard = ({ callBox }: { callBox: CallBox }) => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  const handleDisableCallBox = async () => {
    setIsDisabling(true);
    try {
      // Add your disable logic here
      console.log(`Disabling call box: ${callBox.id}`);

      // disable call box
      const { success, error } = await disableCallBox(callBox.id);
      if (!success) {
        setError(error);
        return;
      }

      // Only close dialog on success
      router.refresh();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error disabling call box:", error);
      // Dialog stays open on error
      // You might want to show an error message here
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <Card className="relative h-full sm:h-60 lg:h-64 xl:h-72 bg-white border-none  shadow-none">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header with green indicator and edit icon */}
        <div className="flex items-center justify-between p-4 sm:p-4">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50 ring-2 sm:ring-4 ring-green-400/30"></div>
          <Link href={`/callboxes/${callBox.id}`}>
            <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
          </Link>
        </div>

        {/* Main content area - responsive layout */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-4 py-4 sm:py-2">
          <div className="flex flex-col sm:flex-row items-center justify-evenly sm:items-start gap-8 sm:gap-6 lg:gap-8 w-full">
            {/* Building section */}
            <div className="flex flex-col items-center text-center w-full sm:w-20 lg:w-24">
              <div className="w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-2">
                <Building2 className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-600" />
              </div>
              <h3 className="text-sm sm:text-sm lg:text-base font-semibold text-slate-900 mb-1 flex-wrap max-w-full">
                {callBox.name}
              </h3>
              <p className="text-xs text-slate-400 flex-wrap max-w-full">
                {callBox.address}
              </p>
            </div>

            {/* Phone section */}
            <div className="flex flex-col items-center text-center w-full sm:w-28 lg:w-32">
              <div className="w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-2">
                <Phone className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <h3 className="text-sm sm:text-sm lg:text-base font-semibold text-slate-900 mb-1">
                {callBox.phone}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed text-center px-1">
                Give this number to Property Mgmt.
              </p>
            </div>

            {/* Grid section */}
            <div className="flex flex-col items-center text-center w-full sm:w-16 lg:w-20">
              <div className="w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-2">
                <h3 className="text-xl sm:text-xl lg:text-2xl font-bold text-slate-900">
                  {callBox.buzzCode}
                </h3>
              </div>
              <p className="text-xs text-slate-400 flex-wrap max-w-full">
                Number that is dialed to open the gate.
              </p>
            </div>
          </div>
        </div>

        {/* Power button */}
        <div className="absolute bottom-3 right-3 sm:bottom-3 sm:right-3">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <button className="w-10 h-10 sm:w-10 sm:h-10 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors">
                <Power className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disable Call Box?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will disable the call box for "{callBox.name}".
                  All incoming calls will be redirected directly to your phone
                  instead of going through the call box system. You can
                  re-enable it at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {error && <FormError message={error} />}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDisabling}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className={cn(
                    "rounded-sm",
                    callBox.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  )}
                  onClick={handleDisableCallBox}
                  disabled={isDisabling}
                >
                  {callBox.isActive ? "Disable Call Box" : "Enable Call Box"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallBoxCard;
