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
import { PlusIcon } from "lucide-react";

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

  const handleModal = () => {
    setIsOpen((prev) => !prev);
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

  return (
    <TimeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-between items-center pr-4 h-28 w-full bg-white sticky top-0 z-50">
          <HeaderComponent
            title="Reminders"
            description="Create, edit, and delete your reminders"
          />

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
      </div>
    </TimeProvider>
  );
};

export default RemindersClient;
