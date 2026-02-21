import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import type { CarouselCardData } from "@/components/home/CarouselCard";

interface ExhibitionItem {
  exhibitionId: number;
  title: string;
  subTitle: string | null;
  thumbnail: string;
  region: string;
  place: string;
  startDate: string;
  endDate: string;
  tags: string[];
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
}

interface ExhibitionsResponse {
  exhibitions: ExhibitionItem[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export function useCarouselData() {
  return useQuery({
    queryKey: ["carousel-exhibitions"],
    queryFn: async (): Promise<CarouselCardData[]> => {
      const res = await axiosInstance.get<ExhibitionsResponse>(
        "/exhibitions",
        { params: { size: 5, page: 0 } }
      );

      return res.data.exhibitions.map((item) => ({
        id: item.exhibitionId,
        imageUrl: item.thumbnail,
        subtitle: item.place || item.region,
        title: item.title,
        period: `${item.startDate.replace(/-/g, ".")} - ${item.endDate.replace(/-/g, ".")}`,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
