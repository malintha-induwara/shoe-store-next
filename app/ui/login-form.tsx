"use client";

import { CircleAlert, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { authenticate } from "../lib/auth/action";
import Link from "next/link";

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-16 bg-white py-8 md:py-0">
        <div className="max-w-md w-full mx-auto">
          <Image className="h-12 mx-auto mb-6" src="/logo.png" alt="logo" width={240} height={48} />
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          <form action={formAction} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-2.5 md:py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-2.5 md:py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 md:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-disabled={isPending}
            >
              Sign in
            </button>
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
              {errorMessage && (
                <>
                  <CircleAlert className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Dont have an account?
              <Link className="font-medium text-blue-600 hover:text-blue-500 ml-1" href="/signup"> Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="w-full  md:w-1/2 h-48 md:h-auto bg-blue-50">
        <div className="h-full relative">
          <Image src="/login.jpg" alt="Luxury Shoes" fill className="object-cover object-center" priority />
        </div>
      </div>
    </div>
  );
}
