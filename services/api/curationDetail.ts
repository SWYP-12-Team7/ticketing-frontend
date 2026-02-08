import axiosInstance from "@/services/axios";
import type { CurationDetailResponse, CurationType } from "@/types/curationDetail";

export async function getExhibitionDetail(exhibitionId: string | number) {
  const response = await axiosInstance.get<CurationDetailResponse>(
    `/exhibitions/${exhibitionId}`
  );
  return response.data;
}

export async function getPopupDetail(popupId: string | number) {
  const response = await axiosInstance.get<CurationDetailResponse>(
    `/popups/${popupId}`
  );
  return response.data;
}

export async function getCurationDetail(
  id: string | number,
  type: CurationType
) {
  return type === "POPUP" ? getPopupDetail(id) : getExhibitionDetail(id);
}
