"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  Edit,
  Trash2,
  Key,
  UserCheck,
  UserX,
  Mail,
  MailCheck,
} from "lucide-react";
import { User } from "@/types/auth";
import { formatDate } from "@/lib/utils/format";
import { useState } from "react";

interface UserTableProps {
  users: User[];
  total: number;
  currentPage: number;
  pageSize: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleEnabled: (user: User) => void;
  onResetPassword: (user: User) => void;
  onSendVerificationEmail: (user: User) => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function UserTable({
  users,
  total,
  currentPage,
  pageSize,
  onEdit,
  onDelete,
  onToggleEnabled,
  onResetPassword,
  onSendVerificationEmail,
  onPageChange,
  isLoading = false,
}: UserTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDelete(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const getStatusBadge = (enabled: boolean) => {
    if (enabled) {
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <UserCheck className="mr-1 h-3 w-3" />
          Habilitado
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <UserX className="mr-1 h-3 w-3" />
        Desabilitado
      </Badge>
    );
  };

  const getEmailVerificationBadge = (emailVerified: boolean) => {
    if (emailVerified) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <MailCheck className="mr-1 h-3 w-3" />
          Verificado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-orange-300 text-orange-700">
        <Mail className="mr-1 h-3 w-3" />
        Não verificado
      </Badge>
    );
  };

  const getRolesBadges = (roles: string[]) => {
    if (roles.length === 0) {
      return <span className="text-sm text-muted-foreground">Sem roles</span>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => (
          <Badge
            key={role}
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            {role}
          </Badge>
        ))}
      </div>
    );
  };

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email Verificado</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName || user.lastName
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : "—"}
                    </TableCell>
                    <TableCell>{user.email || "—"}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{getStatusBadge(user.enabled)}</TableCell>
                    <TableCell>
                      {getEmailVerificationBadge(user.emailVerified)}
                    </TableCell>
                    <TableCell>{getRolesBadges(user.roles)}</TableCell>
                    <TableCell>
                      {user.createdAt ? formatDate(user.createdAt) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onToggleEnabled(user)}
                          >
                            {user.enabled ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Desabilitar
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Habilitar
                              </>
                            )}
                          </DropdownMenuItem>
                          {!user.emailVerified && (
                            <DropdownMenuItem
                              onClick={() => onSendVerificationEmail(user)}
                            >
                              <MailCheck className="mr-2 h-4 w-4" />
                              Enviar Email de Verificação
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onResetPassword(user)}
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Redefinir Senha
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex} a {endIndex} de {total} usuários
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>
                {userToDelete?.firstName || userToDelete?.lastName
                  ? `${userToDelete.firstName || ""} ${userToDelete.lastName || ""}`.trim()
                  : userToDelete?.username}
              </strong>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
