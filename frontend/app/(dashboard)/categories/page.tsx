"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useAuth } from "@/hooks/useAuth";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { CategoryFormModal } from "@/components/categories/CategoryFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Plus, FolderTree } from "lucide-react";
import type { Category } from "@/types/category.type";

export default function CategoriesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data, isLoading } = useCategories();
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh mục</h1>
        {isAdmin && (
          <Button onClick={() => { setEditingCategory(undefined); setModalOpen(true); }}>
            <Plus className="h-4 w-4" /> Thêm danh mục
          </Button>
        )}
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyState title="Chưa có danh mục nào" icon={<FolderTree className="h-12 w-12" />} />
      ) : (
        <CategoryTable
          data={data?.items || []}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onEdit={(cat) => { setEditingCategory(cat); setModalOpen(true); }}
          onHide={(id) => setDeleteId(id)}
        />
      )}

      <CategoryFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCategory(undefined); }}
        onSubmit={async (formData) => {
          if (editingCategory) {
            await updateCategory({ id: editingCategory.id, data: formData });
          } else {
            await createCategory(formData);
          }
          setModalOpen(false);
          setEditingCategory(undefined);
        }}
        initialData={editingCategory}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deleteCategory(deleteId);
          setDeleteId(null);
        }}
        title="Ẩn danh mục"
        message="Bạn có chắc chắn muốn ẩn danh mục này?"
      />
    </div>
  );
}
