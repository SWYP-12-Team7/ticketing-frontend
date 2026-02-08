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
  subCategory?: string;
  period?: string;
}

export async function getMapCurations(params: MapCurationsParams) {
  const { date, region, category, subCategory } = params;
  const requestParams = {
    date,
    region,
    category: subCategory || category,
  };
  const response = await axiosInstance.get<MapCurationsResponse>(
    "/curations/map",
    { params: requestParams }
  );
  return response.data.items ?? [];
}
