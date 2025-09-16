import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Clock,
  Loader2Icon,
  Mail,
  MessageSquare,
  RefreshCcwDotIcon,
  PhoneCallIcon,
} from "lucide-react";
import { TimerData } from "@/types/database";
import { FormError } from "@/components/form-error";
import { User } from "@prisma/client";
import Link from "next/link";
import { track } from "@vercel/analytics/react";

interface TimerCreationCardProps {
  onCreateTimer: (timer: Omit<TimerData, "id">) => void;
  handleModalState: (state: boolean) => void;
  modalState: boolean;
  user: User;
  error: string;
  isLoading: boolean;
  hideCard?: boolean; // Add this
}

export function TimerCreationCard({
  onCreateTimer,
  handleModalState,
  modalState,
  user,
  error,
  isLoading,
  hideCard = false, // Add this with default value
}: TimerCreationCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState({
    hours: 12,
    minutes: 0,
    period: "PM" as "AM" | "PM",
  });
  const [timerName, setTimerName] = useState("");
  const [emailNotification, setEmailNotification] = useState(true);
  const [smsNotification, setSmsNotification] = useState(false);
  const [callNotification, setCallNotification] = useState(false);
  const [recurringNotification, setRecurringNotification] = useState(false);
  const [step, setStep] = useState<"date" | "name" | "notifications">("date");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "name" && inputRef.current && modalState) {
      inputRef.current.focus();
    }
  }, [step, modalState]);

  const handleOpenChange = (open: boolean) => {
    handleModalState(open);
    if (!open) {
      // Reset state when modal closes
      setStep("date");
      setSelectedDate(undefined);
      setSelectedTime({ hours: 12, minutes: 0, period: "PM" });
      setTimerName("");
      setEmailNotification(true);
      setSmsNotification(false);
      setCallNotification(false);
      setRecurringNotification(false);
    }
  };

  const handleCancel = () => {
    handleModalState(false);
  };

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    const numValue = parseInt(value) || 0;
    if (type === "hours" && numValue >= 1 && numValue <= 12) {
      setSelectedTime((prev) => ({ ...prev, hours: numValue }));
    } else if (type === "minutes" && numValue >= 0 && numValue <= 59) {
      setSelectedTime((prev) => ({ ...prev, minutes: numValue }));
    }
  };

  const handlePeriodChange = (period: "AM" | "PM") => {
    setSelectedTime((prev) => ({ ...prev, period }));
  };

  const getCombinedDateTime = () => {
    if (!selectedDate) return undefined;
    const combined = new Date(selectedDate);

    // Convert 12-hour to 24-hour format
    let hours24 = selectedTime.hours;
    if (selectedTime.period === "AM" && selectedTime.hours === 12) {
      hours24 = 0; // 12 AM = 0 hours
    } else if (selectedTime.period === "PM" && selectedTime.hours !== 12) {
      hours24 = selectedTime.hours + 12; // PM hours (except 12 PM)
    }

    combined.setHours(hours24, selectedTime.minutes, 0, 0);
    return combined;
  };

  const handleConfirm = () => {
    const combinedDateTime = getCombinedDateTime();
    if (step === "date" && combinedDateTime) {
      setStep("name");
    } else if (step === "name" && timerName && combinedDateTime) {
      setStep("notifications");
    } else if (step === "notifications" && timerName && combinedDateTime) {
      const now = new Date();
      const timerType = combinedDateTime > now ? "till" : "from";
      track("Timer Created", {
        name: timerName,
        type: timerType,
        emailNotification,
        smsNotification,
        callNotification,
        recurringNotification,
        email: user.email,
      });
      onCreateTimer({
        name: timerName,
        dueDate: combinedDateTime,
        type: timerType,
        emailNotification,
        smsNotification,
        callNotification,
        recurringNotification,
      });
      clearState();
    }
  };

  const clearState = () => {
    // clear state for the form
    setSelectedDate(undefined);
    setSelectedTime({ hours: 12, minutes: 0, period: "PM" });
    setTimerName("");
    setEmailNotification(true);
    setSmsNotification(false);
    setCallNotification(false);
    setRecurringNotification(false);
    setStep("date");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && timerName && getCombinedDateTime()) {
      handleConfirm();
    }
  };

  const handleBack = () => {
    if (step === "name") {
      setStep("date");
    } else if (step === "notifications") {
      setStep("name");
    }
  };

  return (
    <>
      {/* Only show the card visual in cards view */}
      {!hideCard && (
        <Card
          className="w-[280px] h-[280px] rounded-3xl bg-transparent hover:bg-card/10 border border-dashed border-muted-foreground/30 hover:opacity-100 cursor-pointer transition-all duration-200"
          onClick={() => handleModalState(true)}
        >
          <CardContent className="p-4 h-full flex flex-col items-center justify-center">
            <Plus className="w-12 h-12 text-muted-foreground/50" />
          </CardContent>
        </Card>
      )}

      {/* Modal is always available */}
      <Dialog open={modalState} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center hidden">
              {step === "date"
                ? "Select Date & Time"
                : step === "name"
                  ? "Add Description"
                  : "Choose Notifications"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 min-h-[400px] sm:min-h-0">
            {step === "date" && (
              <>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date)}
                  className="rounded-md border w-full"
                />

                {/* Time Selection */}
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Select Time</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
                    <div className="flex flex-col items-center gap-1 flex-1 max-w-[70px]">
                      <Label htmlFor="hours" className="text-xs">
                        Hours
                      </Label>
                      <Input
                        id="hours"
                        type="number"
                        min="1"
                        max="12"
                        value={selectedTime.hours.toString()}
                        onChange={(e) =>
                          handleTimeChange("hours", e.target.value)
                        }
                        className="w-full text-center font-mono text-sm"
                      />
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground mt-6">
                      :
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1 max-w-[70px]">
                      <Label htmlFor="minutes" className="text-xs">
                        Minutes
                      </Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={selectedTime.minutes.toString().padStart(2, "0")}
                        onChange={(e) =>
                          handleTimeChange("minutes", e.target.value)
                        }
                        className="w-full text-center font-mono text-sm"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1 max-w-[70px]">
                      <Label className="text-xs">Period</Label>
                      <Select
                        value={selectedTime.period}
                        onValueChange={(value: "AM" | "PM") =>
                          handlePeriodChange(value)
                        }
                      >
                        <SelectTrigger className="w-full font-mono text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {selectedDate && (
                    <p className="text-xs text-center text-muted-foreground font-mono px-2 leading-relaxed">
                      {getCombinedDateTime()?.toLocaleString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  )}
                </div>

                <div className="flex justify-between w-full gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedDate}
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {step === "name" && (
              <>
                {getCombinedDateTime() && (
                  <p className="text-sm text-muted-foreground text-center mb-4 font-mono px-2 leading-relaxed">
                    {getCombinedDateTime()?.toLocaleString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                )}
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Reminder description"
                  value={timerName}
                  onChange={(e) => setTimerName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full font-mono"
                />
                <div className="flex justify-between w-full gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!timerName}
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {step === "notifications" && (
              <>
                {getCombinedDateTime() && (
                  <div className="text-center mb-4 px-2">
                    <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                      {getCombinedDateTime()?.toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-sm font-medium mt-1 p-2 rounded-sm bg-muted-foreground/10 break-words">
                      {timerName}
                    </p>
                  </div>
                )}

                <div className="w-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor="email-toggle"
                            className="font-medium block"
                          >
                            Email
                          </Label>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="email-toggle"
                        checked={emailNotification}
                        onCheckedChange={setEmailNotification}
                        className="flex-shrink-0 ml-2"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <PhoneCallIcon className="w-5 h-5 text-[#E2725B] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor="call-toggle"
                            className="font-medium block"
                          >
                            Call
                          </Label>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Receive notifications via phone call
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="call-toggle"
                        checked={callNotification}
                        onCheckedChange={setCallNotification}
                        disabled={!user.phone}
                        className="flex-shrink-0 ml-2"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MessageSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor="sms-toggle"
                            className="font-medium block"
                          >
                            SMS
                          </Label>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Receive notifications via text message
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="sms-toggle"
                        checked={smsNotification}
                        onCheckedChange={setSmsNotification}
                        disabled={!user.phone}
                        className="flex-shrink-0 ml-2"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <RefreshCcwDotIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor="recurring-toggle"
                            className="font-medium block"
                          >
                            Recurring
                          </Label>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Repeat this reminder every day after.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="recurring-toggle"
                        checked={recurringNotification}
                        onCheckedChange={setRecurringNotification}
                        disabled={!user.phone}
                        className="flex-shrink-0 ml-2"
                      />
                    </div>

                    {!user.phone && (
                      <p className="text-xs text-amber-600 text-center px-2 leading-relaxed">
                        Please add your phone number to your account in the{" "}
                        <Link href="/settings" className="text-blue-500">
                          Settings Page
                        </Link>{" "}
                        to receive SMS notifications.
                      </p>
                    )}
                  </div>

                  {!emailNotification &&
                    !smsNotification &&
                    !callNotification &&
                    !recurringNotification && (
                      <p className="text-xs text-amber-600 text-center px-2 leading-relaxed">
                        Please select at least one notification method
                      </p>
                    )}
                </div>

                <div className="flex justify-between w-full gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={
                      (!emailNotification &&
                        !smsNotification &&
                        !callNotification &&
                        !recurringNotification) ||
                      isLoading
                    }
                    className="flex-1"
                  >
                    <span className="hidden sm:inline">Create Reminder</span>
                    <span className="sm:hidden">Create</span>
                    {isLoading && (
                      <Loader2Icon className="w-4 h-4 animate-spin ml-2" />
                    )}
                  </Button>
                </div>

                <div className="w-full">
                  {error && (
                    <FormError message={error} className="my-2 w-full" />
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
