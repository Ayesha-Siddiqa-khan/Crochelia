"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthActionResult } from "@/app/actions/auth";
import { Input } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";

const initialState: AuthActionResult = {};

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <>
      <h1 className="font-display text-2xl text-text-primary">Welcome back</h1>
      <p className="mt-1 text-sm text-text-secondary">Continue your crochet journey.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-text-primary">
            Email
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            invalid={!!state.fieldErrors?.email}
          />
          {state.fieldErrors?.email && (
            <p role="alert" className="text-xs text-danger-fg">
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-text-primary">
            Password
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            invalid={!!state.fieldErrors?.password}
          />
          {state.fieldErrors?.password && (
            <p role="alert" className="text-xs text-danger-fg">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-danger-fg">
            {state.error}
          </p>
        )}

        <Button type="submit" loading={pending} className="mt-2">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        New to Crochelia?{" "}
        <Link href="/sign-up" className="font-medium text-text-brand hover:underline">
          Start creating
        </Link>
      </p>
    </>
  );
}
