"use client";

import { Loader } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-4">
        <Loader className="size-6 animate-spin"/>
    </div>
  );
};

export default ErrorPage;
