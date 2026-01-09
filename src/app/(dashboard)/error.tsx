"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-4">
      <AlertTriangle className="size-5 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Something went wrong!</h1>
        <p className="text-sm text-muted-foreground">
          We apologize for the inconvenience. Please try again.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <Link href="/">
          <Button size="sm">Go back home</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
