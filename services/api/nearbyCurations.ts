import axiosInstance from "@/services/axios";
import type { Event } from "@/types/event";

interface NearbyCurationItem {
  id: number | string;
  title: string;
  thumbnail: string;
  type?: string;
  tags?: string[];
  location?: string;
  period?: string;
  viewCount?: number;
  likeCount?: number;
}

interface NearbyCurationsResponse {
  curations?: NearbyCurationItem[];
  content?: NearbyCurationItem[];
  items?: NearbyCurationItem[];
  results?: NearbyCurationItem[];
}

const mapTypeLabel = (type?: string) => {
  if (!type) return "";
  const upper = type.toUpperCase();
  if (upper === "EXHIBITION") return "전시";
  if (upper === "POPUP") return "팝업";
  return type;
};

export async function getNearbyCurations(
  curationId: string | number,
  limit: number = 10
) {
  const response = await axiosInstance.get<NearbyCurationsResponse>(
    `/curations/${curationId}/nearby`,
    { params: { limit } }
  );
  const data = response.data;
  const list =
    data?.curations ??
    data?.content ??
    data?.items ??
    data?.results ??
    [];

  const events: Event[] = list.map((item) => ({
    id: String(item.id),
    title: item.title,
    category: mapTypeLabel(item.type),
    type: item.type?.toUpperCase(),
    subcategory: item.tags?.[0],
    location: item.location,
    period: item.period || "",
    imageUrl: item.thumbnail,
    viewCount: item.viewCount ?? 0,
    likeCount: item.likeCount ?? 0,
    tags: item.tags,
  }));

  return events;
}
