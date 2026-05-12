"use client";

import { useState } from "react";
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from "@/hooks/useSuppliers";
import { useAuth } from "@/hooks/useAuth";
import { SupplierTable } from "@/components/suppliers/SupplierTable";
import { SupplierFormModal } from "@/components/suppliers/SupplierFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Plus, Truck } from "lucide-react";
import type { Supplier } from "@/types/supplier.type";

export default function SuppliersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data, isLoading } = useSuppliers();
  const { mutateAsync: createSupplier, isPending: isCreating } = useCreateSupplier();
  const { mutateAsync: updateSupplier, isPending: isUpdating } = useUpdateSupplier();
  const { mutateAsync: deleteSupplier } = useDeleteSupplier();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nhà cung cấp</h1>
        {isAdmin && (
          <Button onClick={() => { setEditingSupplier(undefined); setModalOpen(true); }}>
            <Plus className="h-4 w-4" /> Thêm nhà cung cấp
          </Button>
        )}
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyState title="Chưa có nhà cung cấp nào" icon={<Truck className="h-12 w-12" />} />
      ) : (
        <SupplierTable
          data={data?.items || []}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onEdit={(sup) => { setEditingSupplier(sup); setModalOpen(true); }}
          onHide={(id) => setDeleteId(id)}
        />
      )}

      <SupplierFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSupplier(undefined); }}
        onSubmit={async (formData) => {
          if (editingSupplier) {
            await updateSupplier({ id: editingSupplier.id, data: formData });
          } else {
            await createSupplier(formData);
          }
          setModalOpen(false);
          setEditingSupplier(undefined);
        }}
        initialData={editingSupplier}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deleteSupplier(deleteId);
          setDeleteId(null);
        }}
        title="Ẩn nhà cung cấp"
        message="Bạn có chắc chắn muốn ẩn nhà cung cấp này?"
      />
    </div>
  );
}
