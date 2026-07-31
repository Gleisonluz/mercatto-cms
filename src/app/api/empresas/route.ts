import { NextResponse } from "next/server";

/**
 * Rota API do módulo "empresas".
 * Sprint 1: placeholder de fundação. A lógica real de negócio deverá
 * residir em `src/modules/empresas/application` (casos de uso), nunca
 * diretamente no route handler — este arquivo apenas orquestra a
 * chamada (API First, conforme 02.00).
 */
export async function GET() {
  return NextResponse.json({
    modulo: "empresas",
    status: "em construção",
  });
}
