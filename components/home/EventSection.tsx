import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  likeCount: number;
}

interface EventSectionProps {
  className?: string;
  title: string;
  events?: Event[];
  showMore?: boolean;
}

export function EventSection({
  className,
  title,
  events,
  showMore = true,
}: EventSectionProps) {
  // 임시 데이터
  const defaultEvents: Event[] = [
    {
      id: "1",
      title: "2024 서울 뮤직 페스티벌",
      location: "난지한강공원",
      date: "2024.06.01 - 2024.06.02",
      imageUrl: "/placeholder.jpg",
      likeCount: 1523,
    },
    {
      id: "2",
      title: "반 고흐 디지털 전시회",
      location: "동대문DDP",
      date: "2024.04.15 - 2024.08.31",
      imageUrl: "/placeholder.jpg",
      likeCount: 982,
    },
    {
      id: "3",
      title: "K리그 클래식 경기",
      location: "서울월드컵경기장",
      date: "2024.05.18",
      imageUrl: "/placeholder.jpg",
      likeCount: 756,
    },
    {
      id: "4",
      title: "뮤지컬 오페라의 유령",
      location: "샤롯데씨어터",
      date: "2024.03.01 - 2024.05.31",
      imageUrl: "/placeholder.jpg",
      likeCount: 2341,
    },
  ];

  const displayEvents = events || defaultEvents;

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {showMore && (
          <Link
            href="/events"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            더보기
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayEvents.map((event) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="aspect-[4/3] bg-muted" />
            <div className="p-3">
              <h3 className="mb-1 truncate font-medium">{event.title}</h3>
              <p className="mb-1 truncate text-sm text-muted-foreground">
                {event.location}
              </p>
              <p className="mb-2 text-sm text-muted-foreground">{event.date}</p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="size-4" />
                <span className="text-sm">
                  {event.likeCount.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
