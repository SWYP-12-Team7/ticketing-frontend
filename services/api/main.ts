import axiosInstance from "@/services/axios";
import type { PopularResponse } from "@/types/popular";

export async function getMain() {
  const response = await axiosInstance.get("/main");
  return response.data;
}

export async function getPopular(limit: number = 10) {
  const response = await axiosInstance.get<PopularResponse>(
    "/main/popular",
    { params: { limit } }
  );
  return response.data;
}
