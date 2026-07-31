import { Suspense } from "react";
import { LoginForm } from "@/shared/components/ui/login-form";
import { appConfig } from "@/shared/config/app.config";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{appConfig.nome}</h1>
        <p className="text-sm text-gray-500">Acesso ao painel administrativo</p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
