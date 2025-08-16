"use client";

import { GalleryVerticalEnd } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white">
        <CardHeader className="flex flex-col items-center gap-2">
          {/* Logo + Branding */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white flex size-10 items-center justify-center rounded-lg shadow-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="font-semibold text-lg text-blue-700">Fantastic Rental</span>
          </div>

          {/* Title + Subtitle */}
          <CardTitle className="text-2xl font-bold text-gray-900 mt-3">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Join us and start your journey today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignupForm />

          {/* Links */}
          <div className="flex flex-col gap-2 mt-6 text-center text-sm">
            <p className="text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
