"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useTransition } from "react";

type ActionFormProps = {
  action: (formData: FormData) => Promise<unknown>;
  children: ReactNode;
  className?: string;
  onSuccess?: () => void;
};

export function ActionForm({ action, children, className, onSuccess }: ActionFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await action(formData);
      onSuccess?.();
      startTransition(() => router.refresh());
    } catch (error) {
      console.error("ActionForm submit failed", error);
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
