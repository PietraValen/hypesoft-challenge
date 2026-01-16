"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/auth/UserForm";
import { UserFilters } from "@/components/users/UserFilters";
import { ResetPasswordDialog } from "@/components/users/ResetPasswordDialog";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResetPassword,
  useSendVerificationEmail,
} from "@/hooks/useUsers";
import { User, CreateUserDto, UpdateUserDto } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGINATION } from "@/lib/constants";
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

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined);
  const [emailVerified, setEmailVerified] = useState<boolean | undefined>(
    undefined
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading } = useUsers({
    search: searchTerm || undefined,
    first: (page - 1) * PAGINATION.DEFAULT_PAGE_SIZE,
    max: PAGINATION.DEFAULT_PAGE_SIZE,
    enabled: enabled,
    emailVerified: emailVerified,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();
  const sendVerificationEmailMutation = useSendVerificationEmail();

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleEnabled = async (user: User) => {
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        data: { enabled: !user.enabled },
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };

  const handleSendVerificationEmail = async (user: User) => {
    try {
      await sendVerificationEmailMutation.mutateAsync(user.id);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleFormSubmit = (data: CreateUserDto | UpdateUserDto) => {
    if (selectedUser) {
      updateMutation.mutate(
        { id: selectedUser.id, data: data as UpdateUserDto },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedUser(null);
          },
        }
      );
    } else {
      createMutation.mutate(data as CreateUserDto, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleResetPasswordSubmit = (data: {
    password: string;
    temporary: boolean;
  }) => {
    if (selectedUser) {
      resetPasswordMutation.mutate(
        {
          userId: selectedUser.id,
          data: {
            password: data.password,
            temporary: data.temporary,
          },
        },
        {
          onSuccess: () => {
            setIsResetPasswordDialogOpen(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  const users = data?.users || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        enabled={enabled}
        onEnabledChange={setEnabled}
        emailVerified={emailVerified}
        onEmailVerifiedChange={setEmailVerified}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <UserTable
          users={users}
          total={total}
          currentPage={page}
          pageSize={PAGINATION.DEFAULT_PAGE_SIZE}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleEnabled={handleToggleEnabled}
          onResetPassword={handleResetPassword}
          onSendVerificationEmail={handleSendVerificationEmail}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser || undefined}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ResetPasswordDialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
        user={selectedUser || undefined}
        onSubmit={handleResetPasswordSubmit}
        isLoading={resetPasswordMutation.isPending}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>
                {selectedUser?.firstName || selectedUser?.lastName
                  ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim()
                  : selectedUser?.username}
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
    </div>
  );
}
