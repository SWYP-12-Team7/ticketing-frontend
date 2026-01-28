"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Channel {
  name: string;
  url: string;
}

interface OfficialChannelProps {
  className?: string;
  id?: string;
  channels: Channel[];
}

export function OfficialChannel({
  className,
  id,
  channels,
}: OfficialChannelProps) {
  if (!channels || channels.length === 0) {
    return null;
  }

  return (
    <section className={cn("border-t border-border py-10", className)} id={id}>
      <div className="mx-auto max-w-300 px-5">
        <h2 className="mb-6 text-heading-medium">공식채널</h2>

        <div className="space-y-3">
          {channels.map((channel, index) => (
            <Link
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-body-medium text-[#4B5462] hover:opacity-80"
            >
              <span>{channel.name}</span>
              <ChevronRight className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
