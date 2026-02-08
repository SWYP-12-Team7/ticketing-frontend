export type CurationType = "EXHIBITION" | "POPUP";

export interface CurationDetailResponse {
  exhibitionId?: number;
  popupId?: number;
  title: string;
  subTitle: string;
  thumbnail: string;
  region: string;
  place: string;
  address: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
  url: string;
  description: string;
  image: string;
  noticeText?: string;
  noticeImageUrl?: string;
  reservationStatus: "ALL" | "FREE" | "PAID" | string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
}
