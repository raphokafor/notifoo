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
  toggleEmailNotification,
  toggleSmsNotification,
  toggleCallNotification,
  toggleRecurringNotification,
  toggleReminderIsActive,
} from "@/app/actions/reminder-actions";
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
  PhoneCallIcon,
  RepeatIcon,
  CheckCheck,
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
      callNotification: reminder?.callNotification ?? false,
      recurringNotification: reminder?.recurringNotification ?? false,
      isActive: reminder?.isActive ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!reminder?.id) return;

    setIsUpdating(true);
    setError("");

    try {
      // const result = await updateReminder({
      //   ...reminder,
      //   ...values,
      // });

      console.log("line 97, values", values);
      console.log("line 97, reminder", reminder);

      // if (result.success) {
      //   toast.success("Reminder updated successfully!");
      //   setIsEditing(false);
      //   router.refresh();
      // } else {
      //   setError(result.message || "Failed to update reminder");
      //   toast.error(result.message || "Failed to update reminder");
      // }
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
      callNotification: reminder?.callNotification ?? false,
      recurringNotification: reminder?.recurringNotification ?? false,
      isActive: reminder?.isActive ?? true,
    });
    setIsEditing(false);
    setError("");
  };

  const handleEmailToggle = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setError("");
      form.setValue("emailNotification", value);
      // update the reminder in the database
      const { success, message } = await toggleEmailNotification({
        reminderId: reminder.id as string,
        isActive: value,
      });
      if (success) {
        toast.success(message);
      } else {
        form.setValue("emailNotification", !value);
        toast.error(message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      form.setValue("emailNotification", !value);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSmsToggle = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setError("");
      form.setValue("smsNotification", value);
      // update the reminder in the database
      const { success, message } = await toggleSmsNotification({
        reminderId: reminder.id as string,
        isActive: value,
      });
      if (success) {
        toast.success(message);
      } else {
        form.setValue("smsNotification", !value);
        toast.error(message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      form.setValue("smsNotification", !value);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCallToggle = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setError("");
      form.setValue("callNotification", value);
      // update the reminder in the database
      const { success, message } = await toggleCallNotification({
        reminderId: reminder.id as string,
        isActive: value,
      });
      if (success) {
        toast.success(message);
      } else {
        form.setValue("callNotification", !value);
        toast.error(message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      form.setValue("callNotification", !value);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRecurringToggle = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setError("");
      form.setValue("recurringNotification", value);
      // update the reminder in the database
      const { success, message } = await toggleRecurringNotification({
        reminderId: reminder.id as string,
        isActive: value,
      });
      if (success) {
        toast.success(message);
      } else {
        form.setValue("recurringNotification", !value);
        toast.error(message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      form.setValue("recurringNotification", !value);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIsActiveToggle = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setError("");
      const { success, message } = await toggleReminderIsActive({
        reminderId: reminder.id as string,
        isActive: value,
      });
      if (success) {
        toast.success(message);
      } else {
        form.setValue("isActive", !value);
        toast.error(message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
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
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reminder Details
          </h1>
          <p className="text-muted-foreground">
            View and manage your reminder settings
          </p>
        </div>
        <div className="flex mt-4 md:mt-0 items-center gap-1 px-4 mx-4">
          {reminder.isActive && (
            <Button
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className={`flex items-center gap-2 text-white bg-green-500 hover:bg-green-400`}
            >
              <CheckCheck />
              Done
            </Button>
          )}
          {!isEditing && reminder.isActive && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <EditIcon className="h-4 w-4" />
              Edit
            </Button>
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
                            disabled={isUpdating || !reminder.isActive}
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
                        <FormLabel>Reminder Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter reminder notes for yourself"
                            {...field}
                            disabled={isUpdating || !reminder.isActive}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel className="text-base font-semibold text-zinc-700">
                      Reminder Settings
                    </FormLabel>

                    {reminder.isActive && isEditing && (
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
                                onCheckedChange={handleIsActiveToggle}
                                disabled={isUpdating || !reminder.isActive}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}

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
                              onCheckedChange={handleEmailToggle}
                              disabled={isUpdating || !reminder.isActive}
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
                              onCheckedChange={handleSmsToggle}
                              disabled={isUpdating || !reminder.isActive}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="callNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <PhoneCallIcon className="h-4 w-4 text-muted-foreground" />
                              <FormLabel className="text-base text-zinc-500">
                                Call Notifications
                              </FormLabel>
                            </div>
                            <FormDescription>
                              Receive reminder notifications via phone call
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value as boolean}
                              onCheckedChange={handleCallToggle}
                              disabled={isUpdating || !reminder.isActive}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recurringNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <RepeatIcon className="h-4 w-4 text-muted-foreground" />
                              <FormLabel className="text-base text-zinc-500">
                                Recurring Notifications
                              </FormLabel>
                            </div>
                            <FormDescription>
                              Receive reminder notifications on a recurring
                              basis
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value as boolean}
                              onCheckedChange={handleRecurringToggle}
                              disabled={isUpdating || !reminder.isActive}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {error && <FormError message={error} />}

                  <div className="flex gap-3 pt-4">
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
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <PhoneCallIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Call Notifications
                        </span>
                      </div>
                      <Badge
                        variant={
                          reminder.callNotification ? "default" : "secondary"
                        }
                      >
                        {reminder.callNotification ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <RepeatIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Recurring Notifications
                        </span>
                      </div>
                      <Badge
                        variant={
                          reminder.recurringNotification
                            ? "default"
                            : "secondary"
                        }
                      >
                        {reminder.recurringNotification
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReminderDetailClient;
