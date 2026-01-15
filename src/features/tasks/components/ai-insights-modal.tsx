"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import useProjectId from "@/features/projects/hooks/use-project-id";
import FormattedMessage from "./formatted-message";

interface AIInsightsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const AIInsightsModal = ({ isOpen, onOpenChange }: AIInsightsModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  
  const { complete, completion, isLoading, setCompletion } = useCompletion({
    api: "/api/ai/insights",
    streamProtocol: "text",
    onError: (error) => {
      console.error("Error generating insights:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
    onFinish: (prompt, completion) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: completion,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setCompletion("");
    },
  });

  // Auto-scroll to bottom when new messages arrive or completion updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, completion, isLoading]);

  // Reset messages when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInput("");
    } else {
      // Add welcome message when modal opens
      const welcomeMessage = projectId 
        ? "👋 Hi! I'm here to help you with insights about this project and its tasks. What would you like to know?"
        : "👋 Hi! I'm here to help you with insights about your workspace and all its tasks. What would you like to know?";
      
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, projectId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    await complete("", {
      body: {
        workspaceId,
        projectId,
        message: currentInput,
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="size-5 text-violet-500" />
            AI Insights {projectId ? "- Project" : "- Workspace"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-violet-500 text-white"
                      : "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm">
                      <FormattedMessage content={message.content} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && completion && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 rounded-lg px-4 py-3 max-w-[80%]">
                  <div className="text-sm">
                    <FormattedMessage content={completion} />
                  </div>
                </div>
              </div>
            )}
            {isLoading && !completion && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 text-neutral-900 rounded-lg px-4 py-2">
                  <Loader className="size-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="px-6 pb-6 pt-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your tasks and projects..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-violet-500 hover:bg-violet-600 w-[48px] h-[48px]"
            >
              <Send className="size-12" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {projectId 
              ? "Try asking: \"Project summary\", \"What tasks are in progress?\", \"Show overdue tasks\""
              : "Try asking: \"Workspace overview\", \"Show all tasks by status\", \"What's the overall progress?\""
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
