/**
 * Fluxo de recuperação de senha.
 *
 * Sprint 1: estrutura de rota criada como parte da fundação de
 * Autenticação (01.03.1, módulo 1). A lógica de envio de e-mail e
 * geração de token será implementada junto ao módulo `usuarios` no
 * próximo sprint, junto com o provedor de e-mail transacional.
 */
export default function RecuperarSenhaPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Recuperar senha</h1>
      <p className="max-w-sm text-sm text-gray-500">
        Este fluxo será implementado no próximo sprint, junto ao módulo de
        usuários.
      </p>
    </main>
  );
}
