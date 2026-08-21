"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthActionResult } from "@/app/actions/auth";
import { Input } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";

const initialState: AuthActionResult = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <>
      <h1 className="font-display text-2xl text-text-primary">Start creating</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Free to join. Bring your first project idea.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <Field label="Name" name="displayName" error={state.fieldErrors?.displayName}>
          <Input
            id="displayName"
            name="displayName"
            autoComplete="name"
            defaultValue={state.values?.displayName}
            invalid={!!state.fieldErrors?.displayName}
          />
        </Field>
        <Field label="Username" name="username" error={state.fieldErrors?.username}>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            defaultValue={state.values?.username}
            invalid={!!state.fieldErrors?.username}
          />
        </Field>
        <Field label="Email" name="email" error={state.fieldErrors?.email}>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={state.values?.email}
            invalid={!!state.fieldErrors?.email}
          />
        </Field>
        <Field label="Password" name="password" error={state.fieldErrors?.password}>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            invalid={!!state.fieldErrors?.password}
          />
        </Field>

        {state.error && (
          <p role="alert" className="text-sm text-danger-fg">
            {state.error}
          </p>
        )}

        <Button type="submit" loading={pending} className="mt-2">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}
