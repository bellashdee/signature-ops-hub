"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/lib/auth-actions";
import { IconEye, IconEyeOff } from "@/components/icons";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="loginId" className="text-sm font-semibold text-ink">
          Username or email
        </label>
        <input
          id="loginId"
          name="loginId"
          type="text"
          autoComplete="username"
          autoFocus
          required
          className="mt-2 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold text-ink">
          Password
        </label>
        <div className="mt-2 flex items-center rounded-lg border border-line bg-paper-raised pr-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full bg-transparent px-3 py-2 text-sm text-ink outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="shrink-0 rounded-md p-1.5 text-ink-muted transition hover:text-ink"
          >
            {showPassword ? <IconEyeOff className="h-4.5 w-4.5" /> : <IconEye className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {state?.error && <p className="text-sm font-medium text-negative">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs text-ink-muted">
        Don&apos;t have an account? Ask your admin to add you — accounts aren&apos;t self-registered.
      </p>
    </form>
  );
}
