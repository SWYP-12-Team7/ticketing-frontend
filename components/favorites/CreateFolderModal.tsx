"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateFolder } from "@/queries/settings/useFolder";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const { mutate: createFolder, isPending } = useCreateFolder();

  if (!isOpen) return null;

  const isButtonEnabled = folderName.trim().length > 0 && !isPending;

  const handleCreate = () => {
    if (!isButtonEnabled) return;

    const normalizedName = folderName
      .trim()
      .replace(/^["']+|["']+$/g, "");

    if (!normalizedName) return;

    createFolder(normalizedName, {
      onSuccess: () => {
        setFolderName("");
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (isPending) return;
    setFolderName("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isButtonEnabled) {
      handleCreate();
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 모달 */}
      <div className="fixed left-1/2 top-1/2 z-50 flex w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 rounded-2xl bg-white px-6 py-8 shadow-[0px_0px_4px_rgba(0,0,0,0.1),0px_6px_8px_rgba(0,0,0,0.1)]">
        {/* 헤더 */}
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl mx-auto font-semibold text-basic">
            새 폴더
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

        {/* 입력 필드 */}
        <div className="flex w-full flex-col">
          <label className="mb-2 text-[14px] font-semibold leading-[180%] text-[#6C7180]">
            폴더 이름
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="폴더 이름을 입력해주세요"
            maxLength={20}
            autoFocus
            className="h-12 w-full rounded border border-[#D3D5DC] px-4 text-base font-medium text-basic placeholder:text-[#A6ABB7] focus:border-[#F36012] focus:outline-none"
          />
        </div>

        {/* 버튼 */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={!isButtonEnabled}
          className={
            isButtonEnabled
              ? "w-full rounded-2xl bg-orange py-[13px] text-[16px] font-medium text-white transition-colors hover:bg-orange/90"
              : "w-full cursor-not-allowed rounded-lg bg-[#D3D5DC] py-[13px] text-[16px] font-medium text-white"
          }
        >
          {isPending ? "생성 중..." : "생성"}
        </button>
      </div>
    </>
  );
}
