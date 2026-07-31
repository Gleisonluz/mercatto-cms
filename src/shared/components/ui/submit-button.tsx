"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/shared/components/ui/button";

/**
 * Botão de submit que reflete automaticamente o estado pendente do
 * formulário (React 19 `useFormStatus`), usado nos formulários de
 * Server Actions em todo o admin.
 */
export function SubmitButton({
  children,
  pendingText = "Salvando...",
  ...props
}: ButtonProps & { pendingText?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
