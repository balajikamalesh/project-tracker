"use client";

import { useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DescriptionAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  taskName?: string;
  projectName?: string;
  disabled?: boolean;
  rows?: number;
}

export const DescriptionAutocomplete = ({
  value = "",
  onChange,
  placeholder = "Enter task description",
  taskName = "",
  projectName = "",
  disabled = false,
  rows = 4,
}: DescriptionAutocompleteProps) => {
  const { complete, completion, isLoading } = useCompletion({
    api: "/api/ai/complete-description",
    streamProtocol: "text",
    onError: (error) => {
      console.error("Error generating description:", error);
    },
  });

  useEffect(() => {
    if (completion) {
      onChange(completion);
    }
  }, [completion, onChange]);

  const handleGenerate = async () => {
    if (!taskName.trim()) {
      return;
    }

    await complete("", {
      body: {
        taskName,
        projectName,
        currentDescription: value,
      },
    });
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={rows}
        className={cn(
          "resize-none",
          isLoading && "opacity-70"
        )}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={!taskName.trim() || disabled || isLoading}
        className={cn(
          "w-full sm:w-auto transition-all duration-300 relative overflow-hidden group",
          !isLoading && !disabled && taskName.trim() && [
            "hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-400",
            "hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50",
            "dark:hover:from-purple-950/30 dark:hover:to-blue-950/30",
            "hover:text-purple-700 dark:hover:text-purple-300"
          ],
          isLoading && [
            "animate-pulse bg-gradient-to-r from-purple-100 to-blue-100",
            "dark:from-purple-900/20 dark:to-blue-900/20",
            "border-purple-300 dark:border-purple-700"
          ]
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Generating...
            </span>
          </>
        ) : (
          <>
            <Sparkles className={cn(
              "mr-2 h-4 w-4 transition-all duration-300 text-purple-500 dark:text-purple-400",
              !disabled && taskName.trim() && "group-hover:rotate-12 group-hover:text-purple-600 dark:group-hover:text-purple-300"
            )} />
            <span className="group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              AI Generate Description
            </span>
          </>
        )}
      </Button>
    </div>
  );
};
