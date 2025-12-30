"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "../schema";
import { useRegister } from "../api/use-register";

// Extend the schema to include confirmPassword and match check
const signUpWithConfirmSchema = signUpSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpWithConfirmSchema>;

export const SignUpCard = () => {
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpWithConfirmSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    // Only send name, email, password to API
    const { name, email, password } = data;
    mutate({ json: { name, email, password } });
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-md">
      <CardHeader className="flex items-center justify-center text-center px-7 py-6">
        <CardTitle className="text-2xl">Sign up to Trackly</CardTitle>
        <CardDescription>
          By Signing up, you agree to our terms and conditions.
          <Link href="/privacy">
            <span className="text-blue-700">Terms and Conditions</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7 py-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              {...register("name")}
              required
              type="text"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              required
              type="email"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Input
              {...register("password")}
              required
              type="password"
              placeholder="Enter password"
              min={8}
              max={16}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Input
              {...register("confirmPassword")}
              required
              type="password"
              placeholder="Confirm password"
              min={8}
              max={16}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            disabled={isPending}
          >
            Sign Up
          </Button>
        </form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7 py-6 flex flex-col gap-y-4">
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Sign in with Google
        </Button>
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Sign in with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
