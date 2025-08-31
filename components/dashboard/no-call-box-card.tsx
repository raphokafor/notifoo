"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GhostIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { callBoxSchema } from "@/schemas";
import { CallBox } from "@prisma/client";
import { createCallBox } from "@/app/actions/callBox-action";
import { FormError } from "../form-error";
import { useRouter } from "next/navigation";

type CallBoxFormValues = z.infer<typeof callBoxSchema>;

export function NoCallBoxCard() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<CallBoxFormValues>({
    resolver: zodResolver(callBoxSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      buzzCode: "",
      isAutoOpen: false,
    },
  });

  const handleCreateCallBox = async (values: CallBoxFormValues) => {
    setIsCreating(true);
    try {
      // create call box using the server action
      const { success, data, error } = await createCallBox(values as CallBox);
      if (success) {
        console.log("Call box created:", data);
        // Only reset form and close dialog on success
        form.reset();
        router.refresh();
        setIsDialogOpen(false);
      } else {
        console.error("Error creating call box:", error);
        setError(error ?? "Failed to create call box");
        // Dialog stays open on error - no reset or close
      }
    } catch (error: any) {
      console.error("Error creating call box:", error);
      setError(error ?? "Failed to create call box");
      // Dialog stays open on error
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur mx-5">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <GhostIcon className="w-12 h-12 text-slate-600" />
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Expand your property coverage with additional call boxes
            </p>
          </div>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button className="w-[300px] rounded-sm bg-slate-900 hover:bg-slate-800 text-white">
                Add Call Box
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Call Box</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter the details for your new call box. All fields are
                  required.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateCallBox)}
                  className="grid gap-4 py-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter call box name"
                            disabled={isCreating}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter address"
                            disabled={isCreating}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            disabled={isCreating}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buzzCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buzz Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter buzz-in number"
                            disabled={isCreating}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAutoOpen"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isCreating}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable auto-open on call</FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Automatically open the gate when this call box
                            receives a call
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {error && <FormError message={error} className="mt-2" />}

                  <AlertDialogFooter className="flex gap-2 mt-4">
                    <AlertDialogCancel disabled={isCreating} className="flex-1">
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 flex-1"
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : "Create Call Box"}
                    </Button>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
