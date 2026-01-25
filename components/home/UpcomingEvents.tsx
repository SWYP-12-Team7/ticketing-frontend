"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UpcomingEvent {
  id: string;
  title: string;
  location: string;
  openDate: Date;
  imageUrl: string;
  likeCount: number;
}

interface UpcomingEventsProps {
  className?: string;
  events?: UpcomingEvent[];
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <span className="rounded bg-primary px-1.5 py-0.5 text-primary-foreground">
        {String(timeLeft.days).padStart(2, "0")}
      </span>
      <span>:</span>
      <span className="rounded bg-primary px-1.5 py-0.5 text-primary-foreground">
        {String(timeLeft.hours).padStart(2, "0")}
      </span>
      <span>:</span>
      <span className="rounded bg-primary px-1.5 py-0.5 text-primary-foreground">
        {String(timeLeft.minutes).padStart(2, "0")}
      </span>
      <span>:</span>
      <span className="rounded bg-primary px-1.5 py-0.5 text-primary-foreground">
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

export function UpcomingEvents({ className, events }: UpcomingEventsProps) {
  // 임시 데이터
  const defaultEvents: UpcomingEvent[] = [
    {
      id: "1",
      title: "아이유 콘서트 2024",
      location: "잠실종합운동장",
      openDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      imageUrl: "/placeholder.jpg",
      likeCount: 5234,
    },
    {
      id: "2",
      title: "세븐틴 월드투어",
      location: "고척스카이돔",
      openDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      imageUrl: "/placeholder.jpg",
      likeCount: 4521,
    },
    {
      id: "3",
      title: "뉴진스 팬미팅",
      location: "KSPO DOME",
      openDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      imageUrl: "/placeholder.jpg",
      likeCount: 3892,
    },
  ];

  const displayEvents = events || defaultEvents;

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">오픈 예정 행사를 위한 카운트다운!</h2>
        <Link
          href="/upcoming"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          더보기
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayEvents.map((event) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="aspect-[16/9] bg-muted" />
            <div className="p-4">
              <h3 className="mb-1 truncate font-bold">{event.title}</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                {event.location}
              </p>
              <div className="mb-3">
                <p className="mb-1 text-xs text-muted-foreground">
                  티켓 오픈까지
                </p>
                <CountdownTimer targetDate={event.openDate} />
              </div>
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
