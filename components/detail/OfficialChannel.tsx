"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
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
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="mb-6 text-lg font-bold text-foreground">공식채널</h2>

        <div className="space-y-2">
          {channels.map((channel, index) => (
            <Link
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#6A8DFF] hover:underline"
            >
              {channel.name}
              <ExternalLink className="size-3" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
