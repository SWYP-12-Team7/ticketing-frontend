"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useFolders, useDeleteFolder } from "@/queries/settings/useFolder";

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteFolderModal({ isOpen, onClose }: DeleteFolderModalProps) {
  const { data: folders = [] } = useFolders();
  const { mutate: deleteFolder, isPending } = useDeleteFolder();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  if (!isOpen) return null;

  const isButtonEnabled = !!selectedFolderId && !isPending;

  const handleClose = () => {
    if (isPending) return;
    setSelectedFolderId(null);
    onClose();
  };

  const handleDelete = () => {
    if (!selectedFolderId) return;
    deleteFolder(selectedFolderId, {
      onSuccess: () => {
        toast.success("폴더가 삭제되었습니다.");
        setSelectedFolderId(null);
        onClose();
      },
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="fixed left-1/2 top-1/2 z-50 flex w-[520px] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-2xl bg-white px-6 py-8 shadow-[0px_0px_4px_rgba(0,0,0,0.1),0px_6px_8px_rgba(0,0,0,0.1)]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl mx-auto font-semibold text-basic">
            폴더 삭제
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center text-[#6C7180] hover:opacity-70"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex w-full flex-col gap-3">
          <span className="text-[14px] font-semibold leading-[180%] text-[#6C7180]">
            삭제할 폴더 선택
          </span>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-[#D3D5DC]">
            {folders.map((folder) => (
              <label
                key={folder.id}
                className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-basic hover:bg-gray-50"
              >
                <span>{folder.name}</span>
                <input
                  type="radio"
                  name="deleteFolder"
                  checked={selectedFolderId === folder.id}
                  onChange={() => setSelectedFolderId(folder.id)}
                />
              </label>
            ))}
            {folders.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                폴더가 없습니다
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            폴더를 삭제하면 해당 폴더에 있던 행사는 “미분류”로 이동됩니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={!isButtonEnabled}
          className={
            isButtonEnabled
              ? "w-full rounded-2xl bg-orange py-[13px] text-[16px] font-medium text-white transition-colors hover:bg-orange/90"
              : "w-full cursor-not-allowed rounded-lg bg-[#D3D5DC] py-[13px] text-[16px] font-medium text-white"
          }
        >
          {isPending ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </>
  );
}
