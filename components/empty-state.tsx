"use client";

import { useRouter } from "next/navigation";
import Heading from "./heading";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  label?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  subtitle = "Try adjusting your search or filter to find what you're looking for.",
  showReset = false,
  label = "Remove all filters",
}) => {
  const router = useRouter();

  const reset = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 my-4">
        {showReset && (
          <Button onClick={() => reset()} variant="outline" className="w-full">
            {label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
