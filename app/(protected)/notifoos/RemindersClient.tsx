"use client";

import HeaderComponent from "@/components/header";
import { TimerData } from "@/types/database";
import React, { useState } from "react";
import { Timer } from "../dashboard/Timer";
import { useRouter } from "next/navigation";
import {
  createReminder,
  deleteReminder,
  markReminderAsDone,
  toggleReminderStatus,
} from "@/app/actions/reminder-actions";
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
  ChevronLeft,
  ChevronRight,
  GhostIcon,
  TrashIcon,
  CheckIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trackEvent } from "@/lib/analytics";

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
  const [viewMode, setViewMode] = useState<"cards" | "table" | "calendar">(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("reminders-view-mode");
        return (saved as "cards" | "table" | "calendar") || "cards";
      }
      return "cards";
    }
  );

  const handleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleViewModeChange = (mode: "cards" | "table" | "calendar") => {
    trackEvent("dashboard_view_changed", {
      email: user.email,
      viewMode: mode,
      location: "notifoos",
    });
    setViewMode(mode);
    localStorage.setItem("reminders-view-mode", mode);
  };

  const handleModalState = (state: boolean) => {
    setModalState(state);
  };

  const handleDoneTimer = async (id: string) => {
    try {
      setIsLoading(true);
      trackEvent("reminder_done", {
        email: user.email,
        viewMode: viewMode,
        location: "notifoos",
        reminderId: id,
      });
      const { success, message } = await markReminderAsDone(id, true);
      if (success) {
        toast.success(message);

        setTimers((prevTimers) => {
          const updatedTimers = prevTimers.filter((timer) => timer.id !== id);
          localStorage.setItem("timers", JSON.stringify(updatedTimers));
          return updatedTimers;
        });

        router.refresh();
        // handleModal();
      } else {
        toast.error(message);
        setError(message);
      }
    } catch (error) {
      toast.error("Error deleting timer");
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
      trackEvent("reminder_created", {
        email: user.email,
        viewMode: viewMode,
        location: "notifoos",
        reminderId: newTimer.id,
        notificationMethods: [
          newTimer.emailNotification ? "email" : "",
          newTimer.smsNotification ? "sms" : "",
          newTimer.callNotification ? "call" : "",
          newTimer.recurringNotification ? "recurring" : "",
        ],
      });
      const { success, message } = await createReminder(newTimer);
      if (success) {
        setTimers((prevTimers) => {
          const updatedTimers = [...prevTimers, newTimer];
          return updatedTimers;
        });

        toast.success(message);

        router.refresh();
        handleModalState(false);
      } else {
        toast.error(message);
        setError(message);
      }
    } catch (error) {
      toast.error("Error creating timer");
      console.error("Error creating timer:", error);
      setError("Error creating timer");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // set the user's current reminders
    setTimers(reminders);
  }, [reminders]);

  // Custom Calendar Grid Component
  const CustomCalendarGrid = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<"month" | "day">("month");
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Get reminders for a specific date
    const getRemindersForDate = (date: Date) => {
      return reminders.filter((timer) => {
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
                <ChevronLeft className="h-4 w-4" />
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
                  const isExpired =
                    timer.isActive === false || timeLeft.total <= 0;

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
                          <h4
                            className={`${timer.isDone ? "line-through" : isExpired ? "text-zinc-400" : ""} font-semibold text-lg`}
                          >
                            {timer.name}
                          </h4>
                        </div>

                        {/* Right Side */}
                        <div className="w-full flex justify-between items-center mt-2">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                timer.isActive && !isExpired && !timer.isDone
                                  ? "bg-green-500"
                                  : !timer.isActive && timer.isDone
                                    ? "bg-red-600"
                                    : !timer.isActive && !timer.isDone
                                      ? "bg-red-600"
                                      : "bg-zinc-300"
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
                                <Badge className="bg-zinc-300 text-white">
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
                                handleDoneTimer(timer.id!);
                              }}
                              disabled={isLoading}
                              className={cn(
                                "text-green-600 hover:text-green-700 bg-green-500",
                                !timer.isActive &&
                                  "bg-red-500 text-white hover:bg-red-600 hover:text-white"
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
                            className="text-xs px-2 py-1 rounded text-white truncate cursor-pointer transition-opacity"
                            style={{
                              backgroundColor: !timer.isActive
                                ? "#a1a1aa"
                                : !timer.isDone
                                  ? "#a1a1aa"
                                  : "#059669",
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

  const renderStatusColor = (reminder: TimerData, isExpired: boolean) => {
    // if the reminder is active and not expired and not done, return green
    if (reminder.isActive && !isExpired && !reminder.isDone)
      return "bg-green-500";

    // if the reminder is not expired and not done, return green
    if (!reminder.isDone && !reminder.isActive && !isExpired)
      return "bg-zinc-300";

    // if the reminder is not done and not active, return red
    if (!reminder.isDone && !reminder.isActive) return "bg-zinc-300";

    // if the reminder is done, return red
    if (reminder.isDone) return "bg-red-600";

    // if the reminder is expired, return red
    if (isExpired) return "bg-red-600";

    // if the reminder is active, return green
    return "bg-zinc-500";
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
              const isExpired =
                reminder.isActive === false || timeLeft.total <= 0;

              return (
                <TableRow
                  key={reminder.id}
                  className={isExpired ? "opacity-60" : ""}
                >
                  <TableCell align="center" className="pl-8">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          reminder.isActive && !isExpired && !reminder.isDone
                            ? "bg-green-500"
                            : !reminder.isActive && reminder.isDone
                              ? "bg-red-600"
                              : !reminder.isActive && !reminder.isDone
                                ? "bg-red-600"
                                : "bg-zinc-400"
                        }`}
                      />
                      {/* <Badge
                        variant={
                          reminder.isActive || !isExpired
                            ? "default"
                            : "destructive"
                        }
                      >
                        {reminder?.isDone
                          ? "Done"
                          : reminder.isActive && !isExpired
                            ? "Not Done"
                            : reminder.isActive
                              ? "Active"
                              : "Inactive"}
                      </Badge> */}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    <Link
                      href={`/notifoos/${reminder.id}`}
                      className={`hover:underline ${
                        reminder.isDone ? "line-through" : ""
                      }`}
                    >
                      {reminder.name}
                    </Link>
                  </TableCell>

                  <TableCell className="pl-8">
                    {isExpired ? (
                      <Badge className="bg-zinc-300 text-white">EXPIRED</Badge>
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
                      onClick={() => handleDoneTimer(reminder.id!)}
                      disabled={isLoading || reminder.isDone}
                      className={`${!reminder.isDone ? "bg-green-500 hover:bg-green-400" : "bg-zinc-400 hover:text-white hover:bg-zinc-400"}`}
                    >
                      {!reminder.isDone ? "Done?" : "Done!"}
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
              {reminders?.length > 0 &&
                reminders?.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Timer
                      id={reminder.id!}
                      name={reminder.name}
                      dueDate={reminder.dueDate}
                      type={reminder.type}
                      isActive={reminder.isActive}
                      onDelete={handleDoneTimer}
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
          </motion.div>
        );
    }
  };

  return (
    <TimeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-between items-center pr-4 h-28 w-full bg-white sticky top-0 z-50">
          <HeaderComponent
            title="Notifoos"
            description="Create, edit, and delete your notifoos"
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
              onClick={() => {
                trackEvent("timer_created", {
                  email: user.email,
                  viewMode: viewMode,
                  location: "notifoos",
                });
                handleModalState(true);
              }}
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
};

export default RemindersClient;
