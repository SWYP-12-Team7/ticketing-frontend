"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { ChevronRight, Plus } from "lucide-react";
import { useFolders } from "@/queries/settings/useFolder";
import { FolderCard } from "./FolderCard";
import { CreateFolderModal } from "./CreateFolderModal";

import "swiper/css";
import "swiper/css/free-mode";

const FOLDER_COLORS = ["orange", "emerald", "violet", "blue", "rose", "indigo"];

interface FolderListProps {
    onEditClick?: () => void;
}

export function FolderList({ onEditClick }: FolderListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: folders = [] } = useFolders();

    return (
        <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-semibold #000">
                    내 폴더 <span className="text-orange">{folders.length}</span>
                </h2>
                <button
                    onClick={onEditClick}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                >
                    폴더 편집하기
                    <ChevronRight size={16} />
                </button>
            </div>

            <div className="w-full overflow-hidden" style={{ overscrollBehavior: 'contain' }}>
                <Swiper
                    modules={[FreeMode, Mousewheel]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    freeMode={{
                        enabled: true,
                        momentum: true,
                        momentumRatio: 0.8,
                    }}
                    mousewheel={{
                        forceToAxis: false,
                        sensitivity: 1.5,
                        releaseOnEdges: false,
                        eventsTarget: 'container',
                    }}
                    grabCursor={true}
                    className="w-full pb-6!"
                >
                    {folders.map((folder, index) => (
                        <SwiperSlide key={folder.id} style={{ width: "auto" }}>
                            <div className="select-none">
                                <FolderCard
                                    id={folder.id}
                                    name={folder.name}
                                    itemCount={folder.totalCount}
                                    color={FOLDER_COLORS[index % FOLDER_COLORS.length]}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                    <SwiperSlide style={{ width: "auto" }}>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex h-[300px] w-[380px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange">
                                <Plus size={28} />
                            </div>
                            <span className="text-lg font-medium text-gray-500">새 폴더</span>
                        </button>
                    </SwiperSlide>
                </Swiper>
            </div>

            <CreateFolderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
