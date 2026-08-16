import * as React from "react";
import { cn } from "@/shared/lib/cn";

/**
 * Select nativo (HTML `<select>`) estilizado no mesmo padrão visual
 * dos demais componentes de `shared/components/ui`. Deliberadamente
 * sem Radix — decisão da Sprint 3.5, para não introduzir nova
 * dependência apenas para um campo de formulário.
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
