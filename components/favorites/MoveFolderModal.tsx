"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useFolders } from "@/queries/settings/useFolder";

const FOLDER_COLORS = [
  "bg-orange-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-rose-500",
  "bg-indigo-500",
];

interface MoveFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onMove: (folderId: number | null) => void;
}

export function MoveFolderModal({
  isOpen,
  onClose,
  selectedCount,
  onMove,
}: MoveFolderModalProps) {
  const { data: folders = [] } = useFolders();
  const [selectedFolderId, setSelectedFolderId] = useState<
    number | null
  >(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onMove(selectedFolderId);
  };

  const handleClose = () => {
    setSelectedFolderId(null);
    onClose();
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
      <div className="fixed left-1/2 top-1/2 z-50 flex w-87.5 h-[413px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-5 shadow-[0px_0px_4px_rgba(0,0,0,0.1),0px_6px_8px_rgba(0,0,0,0.1)]">
        {/* 헤더 */}
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-basic">
            이동할 폴더 선택
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center text-[#6C7180] hover:opacity-70"
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>

        {/* 서브텍스트 */}
        <p className="mt-3 text-sm text-[#4B5462] font-normal">
          <span className="text-orange">{selectedCount}</span>개의 행사를 어디로 옮길까요?
        </p>

        {/* 폴더 리스트 */}
        <div className="mt-6  rounded-[8px] flex max-h-[300px] flex-col gap-2 overflow-y-auto scrollbar-hide">
          {folders.map((folder, index) => (
            <label
              key={folder.id}
              className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#E5E7EA] px-4 py-3.5 transition-colors hover:bg-gray-50"
            >
              {/* 색상 원 */}
              <div
                className={`h-4 w-4 shrink-0 rounded-full ${FOLDER_COLORS[index % FOLDER_COLORS.length]}`}
              />
              {/* 폴더명 */}
              <span className="flex-1 text-base font-medium text-basic">
                {folder.name}
              </span>
              {/* 라디오 */}
              <span
                aria-hidden="true"
                className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#6C7180]"
              >
                {selectedFolderId === folder.id && (
                  <span className="h-4 w-4 rounded-full bg-[#6C7180]" />
                )}
              </span>
              <input
                type="radio"
                name="folder"
                checked={selectedFolderId === folder.id}
                onChange={() => setSelectedFolderId(folder.id)}
                className="sr-only"
              />
            </label>
          ))}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-[8px] bg-orange px-6 py-3.25  font-medium text-white transition-colors hover:bg-orange/90"
          >
            {selectedFolderId === null
              ? "아무 폴더에도 넣지 않기"
              : "선택한 폴더로 이동"}
          </button>
        </div>
      </div>
    </>
  );
}
