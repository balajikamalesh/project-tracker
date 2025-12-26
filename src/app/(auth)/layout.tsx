"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathName = usePathname();
  const isSignInPage = pathName === "/sign-in";

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" height={50} width={120} alt="Logo" />
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href={isSignInPage ? "/sign-up" : "/sign-in"}>
                {isSignInPage ? "Sign Up" : "Sign In"}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center pt-4 md:pt-10">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
