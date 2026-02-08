import axiosInstance from "@/services/axios";
import type { Event } from "@/types/event";

export interface SearchCurationsParams {
  keyword?: string;
  type?: string;
  category?: string;
  page?: number;
  size?: number;
}

interface SearchCurationItem {
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

interface SearchCurationsResponse {
  curations?: SearchCurationItem[];
  content?: SearchCurationItem[];
  items?: SearchCurationItem[];
  results?: SearchCurationItem[];
  pagination?: {
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
  };
  totalElements?: number;
  totalCount?: number;
  total?: number;
  totalPages?: number;
}

const mapTypeLabel = (type?: string) => {
  if (!type) return "";
  const upper = type.toUpperCase();
  if (upper === "EXHIBITION") return "전시";
  if (upper === "POPUP") return "팝업";
  return type;
};

export async function searchCurations(params: SearchCurationsParams) {
  const response = await axiosInstance.get<SearchCurationsResponse>(
    "/curations/search",
    { params }
  );
  const data = response.data;
  const list =
    data?.curations ??
    data?.content ??
    data?.items ??
    data?.results ??
    [];
  const total =
    data?.pagination?.totalElements ??
    data?.totalElements ??
    data?.totalCount ??
    data?.total ??
    list.length;
  const totalPages =
    data?.pagination?.totalPages ??
    data?.totalPages ??
    Math.max(1, Math.ceil(total / (params.size || 10)));

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

  return {
    events,
    total,
    totalPages,
  };
}
