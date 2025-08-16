"use client";

import { GalleryVerticalEnd } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
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
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />

          {/* Links */}
          <div className="flex flex-col gap-2 mt-6 text-center text-sm">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Forgot your password?
            </a>
            <p className="text-gray-500">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
