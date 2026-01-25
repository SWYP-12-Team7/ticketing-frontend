import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  likeCount: number;
}

interface TodayPickProps {
  className?: string;
  mainEvent?: Event;
  sideEvents?: Event[];
}

export function TodayPick({
  className,
  mainEvent,
  sideEvents = [],
}: TodayPickProps) {
  // 임시 데이터 (실제로는 props로 받음)
  const defaultMainEvent: Event = {
    id: "1",
    title: "2024 서울 재즈 페스티벌",
    location: "올림픽공원",
    date: "2024.05.25 - 2024.05.26",
    imageUrl: "/placeholder.jpg",
    likeCount: 1234,
  };

  const defaultSideEvents: Event[] = [
    {
      id: "2",
      title: "뮤지컬 위키드",
      location: "블루스퀘어",
      date: "2024.04.01 - 2024.06.30",
      imageUrl: "/placeholder.jpg",
      likeCount: 856,
    },
    {
      id: "3",
      title: "모네 인상주의 전시회",
      location: "예술의전당",
      date: "2024.03.15 - 2024.07.15",
      imageUrl: "/placeholder.jpg",
      likeCount: 623,
    },
    {
      id: "4",
      title: "2024 프로야구 개막전",
      location: "잠실종합운동장",
      date: "2024.03.23",
      imageUrl: "/placeholder.jpg",
      likeCount: 445,
    },
  ];

  const main = mainEvent || defaultMainEvent;
  const sides = sideEvents.length > 0 ? sideEvents : defaultSideEvents;

  return (
    <section className={cn("", className)}>
      <h2 className="mb-4 text-xl font-bold">TODAY PICK!</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* 메인 이벤트 카드 */}
        <Link
          href={`/event/${main.id}`}
          className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="mb-1 text-lg font-bold">{main.title}</h3>
            <p className="text-sm opacity-90">{main.location}</p>
            <p className="text-sm opacity-90">{main.date}</p>
            <div className="mt-2 flex items-center gap-1">
              <Heart className="size-4" />
              <span className="text-sm">{main.likeCount.toLocaleString()}</span>
            </div>
          </div>
        </Link>

        {/* 사이드 이벤트 리스트 */}
        <div className="flex flex-col gap-3">
          {sides.map((event, index) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <span className="text-lg font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted" />
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-medium">{event.title}</h4>
                <p className="truncate text-sm text-muted-foreground">
                  {event.location}
                </p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="size-4" />
                <span className="text-sm">{event.likeCount}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
