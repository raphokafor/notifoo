"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "./Timer";
import { TimerCreationCard } from "./TimerCreationCard";
import { TimerData } from "@/types/database";
import { TimeProvider } from "@/contexts/TimeContext";
import { useRouter } from "next/navigation";
import { createReminder, deleteReminder } from "@/app/actions/reminders";
import { toast } from "sonner";

export function Dashboard({ reminders }: { reminders: TimerData[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState(false);
  const [timers, setTimers] = React.useState<TimerData[]>([]);

  const handleModalState = (state: boolean) => {
    setModalState(state);
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
        handleModalState(false);
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

  return (
    <TimeProvider>
      <div className="min-h-screen bg-background flex items-center justify-center py-20">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center content-center"
          layout
        >
          <AnimatePresence>
            {timers.map((timer) => (
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
                  isOpen={isOpen}
                  handleModal={handleModal}
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
          />
        </motion.div>
      </div>
    </TimeProvider>
  );
}
