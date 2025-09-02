"use client";

import { TimerData } from "@/types/database";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reminderUpdateSchema } from "@/schemas";
import {
  updateReminder,
  deleteReminder,
  toggleReminderStatus,
} from "@/app/actions/reminders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  MailIcon,
  MessageSquareIcon,
  Trash2Icon,
  EditIcon,
  Loader2Icon,
  PowerIcon,
  PowerOffIcon,
} from "lucide-react";
import { format } from "date-fns";
import { FormError } from "@/components/form-error";

type FormValues = z.infer<typeof reminderUpdateSchema>;

const ReminderDetailClient = ({ reminder }: { reminder: TimerData }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(reminderUpdateSchema),
    defaultValues: {
      name: reminder?.name || "",
      description: reminder?.description || "",
      emailNotification: reminder?.emailNotification ?? true,
      smsNotification: reminder?.smsNotification ?? false,
      isActive: reminder?.isActive ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!reminder?.id) return;

    setIsUpdating(true);
    setError("");

    try {
      const result = await updateReminder({
        ...reminder,
        ...values,
      });

      if (result.success) {
        toast.success("Reminder updated successfully!");
        setIsEditing(false);
        router.refresh();
      } else {
        setError(result.message || "Failed to update reminder");
        toast.error(result.message || "Failed to update reminder");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!reminder?.id) return;

    setIsTogglingStatus(true);
    setError("");

    try {
      const newStatus = !reminder.isActive;
      const result = await toggleReminderStatus(reminder.id, newStatus);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        setError(result.message || "Failed to update reminder status");
        toast.error(result.message || "Failed to update reminder status");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!reminder?.id) return;

    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteReminder(reminder.id);

      if (result.success) {
        toast.success("Reminder deleted successfully!");
        router.push("/reminders");
      } else {
        setError(result.message || "Failed to delete reminder");
        toast.error(result.message || "Failed to delete reminder");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      name: reminder?.name || "",
      description: reminder?.description || "",
      emailNotification: reminder?.emailNotification ?? true,
      smsNotification: reminder?.smsNotification ?? false,
      isActive: reminder?.isActive ?? true,
    });
    setIsEditing(false);
    setError("");
  };

  if (!reminder) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Reminder not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPastDue = reminder.dueDate && new Date(reminder.dueDate) < new Date();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reminder Details
          </h1>
          <p className="text-muted-foreground">
            View and manage your reminder settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button
                variant={reminder.isActive ? "outline" : "default"}
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                className={`flex items-center gap-2 ${reminder.isActive ? "text-red-500" : "text-green-500"}`}
              >
                {reminder.isActive ? (
                  <PowerIcon className="h-4 w-4" color="red" />
                ) : (
                  <PowerIcon className="h-4 w-4" color="green" />
                )}
                {isTogglingStatus
                  ? "Updating..."
                  : reminder.isActive
                    ? "Disable"
                    : "Enable"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <EditIcon className="h-4 w-4" />
                Edit
              </Button>
            </>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this reminder? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}{" "}
                  {isDeleting && (
                    <Loader2Icon className="w-4 h-4 animate-spin ml-2" />
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Reminder Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {isEditing ? "Edit Reminder" : reminder.name}
                  {!reminder.isActive && !isEditing && (
                    <Badge variant="secondary">Disabled</Badge>
                  )}
                  {isPastDue && !isEditing && (
                    <Badge variant="destructive">Past Due</Badge>
                  )}
                </CardTitle>
                {!isEditing && (
                  <CardDescription>
                    {reminder.description || "No description provided"}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reminder name"
                            {...field}
                            disabled={isUpdating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter reminder description (optional)"
                            className="resize-none"
                            rows={3}
                            {...field}
                            disabled={isUpdating}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide additional details about this reminder
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel className="text-base font-semibold text-zinc-700">
                      Reminder Settings
                    </FormLabel>

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <PowerIcon className="h-4 w-4 text-muted-foreground" />
                              <FormLabel className="text-base text-zinc-500">
                                Enable Reminder
                              </FormLabel>
                            </div>
                            <FormDescription>
                              When disabled, this reminder will not send
                              notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isUpdating}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <MailIcon className="h-4 w-4 text-muted-foreground" />
                              <FormLabel className="text-base text-zinc-500">
                                Email Notifications
                              </FormLabel>
                            </div>
                            <FormDescription>
                              Receive reminder notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isUpdating}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smsNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                              <FormLabel className="text-base text-zinc-500">
                                SMS Notifications
                              </FormLabel>
                            </div>
                            <FormDescription>
                              Receive reminder notifications via SMS
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isUpdating}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {error && <FormError message={error} />}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? "Updating..." : "Update Reminder"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid gap-6">
                {/* Reminder Schedule */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      Due Date
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reminder.dueDate
                        ? format(new Date(reminder.dueDate), "PPP")
                        : "No due date set"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      Due Time
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reminder.dueDate
                        ? format(new Date(reminder.dueDate), "p")
                        : "No time set"}
                    </p>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium">
                    Notification Channels
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Email Notifications
                        </span>
                      </div>
                      <Badge
                        variant={
                          reminder.emailNotification ? "default" : "secondary"
                        }
                      >
                        {reminder.emailNotification ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          SMS Notifications
                        </span>
                      </div>
                      <Badge
                        variant={
                          reminder.smsNotification ? "default" : "secondary"
                        }
                      >
                        {reminder.smsNotification ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reminder Status Card */}
        {!isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Reminder Status</CardTitle>
              <CardDescription>
                Current status and information about this reminder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      !reminder.isActive
                        ? "secondary"
                        : isPastDue
                          ? "destructive"
                          : "default"
                    }
                    className="w-fit"
                  >
                    {!reminder.isActive
                      ? "Disabled"
                      : isPastDue
                        ? "Past Due"
                        : "Active"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Type</p>
                  <Badge variant="outline" className="w-fit">
                    {reminder.type === "till" ? "Countdown" : "Count Up"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Reminder ID</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {reminder.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReminderDetailClient;
