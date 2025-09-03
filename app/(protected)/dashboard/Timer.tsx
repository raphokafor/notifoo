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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTime } from "@/contexts/TimeContext";
import { formatTimeDifference } from "@/lib/utils";
import { TimerData } from "@/types/database";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Loader2Icon, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

interface TimerProps extends Omit<TimerData, "id"> {
  id: string;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isOpen: boolean;
  handleModal: () => void;
}

export function Timer({
  id,
  name,
  dueDate,
  type,
  isActive,
  emailNotification = true,
  smsNotification = false,
  onDelete,
  isLoading,
  isOpen,
  handleModal,
}: TimerProps) {
  const { now } = useTime();
  const [showDelete, setShowDelete] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const timeLeft = React.useMemo(
    () => formatTimeDifference(dueDate, type, now),
    [dueDate, type, now]
  );
  const isExpired = type === "till" && timeLeft.total <= 0;

  const renderTimeUnit = (value: number, label: string) => {
    return (
      <div className="flex justify-center w-[160px]">
        <span className="flex-1 text-4xl font-bold tabular-nums text-right pr-1">
          {value.toString().padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm font-medium text-left pl-1 self-end pb-1">
          {label}
        </span>
      </div>
    );
  };

  const renderTimeUnits = () => {
    const units = [
      { value: timeLeft.years, label: "YEARS" },
      { value: timeLeft.months, label: "MONTHS" },
      { value: timeLeft.days, label: "DAYS" },
      { value: timeLeft.hours, label: "HOURS" },
      { value: timeLeft.minutes, label: "MINUTES" },
      { value: timeLeft.seconds, label: "SECONDS" },
    ];

    if (isExpired) {
      return units
        .slice(2, 6)
        .map((unit) => (
          <React.Fragment key={unit.label}>
            {renderTimeUnit(0, unit.label)}
          </React.Fragment>
        ));
    }

    let startIndex = 0;
    if (timeLeft.years > 0) {
      startIndex = 0;
    } else if (timeLeft.months > 0) {
      startIndex = 1;
    } else {
      startIndex = 2;
    }

    const unitsToShow = units.slice(startIndex, startIndex + 4);

    return unitsToShow.map((unit) => (
      <React.Fragment key={unit.label}>
        {renderTimeUnit(unit.value, unit.label)}
      </React.Fragment>
    ));
  };

  return (
    <motion.div
      layout
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-3xl"
    >
      <AnimatePresence>
        <Link href={`/reminders/${id}`}>
          <Card
            className={`w-[280px] h-[280px] relative ${isExpired && !isHovered ? "opacity-50" : ""} transition-opacity duration-200`}
            onMouseEnter={() => {
              setShowDelete(true);
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setShowDelete(false);
              setIsHovered(false);
            }}
            style={{ viewTransitionName: `timer-${id}` }}
          >
            <CardContent className="p-4 h-full rounded-3xl ">
              <div className="absolute top-4 left-6 right-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center flex-1 min-w-0">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${!isActive ? "bg-red-600" : type === "till" ? "bg-green-500" : "bg-zinc-500"}`}
                    ></div>
                    <h2 className="text-sm text-muted-foreground truncate font-mono capitalize">
                      {name}
                    </h2>
                  </div>

                  {/* Notification indicators */}
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    {emailNotification && (
                      <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    {smsNotification && (
                      <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <MessageSquare className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                </div>
                <p
                  className={`text-[10px] text-muted-foreground mt-1 px-6 my-4 border-t border-b font-mono transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
                >
                  <strong>{type === "till" ? "Until: " : "Since: "}</strong>
                  {dueDate.toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="absolute inset-0 flex items-center justify-center mt-12">
                <div className="flex flex-col -space-y-1">
                  {renderTimeUnits()}
                  <br />
                  <div className="flex items-center gap-2 text-xs text-red-500 text-center">
                    &nbsp;
                    <Calendar className="w-3 h-3" />
                    {dueDate.toLocaleString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </AnimatePresence>

      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this reminder?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone once the reminder has been deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full">
            <AlertDialogCancel
              onClick={() => handleModal()}
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(id)}
              className="bg-red-500 text-white hover:bg-red-600 w-full flex items-center justify-center"
              disabled={isLoading}
            >
              Delete Reminder{" "}
              {isLoading && (
                <Loader2Icon className="w-4 h-4 animate-spin ml-2" />
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
