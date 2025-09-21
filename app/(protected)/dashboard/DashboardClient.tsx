"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "./Timer";
import { TimerCreationCard } from "./TimerCreationCard";
import { TimerData } from "@/types/database";
import { TimeProvider } from "@/contexts/TimeContext";
import { useRouter } from "next/navigation";
import { createReminder, deleteReminder } from "@/app/actions/reminder-actions";
import { toast } from "sonner";
import HeaderComponent from "@/components/header";
import { User } from "@prisma/client";
import {
  PlusIcon,
  Grid3x3,
  List,
  Calendar,
  Mail,
  MessageSquare,
  PhoneCallIcon,
  Repeat2Icon,
  ChevronLeft,
  ChevronRight,
  GhostIcon,
  TrashIcon,
  CheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Dashboard({
  reminders,
  user,
}: {
  reminders: TimerData[];
  user: User;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState(false);
  const [timers, setTimers] = React.useState<TimerData[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "calendar">(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("dashboard-view-mode");
        return (saved as "cards" | "table" | "calendar") || "cards";
      }
      return "cards";
    }
  );

  const handleModalState = (state: boolean) => {
    console.log("handleModalState", state);
    setModalState(state);
  };

  const handleViewModeChange = (mode: "cards" | "table" | "calendar") => {
    setViewMode(mode);
    localStorage.setItem("dashboard-view-mode", mode);
  };

  useEffect(() => {
    // set the user's current reminders
    setTimers(reminders);
    // Enable View Transitions API
    document.documentElement.classList.add("view-transition");
  }, []);

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

  const handleModal = () => {
    setIsOpen((prev) => !prev);
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

  // Table View Component
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
            {timers?.map((timer) => {
              const timeLeft = formatTimeDifference(
                timer.dueDate,
                timer.type,
                now
              );
              const isExpired = timer.isActive === false;

              return (
                <TableRow
                  key={timer.id}
                  className={isExpired ? "opacity-60" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          !timer.isActive
                            ? "bg-red-600"
                            : timer.type === "till"
                              ? "bg-green-500"
                              : "bg-zinc-500"
                        }`}
                      />
                      <Badge
                        variant={timer.isActive ? "default" : "destructive"}
                      >
                        {timer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    <Link
                      href={`/notifoos/${timer.id}`}
                      className={`hover:underline ${
                        !timer.isActive ? "line-through" : ""
                      }`}
                    >
                      {timer.name}
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
                      {timer.dueDate.toLocaleDateString(undefined, {
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
                      {timer.emailNotification && (
                        <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      {timer.smsNotification && (
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <MessageSquare className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {timer.callNotification && (
                        <div className="p-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <PhoneCallIcon className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                        </div>
                      )}
                      {timer.recurringNotification && (
                        <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <Repeat2Icon className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant={timer.isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleDeleteTimer(timer.id!)}
                      disabled={isLoading}
                      className={cn(
                        "text-red-600 hover:text-red-700 hover:bg-red-50",
                        timer.isActive &&
                          "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                      )}
                    >
                      {timer.isActive ? "Done" : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Custom Calendar Grid Component
  const CustomCalendarGrid = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<"month" | "day">("month");
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Get reminders for a specific date
    const getRemindersForDate = (date: Date) => {
      return timers.filter((timer) => {
        const timerDate = new Date(timer.dueDate);
        return (
          timerDate.getDate() === date.getDate() &&
          timerDate.getMonth() === date.getMonth() &&
          timerDate.getFullYear() === date.getFullYear()
        );
      });
    };

    // Get calendar grid for current month
    const getCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());

      const days = [];
      const currentDateObj = new Date(startDate);

      for (let i = 0; i < 42; i++) {
        // 6 weeks * 7 days
        days.push(new Date(currentDateObj));
        currentDateObj.setDate(currentDateObj.getDate() + 1);
      }

      return days;
    };

    const calendarDays = getCalendarDays();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const navigateMonth = (direction: number) => {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + direction,
          1
        )
      );
    };

    const isToday = (date: Date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
      return date.getMonth() === currentDate.getMonth();
    };

    const navigateDay = (direction: number) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + direction);
      setSelectedDate(newDate);
      setCurrentDate(newDate); // Keep month in sync
    };

    const handleDayClick = (date: Date) => {
      setSelectedDate(date);
      setCalendarView("day");
    };

    // Day View Component
    const DayView = () => {
      const dayReminders = getRemindersForDate(selectedDate);
      const { now } = useTime();

      return (
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="md:text-2xl hidden font-bold">
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCalendarView("month")}
                className="w-full"
              >
                Back to Month
              </Button>
            </div>

            {dayReminders.length > 0 ? (
              <div className="space-y-4">
                {dayReminders.map((timer) => {
                  const timeLeft = formatTimeDifference(
                    timer.dueDate,
                    timer.type,
                    now
                  );
                  const isExpired = timer.isActive === false;

                  return (
                    <div
                      key={timer.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        window.location.href = `/notifoos/${timer.id}`;
                      }}
                    >
                      <div className="flex flex-col  items-center justify-between">
                        <div className="w-full">
                          <h4 className="font-semibold text-lg">
                            {timer.name}
                          </h4>
                        </div>

                        {/* Right Side */}
                        <div className="w-full flex justify-between items-center mt-2">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                !timer.isActive
                                  ? "bg-red-600"
                                  : timer.type === "till"
                                    ? "bg-green-500"
                                    : "bg-zinc-500"
                              }`}
                            />

                            <div>
                              <p className="md:text-sm text-xs text-muted-foreground">
                                {timer.dueDate.toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {isExpired ? (
                                <Badge variant="destructive" className="mt-1">
                                  EXPIRED
                                </Badge>
                              ) : (
                                <div className="font-mono md:text-sm text-xs mt-1">
                                  {timeLeft.days > 0 && `${timeLeft.days}d `}
                                  {timeLeft.hours > 0 &&
                                    `${timeLeft.hours.toString().padStart(2, "0")}h `}
                                  {`${timeLeft.minutes.toString().padStart(2, "0")}m `}
                                  {`${timeLeft.seconds.toString().padStart(2, "0")}s`}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex md:flex-row flex-col items-center gap-3">
                            <Button
                              variant={timer.isActive ? "default" : "ghost"}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTimer(timer.id!);
                              }}
                              disabled={isLoading}
                              className={cn(
                                "text-red-600 hover:text-red-700 bg-red-500",
                                timer.isActive &&
                                  "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                              )}
                            >
                              {timer.isActive ? (
                                <CheckIcon color="white" className="h-4 w-4" />
                              ) : (
                                <TrashIcon className="h-4 w-4" color="white" />
                              )}
                            </Button>

                            <div className="flex items-center gap-2">
                              {timer.emailNotification && (
                                <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                              )}
                              {timer.smsNotification && (
                                <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                                  <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                              )}
                              {timer.callNotification && (
                                <div className="p-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                  <PhoneCallIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                              )}
                              {timer.recurringNotification && (
                                <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                  <Repeat2Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <GhostIcon className="h-10 w-10 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No reminders scheduled for this day.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-[calc(100vh-7rem)] p-4 md:p-8">
        <div className="w-full h-full flex flex-col">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  calendarView === "month" ? navigateMonth(-1) : navigateDay(-1)
                }
                className="p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h2 className="md:text-xl text-xs font-semibold">
                {calendarView === "month"
                  ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : selectedDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  calendarView === "month" ? navigateMonth(1) : navigateDay(1)
                }
                className="p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={calendarView === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setCalendarView("month")}
              >
                Month
              </Button>
              <Button
                variant={calendarView === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setCalendarView("day")}
              >
                Day
              </Button>
            </div>
          </div>

          {/* Calendar Content */}
          {calendarView === "day" ? (
            <DayView />
          ) : (
            <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50 border-b">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center font-medium text-gray-700 border-r last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div
                className="grid grid-cols-7"
                style={{ gridTemplateRows: "repeat(6, 1fr)" }}
              >
                {calendarDays.map((date, index) => {
                  const dayReminders = getRemindersForDate(date);
                  const isCurrentMonthDay = isCurrentMonth(date);
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "border-r border-b last-in-row:border-r-0 p-2 min-h-[120px] flex flex-col cursor-pointer hover:bg-gray-50 transition-colors",
                        !isCurrentMonthDay && "bg-gray-50 text-gray-400",
                        isTodayDate && "bg-blue-50 border-blue-200",
                        selectedDate.toDateString() === date.toDateString() &&
                          "ring-2 ring-blue-300"
                      )}
                      onClick={() => handleDayClick(date)}
                    >
                      {/* Day Number */}
                      <div
                        className={cn(
                          "text-sm font-medium mb-2",
                          isTodayDate && "text-blue-600 font-bold",
                          !isCurrentMonthDay && "text-gray-400"
                        )}
                      >
                        {date.getDate()}
                      </div>

                      {/* Reminders */}
                      <div className="flex-1 space-y-1 overflow-hidden">
                        {dayReminders.slice(0, 4).map((timer) => (
                          <div
                            key={timer.id}
                            className="text-xs px-2 py-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: !timer.isActive
                                ? "#dc2626"
                                : timer.type === "till"
                                  ? "#059669"
                                  : "#6b7280",
                            }}
                            title={`${timer.name} - ${timer.dueDate.toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to reminder detail or show popup
                              window.location.href = `/notifoos/${timer.id}`;
                            }}
                          >
                            {timer.name}
                          </div>
                        ))}
                        {dayReminders.length > 4 && (
                          <div className="text-xs text-gray-500 text-center font-medium">
                            +{dayReminders.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calendar View Component
  const CalendarViewComponent = () => {
    return <CustomCalendarGrid />;
  };

  const renderContent = () => {
    switch (viewMode) {
      case "table":
        return <TableViewComponent />;
      case "calendar":
        return <CalendarViewComponent />;
      case "cards":
      default:
        return (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 justify-items-start content-start p-4 md:p-8"
            layout
          >
            <AnimatePresence>
              {timers?.length > 0 &&
                timers?.map((timer) => (
                  <motion.div
                    key={timer.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Timer
                      {...timer}
                      onDelete={handleDeleteTimer}
                      id={timer.id?.toString() ?? ""}
                      isLoading={isLoading}
                      dueDate={timer.dueDate}
                      isOpen={isOpen}
                      isActive={true}
                      handleModal={handleModal}
                      emailNotification={timer.emailNotification}
                      smsNotification={timer.smsNotification}
                      callNotification={timer.callNotification}
                      recurringNotification={
                        timer.recurringNotification ?? false
                      }
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        );
    }
  };

  return (
    <TimeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-between items-center pr-4 h-28 w-full bg-white sticky top-0 z-50">
          <HeaderComponent
            title="Dashboard"
            description={`Welcome back, ${user?.name}`}
          />

          <div className="flex items-center gap-2">
            {/* View Toggle Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {viewMode === "cards" && <Grid3x3 className="h-4 w-4" />}
                  {viewMode === "table" && <List className="h-4 w-4" />}
                  {viewMode === "calendar" && <Calendar className="h-4 w-4" />}
                  <span className="hidden sm:inline capitalize">
                    {viewMode}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewModeChange("cards")}>
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  Cards
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewModeChange("table")}>
                  <List className="h-4 w-4 mr-2" />
                  Table
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleViewModeChange("calendar")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="default"
              className="hidden md:flex items-center gap-2"
              onClick={() => handleModalState(true)}
            >
              <PlusIcon />
              Add a Notifoo
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

        {renderContent()}

        {/* Move TimerCreationCard outside renderContent so the modal is always available */}
        <TimerCreationCard
          onCreateTimer={handleCreateTimer}
          handleModalState={handleModalState}
          modalState={modalState}
          error={error}
          isLoading={isLoading}
          user={user}
          hideCard={viewMode !== "cards"} // Add this prop to hide the card visual in non-cards view
        />
      </div>
    </TimeProvider>
  );
}
