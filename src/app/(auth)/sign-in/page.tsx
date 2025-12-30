import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { SignIncard } from "@/features/auth/components/sign-in-card";

const SignIn = async () => {
  const user = await getCurrent();

  if (user) redirect("/");

  return <SignIncard />;
};

export default SignIn;
