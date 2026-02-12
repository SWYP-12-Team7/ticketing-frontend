"use client";

import { useRef } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { FolderCard } from "./FolderCard";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// 임시 Mock 데이터
const MOCK_FOLDERS = [
    {
        id: 1,
        name: "곧 갈거임",
        itemCount: 30,
        thumbnails: [
            "https://picsum.photos/id/10/200/300",
            "https://picsum.photos/id/11/200/300",
            "https://picsum.photos/id/12/200/300",
        ],
        color: "orange",
    },
    {
        id: 2,
        name: "주말 데이트",
        itemCount: 30,
        thumbnails: [
            "https://picsum.photos/id/13/200/300",
            "https://picsum.photos/id/14/200/300",
            "https://picsum.photos/id/15/200/300",
        ],
        color: "emerald",
    },
    {
        id: 3,
        name: "전시회 모음",
        itemCount: 20,
        thumbnails: [
            "https://picsum.photos/id/16/200/300",
            "https://picsum.photos/id/17/200/300",
            "https://picsum.photos/id/18/200/300",
        ],
        color: "violet",
    },
    {
        id: 4,
        name: "나만의 힐링",
        itemCount: 40,
        thumbnails: [
            "https://picsum.photos/id/20/200/300",
            "https://picsum.photos/id/21/200/300",
            "https://picsum.photos/id/22/200/300",
        ],
        color: "blue",
    },
    {
        id: 5,
        name: "가고싶은 팝업",
        itemCount: 2,
        thumbnails: [
            "https://picsum.photos/id/25/200/300",
            "https://picsum.photos/id/26/200/300",
        ],
        color: "rose",
    },
    {
        id: 6,
        name: "혼자 놀기",
        itemCount: 1,
        thumbnails: [
            "https://picsum.photos/id/28/200/300",
        ],
        color: "indigo",
    },
];

export function FolderList() {
    return (
        <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    내 폴더 <span className="text-orange-500">{MOCK_FOLDERS.length}</span>
                </h2>
                <button className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                    폴더 편집하기
                    <ChevronRight size={16} />
                </button>
            </div>

            <div className="w-full overflow-hidden">
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
                        releaseOnEdges: true,
                    }}
                    grabCursor={true}
                    className="w-full pb-6!"
                >
                    {MOCK_FOLDERS.map((folder) => (
                        <SwiperSlide key={folder.id} style={{ width: "auto" }}>
                            <div className="select-none"> {/* 드래그 시 텍스트 선택 방지 */}
                                <FolderCard
                                    name={folder.name}
                                    itemCount={folder.itemCount}
                                    thumbnails={folder.thumbnails}
                                    color={folder.color}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                    <SwiperSlide style={{ width: "auto" }}>
                        <button
                            className="flex h-[300px] w-[380px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                                <Plus size={28} />
                            </div>
                            <span className="text-lg font-medium text-gray-500">새 폴더</span>
                        </button>
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
    );
}
