"use client";

import Image from "next/image";

interface FolderCardProps {
    id?: number;
    name: string;
    itemCount?: number;
    thumbnails?: string[];
    color?: string; // e.g. "orange", "blue"
    onClick?: () => void;
}

export function FolderCard({
    name,
    itemCount = 0,
    thumbnails = [],
    color = "orange",
    onClick,
}: FolderCardProps) {
    // Map standard colors to strong bg (for info) and light bg (for card background)
    const colorMap: Record<string, { bg: string; lightBg: string; text: string }> = {
        orange: { bg: "bg-orange-500", lightBg: "bg-orange-50", text: "text-orange-900" },
        emerald: { bg: "bg-emerald-500", lightBg: "bg-emerald-50", text: "text-emerald-900" },
        violet: { bg: "bg-violet-500", lightBg: "bg-violet-50", text: "text-violet-900" },
        blue: { bg: "bg-blue-500", lightBg: "bg-blue-50", text: "text-blue-900" },
        rose: { bg: "bg-rose-500", lightBg: "bg-rose-50", text: "text-rose-900" },
        indigo: { bg: "bg-indigo-500", lightBg: "bg-indigo-50", text: "text-indigo-900" },
    };

    const selectedColor = colorMap[color] || colorMap.orange;

    // 공통 스타일: 380x300, radius-xl (approx 20px? Tailwind 'rounded-[20px]' for exactness)
    const cardClasses = `group relative h-[300px] w-[380px] shrink-0 cursor-pointer overflow-hidden rounded-[20px] ${selectedColor.lightBg} transition-transform hover:scale-[1.02]`;

    // Info Section: 380x124, rounded-[20px] on top? Or just bottom? usually cards have bottom rounded.
    // The user said "text section is 380x124 radius 20px". 
    // If the whole card is 20px radius, the info section at bottom likely matches that radius.
    // Let's assume the info block itself has 20px radius, possibly floating or just filling bottom.
    // "이부분도 이 아래부분이 사진을 살짝 덮어야 해요" -> Overlapping.
    // So the info section should be z-index higher than images.
    const infoSection = (
        <div className={`absolute bottom-0 z-20 h-[124px] w-full rounded-[20px] px-6 py-5 ${selectedColor.bg}`}>
            <div className="flex h-full flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white leading-tight">{name}</h3>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <span>총 행사 {itemCount}</span>
                    <span className="h-3 w-[1px] bg-white/40"></span>
                    <span>팝업 {Math.floor(itemCount * 0.6)}</span>
                    <span className="h-3 w-[1px] bg-white/40"></span>
                    <span>전시 {Math.ceil(itemCount * 0.4)}</span>
                </div>
            </div>
        </div>
    );

    // Layout for 3+ items: Center (Main, Front) + Left (Back) + Right (Back)
    // "3개일때는 가운데 왼쪽 오른쪽" -> Likely Center is biggest/front.
    // User feedback on image 1 (3 items): "이부분이 사진 과 좀 달라요 이미지의 기울기가 다르고 border 같은 경우는 따로 없습니다"
    // So NO BORDERS. 
    // Adjust sizing to look like the reference (which I can't see but can infer: overlapping collage).
    if (itemCount >= 3) {
        return (
            <div className={cardClasses} onClick={onClick}>
                <div className="relative h-full w-full">
                    {/* 왼쪽 (Back) */}
                    <div className="absolute left-8 top-12 h-[160px] w-[120px] -rotate-12 overflow-hidden rounded-xl shadow-md opacity-90">
                        {thumbnails[1] ? (
                            <Image src={thumbnails[1]} alt="" fill className="object-cover" />
                        ) : <div className="h-full w-full bg-gray-200" />}
                    </div>

                    {/* 오른쪽 (Back) */}
                    <div className="absolute right-8 top-12 h-[160px] w-[120px] rotate-12 overflow-hidden rounded-xl shadow-md opacity-90">
                        {thumbnails[2] ? (
                            <Image src={thumbnails[2]} alt="" fill className="object-cover" />
                        ) : <div className="h-full w-full bg-gray-200" />}
                    </div>

                    {/* 가운데 (Front, Main) */}
                    <div className="absolute left-1/2 top-6 h-[180px] w-[140px] -translate-x-1/2 overflow-hidden rounded-xl shadow-lg z-10">
                        {thumbnails[0] ? (
                            <Image src={thumbnails[0]} alt="" fill className="object-cover" />
                        ) : <div className="h-full w-full bg-gray-200" />}
                    </div>
                </div>
                {infoSection}
            </div>
        );
    }

    // 2 items: Left + Center
    // "2개일때는 왼쪽 가운데"
    // No borders.
    if (itemCount === 2) {
        return (
            <div className={cardClasses} onClick={onClick}>
                <div className="relative h-full w-full">
                    {/* 왼쪽 (Back) */}
                    <div className="absolute left-14 top-10 h-[160px] w-[130px] -rotate-6 overflow-hidden rounded-xl shadow-md opacity-90">
                        {thumbnails[1] ? (
                            <Image src={thumbnails[1]} alt="" fill className="object-cover" />
                        ) : <div className="h-full w-full bg-gray-200" />}
                    </div>

                    {/* 가운데 (Front) - slightly offset right to be "Center" relative to left one? 
                Or just centered in card? User said "Left Center". 
                Let's put one left-ish and one center-ish.
            */}
                    <div className="absolute left-1/2 top-6 h-[180px] w-[140px] -translate-x-1/4 overflow-hidden rounded-xl shadow-lg z-10">
                        {thumbnails[0] ? (
                            <Image src={thumbnails[0]} alt="" fill className="object-cover" />
                        ) : <div className="h-full w-full bg-gray-200" />}
                    </div>
                </div>
                {infoSection}
            </div>
        );
    }

    // 1 item: Center
    // "1개일때는 가운데만"
    if (itemCount === 1) {
        return (
            <div className={cardClasses} onClick={onClick}>
                <div className="relative h-full w-full">
                    <div className="absolute left-1/2 top-8 h-[180px] w-[150px] -translate-x-1/2 overflow-hidden rounded-xl shadow-lg">
                        {thumbnails[0] ? (
                            <Image src={thumbnails[0]} alt="" fill className="object-cover" />
                        ) : <div className="h-full w-full bg-gray-200" />}
                    </div>
                </div>
                {infoSection}
            </div>
        );
    }

    // Fallback (0 or unexpected?)
    return (
        <div className={cardClasses} onClick={onClick}>
            <div className="relative h-full w-full flex items-center justify-center text-gray-400">
                No items
            </div>
            {infoSection}
        </div>
    );
}
