import axiosInstance from "@/services/axios";

export interface MapCurationItem {
  id: number | string;
  type: "EXHIBITION" | "POPUP";
  title: string;
  thumbnail: string;
  category: string[];
  likeCount: number;
  viewCount: number;
  dateText: string;
  latitude: number;
  longitude: number;
}

interface MapCurationsResponse {
  items: MapCurationItem[];
}

export interface MapCurationsParams {
  date: string;
  region?: string;
  category?: string;
}

export async function getMapCurations(params: MapCurationsParams) {
  const response = await axiosInstance.get<MapCurationsResponse>(
    "/curations/map",
    { params }
  );
  return response.data.items ?? [];
}
