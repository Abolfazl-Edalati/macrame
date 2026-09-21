"use client";

import { useActionState } from "react";
import { login } from "@/lib/admin-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type LoginState = { error?: string };

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    async (_prev, formData) => login(formData),
    {},
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
        {pending ? "..." : "ورود"}
      </Button>
    </form>
  );
}
