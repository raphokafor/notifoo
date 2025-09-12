"use client";

import HeaderComponent from "@/components/header";
import { TimerData } from "@/types/database";
import React, { useState } from "react";
import { Timer } from "../dashboard/Timer";
import { useRouter } from "next/navigation";
import { createReminder, deleteReminder } from "@/app/actions/reminder-actions";
import { toast } from "sonner";
import { TimeProvider } from "@/contexts/TimeContext";
import { AnimatePresence, motion } from "framer-motion";
import { TimerCreationCard } from "../dashboard/TimerCreationCard";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Grid3x3,
  List,
  Calendar,
  Mail,
  MessageSquare,
  PhoneCallIcon,
  Repeat2Icon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTime } from "@/contexts/TimeContext";
import { cn, formatTimeDifference } from "@/lib/utils";
import Link from "next/link";

const RemindersClient = ({
  reminders,
  user,
}: {
  reminders: TimerData[];
  user: User;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [timers, setTimers] = React.useState<TimerData[]>([]);
  const [modalState, setModalState] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reminders-view-mode");
      return (saved as "card" | "table") || "card";
    }
    return "card";
  });

  const handleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleViewMode = () => {
    const newMode = viewMode === "card" ? "table" : "card";
    setViewMode(newMode);
    localStorage.setItem("reminders-view-mode", newMode);
  };

  const handleModalState = (state: boolean) => {
    setModalState(state);
  };

  const handleDeleteTimer = async (id: string) => {
    try {
      setIsLoading(true);
      const { success, message } = await deleteReminder(id);
      if (success) {
        toast(message, {
          position: "top-right",
        });

        setTimers((prevTimers) => {
          const updatedTimers = prevTimers.filter((timer) => timer.id !== id);
          localStorage.setItem("timers", JSON.stringify(updatedTimers));
          return updatedTimers;
        });

        router.refresh();
        handleModal();
      } else {
        toast(message, {
          position: "top-right",
        });
        setError(message);
      }
    } catch (error) {
      console.error("Error deleting timer:", error);
      setError("Error deleting timer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTimer = async (newTimer: TimerData) => {
    try {
      setIsLoading(true);
      setError("");
      const { success, message } = await createReminder(newTimer);
      if (success) {
        setTimers((prevTimers) => {
          const updatedTimers = [...prevTimers, newTimer];
          return updatedTimers;
        });

        toast(message, {
          position: "top-right",
        });

        router.refresh();
        handleModalState(false);
      } else {
        toast(message, {
          position: "top-right",
        });
        setError(message);
      }
    } catch (error) {
      toast("Error creating timer", {
        position: "top-right",
      });
      console.error("Error creating timer:", error);
      setError("Error creating timer");
    } finally {
      setIsLoading(false);
    }
  };

  // Inner component that can use useTime hook
  const TableViewComponent = () => {
    const { now } = useTime();

    return (
      <div className="p-4 md:p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Time Remaining</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Notifications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders?.map((reminder) => {
              const timeLeft = formatTimeDifference(
                reminder.dueDate,
                reminder.type,
                now
              );
              const isExpired = reminder.type === "till" && timeLeft.total <= 0;

              return (
                <TableRow
                  key={reminder.id}
                  className={isExpired ? "opacity-60" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          !reminder.isActive
                            ? "bg-red-600"
                            : reminder.type === "till"
                              ? "bg-green-500"
                              : "bg-zinc-500"
                        }`}
                      />
                      <Badge
                        variant={reminder.isActive ? "default" : "destructive"}
                      >
                        {reminder.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    <Link
                      href={`/reminders/${reminder.id}`}
                      className={`hover:underline ${
                        !reminder.isActive ? "line-through" : ""
                      }`}
                    >
                      {reminder.name}
                    </Link>
                  </TableCell>

                  <TableCell>
                    {isExpired ? (
                      <Badge variant="destructive">EXPIRED</Badge>
                    ) : (
                      <div className="font-mono text-sm">
                        {timeLeft.days > 0 && `${timeLeft.days}d `}
                        {timeLeft.hours > 0 &&
                          `${timeLeft.hours.toString().padStart(2, "0")}h `}
                        {`${timeLeft.minutes.toString().padStart(2, "0")}m `}
                        {`${timeLeft.seconds.toString().padStart(2, "0")}s`}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {reminder.dueDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      {reminder.emailNotification && (
                        <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      {reminder.smsNotification && (
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <MessageSquare className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {reminder.callNotification && (
                        <div className="p-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <PhoneCallIcon className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                        </div>
                      )}
                      {reminder.recurringNotification && (
                        <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <Repeat2Icon className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant={reminder.isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleDeleteTimer(reminder.id!)}
                      disabled={isLoading}
                      className={cn(
                        "text-red-600 hover:text-red-700 hover:bg-red-50",
                        reminder.isActive &&
                          "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                      )}
                    >
                      {reminder.isActive ? "Done" : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TimerCreationCard
          onCreateTimer={handleCreateTimer}
          handleModalState={handleModalState}
          modalState={modalState}
          error={error}
          isLoading={isLoading}
          user={user}
        />
      </div>
    );
  };

  return (
    <TimeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-between items-center pr-4 h-28 w-full bg-white sticky top-0 z-50">
          <HeaderComponent
            title="Reminders"
            description="Create, edit, and delete your reminders"
          />

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="flex items-center gap-1"
            >
              {viewMode === "card" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid3x3 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {viewMode === "card" ? "Table" : "Cards"}
              </span>
            </Button>

            <Button
              variant="default"
              className="hidden md:flex items-center gap-2"
              onClick={() => handleModalState(true)}
            >
              <PlusIcon />
              Add Reminder
            </Button>

            <Button
              variant="default"
              className="md:hidden flex items-center gap-2"
              onClick={() => handleModalState(true)}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>

        {viewMode === "table" ? (
          <TableViewComponent />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 justify-items-start content-start p-4 md:p-8"
            layout
          >
            <AnimatePresence>
              {reminders?.length > 0 &&
                reminders?.map((reminder) => (
                  <motion.div key={reminder.id}>
                    <Timer
                      id={reminder.id!}
                      name={reminder.name}
                      dueDate={reminder.dueDate}
                      type={reminder.type}
                      isActive={reminder.isActive}
                      onDelete={handleDeleteTimer}
                      isLoading={isLoading}
                      isOpen={isOpen}
                      handleModal={handleModal}
                      emailNotification={reminder.emailNotification}
                      smsNotification={reminder.smsNotification}
                      callNotification={reminder.callNotification}
                      recurringNotification={
                        reminder.recurringNotification ?? false
                      }
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
            <TimerCreationCard
              onCreateTimer={handleCreateTimer}
              handleModalState={handleModalState}
              modalState={modalState}
              error={error}
              isLoading={isLoading}
              user={user}
            />
          </motion.div>
        )}
      </div>
    </TimeProvider>
  );
};

export default RemindersClient;
