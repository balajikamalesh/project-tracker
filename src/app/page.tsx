"use client";

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-current";
import { uselogout } from "@/features/auth/api/use-logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const {data, isLoading} = useCurrent();
  const { mutate } = uselogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);

  return (
    <div>
      Only authenticated users can see this page.
      <Button onClick={() => mutate()}>
        Logout
      </Button>
    </div>
  );
}
