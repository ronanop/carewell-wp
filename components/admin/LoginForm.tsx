"use client";

import { useActionState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  loginAction,
  type LoginState,
} from "@/lib/experience/actions/authActions";
import { cn } from "@/lib/utils";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-small font-medium text-foreground"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body text-foreground outline-none ring-ring placeholder:text-muted-foreground focus-visible:ring-2"
          placeholder="you@carewellmedicalcentre.com"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-small font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body text-foreground outline-none ring-ring placeholder:text-muted-foreground focus-visible:ring-2"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p className="text-small text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          buttonVariants({ size: "lg" }),
          "w-full no-underline hover:no-underline",
        )}
      >
        {pending ? "Signing in…" : "Sign in to Studio"}
      </button>
    </form>
  );
}
