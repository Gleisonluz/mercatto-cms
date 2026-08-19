"use client";

import { useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Ban, RotateCcw, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  desativarUsuarioAction,
  reativarUsuarioAction,
} from "@/modules/usuarios/application/usuario.actions";
import type { Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";

const RES_PAPEL: Record<Usuario["papel"], string> = {
  SUPER_ADMINISTRADOR: "Super Administrador",
  ADMINISTRADOR: "Administrador",
  EDITOR_CHEFE: "Editor-chefe",
  EDITOR: "Editor",
  JORNALISTA: "Jornalista",
  COLUNISTA: "Colunista",
  FOTOGRAFO: "Fotógrafo",
  COMERCIAL: "Comercial",
};

export function UsuariosTable({
  usuarios,
  usuarioLogadoId,
}: {
  usuarios: Usuario[];
  usuarioLogadoId: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/usuarios/novo">
            <Plus />
            Novo Usuário
          </Link>
        </Button>
      </div>

      {usuarios.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          Nenhum usuário encontrado.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <UsuarioRow
                key={usuario.id}
                usuario={usuario}
                ehUsuarioLogado={usuario.id === usuarioLogadoId}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function UsuarioRow({
  usuario,
  ehUsuarioLogado,
}: {
  usuario: Usuario;
  ehUsuarioLogado: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleReativar() {
    startTransition(() => {
      reativarUsuarioAction(usuario.id);
    });
  }

  function handleDesativar() {
    startTransition(() => {
      desativarUsuarioAction(usuario.id);
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-gray-900">
        {usuario.nome}
        {ehUsuarioLogado && (
          <span className="ml-2 text-xs font-normal text-gray-400">
            (você)
          </span>
        )}
      </TableCell>
      <TableCell className="text-gray-500">{usuario.email}</TableCell>
      <TableCell className="text-gray-500">
        {RES_PAPEL[usuario.papel]}
      </TableCell>
      <TableCell>
        {usuario.ativo ? (
          <Badge variant="success">Ativo</Badge>
        ) : (
          <Badge variant="muted">Inativo</Badge>
        )}
      </TableCell>
      <TableCell className="text-gray-500">
        {usuario.ultimoAcesso
          ? format(new Date(usuario.ultimoAcesso), "dd/MM/yyyy 'às' HH:mm", {
              locale: ptBR,
            })
          : "—"}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link
              href={`/usuarios/${usuario.id}/editar`}
              aria-label={`Editar ${usuario.nome}`}
            >
              <Pencil />
            </Link>
          </Button>

          {usuario.ativo ? (
            // Proteção contra auto-desativação (item 10): o botão fica
            // oculto para a própria conta. Isso é só UX — a Server
            // Action também verifica isso no servidor, independente
            // do que a interface mostra.
            !ehUsuarioLogado && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Desativar ${usuario.nome}`}
                  >
                    <Ban />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Desativar usuário</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja desativar{" "}
                      <strong>{usuario.nome}</strong>? A conta permanece
                      cadastrada, mas não poderá mais acessar o sistema até
                      ser reativada.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDesativar}
                      disabled={isPending}
                    >
                      {isPending ? "Desativando..." : "Desativar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )
          ) : (
            <Button
              variant="outline"
              size="icon"
              aria-label={`Reativar ${usuario.nome}`}
              onClick={handleReativar}
              disabled={isPending}
            >
              <RotateCcw />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
