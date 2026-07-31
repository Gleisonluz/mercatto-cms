"use client";

import { useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, Plus } from "lucide-react";

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
import { excluirEditoriaAction } from "@/modules/editorial/application/editoria.actions";
import type { Editoria } from "@/modules/editorial/domain/entities/editoria.entity";

type EditoriaComContagem = Editoria & { quantidadeNoticias: number };

export function EditoriasTable({
  editorias,
}: {
  editorias: EditoriaComContagem[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/editorias/novo">
            <Plus />
            Nova Editoria
          </Link>
        </Button>
      </div>

      {editorias.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          Nenhuma editoria cadastrada ainda. Clique em &quot;Nova Editoria&quot;
          para começar.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notícias</TableHead>
              <TableHead>Última atualização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editorias.map((editoria) => (
              <EditoriaRow key={editoria.id} editoria={editoria} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function EditoriaRow({ editoria }: { editoria: EditoriaComContagem }) {
  const [isPending, startTransition] = useTransition();

  function handleExcluir() {
    startTransition(() => {
      excluirEditoriaAction(editoria.id);
    });
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {editoria.cor && (
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: editoria.cor }}
            />
          )}
          <span className="font-medium text-gray-900">{editoria.nome}</span>
        </div>
      </TableCell>
      <TableCell className="text-gray-500">{editoria.slug}</TableCell>
      <TableCell>
        {editoria.ativo ? (
          <Badge variant="success">Ativo</Badge>
        ) : (
          <Badge variant="muted">Inativo</Badge>
        )}
      </TableCell>
      <TableCell className="text-gray-500">
        {editoria.quantidadeNoticias}
      </TableCell>
      <TableCell className="text-gray-500">
        {format(new Date(editoria.atualizadoEm), "dd/MM/yyyy 'às' HH:mm", {
          locale: ptBR,
        })}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link
              href={`/editorias/${editoria.id}/editar`}
              aria-label={`Editar ${editoria.nome}`}
            >
              <Pencil />
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Excluir ${editoria.nome}`}
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir editoria</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a editoria{" "}
                  <strong>{editoria.nome}</strong>? Esta ação não pode ser
                  desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleExcluir} disabled={isPending}>
                  {isPending ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
