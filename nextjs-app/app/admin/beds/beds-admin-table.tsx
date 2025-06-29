"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addBed,
  editBed,
  deleteBed as deleteBedAction,
  reorderBeds,
} from "./actions";

interface BedRow {
  id: number;
  name: string;
  order: number;
}

export default function BedsAdminTable({
  initialBeds,
}: {
  initialBeds: BedRow[];
}) {
  const [beds, setBeds] = useState<BedRow[]>(initialBeds);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTestId, setToastTestId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("BedsAdmin");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingBedId, setEditingBedId] = useState<number | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<BedRow | null>(null);

  function showToast(text: string, testId: string) {
    setToast(text);
    setToastTestId(testId);
    setTimeout(() => { setToast(null); setToastTestId(null); }, 4000);
  }

  // Modal helpers
  function openAddModal() {
    setModalMode("add");
    setNameInput("");
    setError(null);
    setEditingBedId(null);
    setModalOpen(true);
  }

  function openEditModal(bed: BedRow) {
    setModalMode("edit");
    setNameInput(bed.name);
    setError(null);
    setEditingBedId(bed.id);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleSave() {
    if (!nameInput.trim()) return;

    if (modalMode === "add") {
      startTransition(async () => {
        try {
          const newBed: BedRow = await addBed(nameInput.trim());
          setBeds((prev) => [...prev, newBed]);
          showToast(t("bedAdded"), "bed-added-toast");
          closeModal();
        } catch (err) {
          if ((err as Error).message === "DUPLICATE_BED_NAME") {
            setError(t("duplicateNameError"));
          } else {
            // Re-throw unexpected errors so they surface in logs
            throw err;
          }
        }
      });
    } else if (modalMode === "edit" && editingBedId !== null) {
      startTransition(async () => {
        try {
          const updated: BedRow = await editBed(editingBedId, nameInput.trim());
          setBeds((prev) =>
            prev.map((b) => (b.id === editingBedId ? updated : b)),
          );
          showToast(t("bedUpdated"), "bed-updated-toast");
          closeModal();
        } catch (err) {
          if ((err as Error).message === "DUPLICATE_BED_NAME") {
            setError(t("duplicateNameError"));
          } else {
            throw err;
          }
        }
      });
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    startTransition(async () => {
      await deleteBedAction(id);
      setBeds((prev) => prev.filter((b) => b.id !== id));
      setDeleteTarget(null);
      showToast(t("bedDeleted"), "bed-deleted-toast");
    });
  }

  // Drag & drop handlers
  let dragId: number | null = null;
  function handleDragStart(id: number) {
    dragId = id;
  }
  function handleDragOver(e: React.DragEvent<HTMLTableRowElement>) {
    e.preventDefault();
  }
  function handleDrop(targetId: number) {
    if (dragId === null || dragId === targetId) return;
    const newOrder = [...beds];
    const sourceIdx = newOrder.findIndex((b) => b.id === dragId);
    const targetIdx = newOrder.findIndex((b) => b.id === targetId);
    if (sourceIdx < 0 || targetIdx < 0) return;
    const [moved] = newOrder.splice(sourceIdx, 1);
    newOrder.splice(targetIdx, 0, moved);
    setBeds(newOrder);
    dragId = null;
    startTransition(async () => {
      await reorderBeds(newOrder.map((b) => b.id));
      showToast(t("orderSaved"), "order-saved-toast");
    });
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button data-testid="add-bed-button" onClick={openAddModal}>
          {t("addBed")}
        </Button>
      </div>

      {beds.length === 0 ? (
        <p>{t("noBeds")}</p>
      ) : (
        <table className="w-full border rounded-md">
          <tbody>
            {beds.map((bed) => (
              <tr
                key={bed.id}
                data-testid="bed-row"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(bed.id)}
                className="border-b last:border-0"
              >
                <td className="p-2 w-8 text-center">
                  <span
                    data-testid="bed-drag-handle"
                    draggable
                    onDragStart={() => handleDragStart(bed.id)}
                    className="cursor-grab select-none"
                  >
                    ☰
                  </span>
                </td>
                <td className="p-2">{bed.name}</td>
                <td className="p-2 w-40">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="edit-bed-button"
                      onClick={() => openEditModal(bed)}
                    >
                      {t("editBed")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      data-testid="delete-bed-button"
                      onClick={() => setDeleteTarget(bed)}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-background rounded-md shadow-md p-6 w-80 space-y-4">
            <h2
              className="text-lg font-semibold"
              data-testid={modalMode === "add" ? "add-bed-modal-title" : "edit-bed-modal-title"}
            >
              {modalMode === "add"
                ? t("addBed")
                : `${t("editBed")} '${nameInput}'`}
            </h2>
            <Input
              data-testid="bed-name-input"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError(null);
              }}
              disabled={isPending}
            />
            {error && (
              <p
                data-testid="duplicate-name-error"
                className="text-red-600 text-sm mt-1"
              >
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button data-testid="bed-cancel-add-edit-button" variant="secondary" onClick={closeModal} disabled={isPending}>
                {t("cancel")}
              </Button>
              <Button
                data-testid="bed-save-button"
                onClick={handleSave}
                disabled={!nameInput.trim() || isPending}
              >
                {t("save")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-background rounded-md shadow-md p-6 w-80 space-y-4">
            <h2
              className="text-lg font-semibold"
              data-testid="delete-bed-modal-title"
            >
              {t("deleteBed", { name: deleteTarget.name })}
            </h2>
            <p>{t("deleteWarning")}</p>
            <div className="flex justify-end gap-2">
              <Button data-testid="bed-cancel-delete-button" variant="secondary" onClick={() => setDeleteTarget(null)}>
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                data-testid="confirm-delete-bed-button"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div data-testid={toastTestId} className="fixed bottom-4 right-4 bg-gray-800 text-white rounded px-4 py-2">
          {toast}
        </div>
      )}
    </div>
  );
}