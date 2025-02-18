"use client";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { CreateUserState } from "../lib/types";
import { register } from "../lib/auth/action";
import Link from "next/link";

export default function SignUp() {
  const initialState = { message: null, errors: {} };
  const [isPending, setIsPending] = useState(false);
  const [errorState, setErrorState] = useState<CreateUserState>(initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setErrorState({
        message: "Passwords do not match",
        errors: { confirmPassword: ["Passwords do not match"] },
      });
      return;
    }

    setIsPending(true);

    const response = await register(formData);

    if (response.success) {
      setErrorState(initialState);
      setIsPending(false);
      formRef.current.reset();
    } else {
      setErrorState({
        message: response.message,
        errors: response.errors,
      });
    }
  };

  return (
    <div className="min-h-screen  flex flex-col-reverse md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-16 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Image className="h-12 mx-auto mb-6" src="/logo.png" alt="logo" width={240} height={48} />
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">Join us for exclusive shoe collections and offers</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john.doe@example.com"
                />
              </div>
              {errorState?.errors?.email && <p className="mt-1 text-sm text-red-600">{errorState.errors.email[0]}</p>}
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
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
              {errorState?.errors?.password && <p className="mt-1 text-sm text-red-600">{errorState.errors.password[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Retype Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Retype password"
                />
              </div>
              {errorState?.errors?.confirmPassword && <p className="mt-1 text-sm text-red-600">{errorState.errors.confirmPassword[0]}</p>}
            </div>

            <button
              type="submit"
              aria-disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Account
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?
              <Link className="font-medium text-blue-600 hover:text-blue-500 ml-1" href="/">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="w-1/2  md:w-1/2 h-48 md:h-auto bg-blue-50">
        <div className="h-full relative">
          <Image src="/login.jpg" alt="Luxury Shoes" fill className="object-cover object-center" priority />
        </div>
      </div>
    </div>
  );
}
