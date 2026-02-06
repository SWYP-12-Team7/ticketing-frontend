import axiosInstance from "@/services/axios";

export async function getMain() {
  const response = await axiosInstance.get("/main");
  return response.data;
}
