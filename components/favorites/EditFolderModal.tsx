"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useFolders, useUpdateFolderName } from "@/queries/settings/useFolder";

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditFolderModal({ isOpen, onClose }: EditFolderModalProps) {
  const { data: folders = [] } = useFolders();
  const { mutate: updateName, isPending } = useUpdateFolderName();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [folderName, setFolderName] = useState("");

  const selectedFolder = useMemo(
    () => folders.find((folder) => folder.id === selectedFolderId) ?? null,
    [folders, selectedFolderId]
  );

  useEffect(() => {
    if (!isOpen) return;
    if (selectedFolder) {
      setFolderName(selectedFolder.name);
    }
  }, [isOpen, selectedFolder]);

  if (!isOpen) return null;

  const isButtonEnabled =
    !!selectedFolderId && folderName.trim().length > 0 && !isPending;

  const handleClose = () => {
    if (isPending) return;
    setSelectedFolderId(null);
    setFolderName("");
    onClose();
  };

  const handleSave = () => {
    if (!isButtonEnabled || !selectedFolderId) return;
    const normalizedName = folderName.trim().replace(/^["']+|["']+$/g, "");
    if (!normalizedName) return;

    updateName(
      { folderId: selectedFolderId, folderName: normalizedName },
      {
        onSuccess: () => {
          setSelectedFolderId(null);
          setFolderName("");
          onClose();
        },
      }
    );
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
            폴더 수정
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
            폴더 선택
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
                  name="editFolder"
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
        </div>

        <div className="flex w-full flex-col">
          <label className="mb-2 text-[14px] font-semibold leading-[180%] text-[#6C7180]">
            폴더 이름
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="폴더 이름을 입력해주세요"
            maxLength={20}
            className="h-12 w-full rounded border border-[#D3D5DC] px-4 text-base font-medium text-basic placeholder:text-[#A6ABB7] focus:border-[#F36012] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isButtonEnabled}
          className={
            isButtonEnabled
              ? "w-full rounded-2xl bg-orange py-[13px] text-[16px] font-medium text-white transition-colors hover:bg-orange/90"
              : "w-full cursor-not-allowed rounded-lg bg-[#D3D5DC] py-[13px] text-[16px] font-medium text-white"
          }
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </>
  );
}
