import axiosInstance from "@/services/axios";
import type { PopularResponse } from "@/types/popular";
import type { MainResponse } from "@/types/main";

const USE_MOCK_MAIN = process.env.NEXT_PUBLIC_USE_MOCK_MAIN === "true";

const MOCK_POPULAR: PopularResponse = {
  result: "SUCCESS",
  data: {
    popup: {
      daily: [
        {
          rank: 1,
          id: 901,
          title: "브랜드 팝업 스토어",
          thumbnail: "https://picsum.photos/seed/pop-daily-901/400/560",
          address: "서울 성수",
          period: "2026.02.10 - 2026.02.28",
        },
        {
          rank: 2,
          id: 902,
          title: "캐릭터 굿즈 팝업",
          thumbnail: "https://picsum.photos/seed/pop-daily-902/400/560",
          address: "서울 홍대",
          period: "2026.02.12 - 2026.03.01",
        },
        {
          rank: 3,
          id: 903,
          title: "뷰티 체험 팝업",
          thumbnail: "https://picsum.photos/seed/pop-daily-903/400/560",
          address: "서울 강남",
          period: "2026.02.15 - 2026.03.05",
        },
      ],
      weekly: [
        {
          rank: 1,
          id: 904,
          title: "라이프스타일 팝업",
          thumbnail: "https://picsum.photos/seed/pop-week-904/400/560",
          address: "서울 성수",
          period: "2026.02.01 - 2026.02.20",
        },
        {
          rank: 2,
          id: 905,
          title: "테크 체험 팝업",
          thumbnail: "https://picsum.photos/seed/pop-week-905/400/560",
          address: "서울 송파",
          period: "2026.02.08 - 2026.02.25",
        },
        {
          rank: 3,
          id: 906,
          title: "푸드 팝업 마켓",
          thumbnail: "https://picsum.photos/seed/pop-week-906/400/560",
          address: "서울 마포",
          period: "2026.02.05 - 2026.02.22",
        },
      ],
      monthly: [
        {
          rank: 1,
          id: 907,
          title: "대형 브랜드 팝업",
          thumbnail: "https://picsum.photos/seed/pop-month-907/400/560",
          address: "서울 강남",
          period: "2026.02.01 - 2026.02.28",
        },
        {
          rank: 2,
          id: 908,
          title: "캐릭터 팝업 페어",
          thumbnail: "https://picsum.photos/seed/pop-month-908/400/560",
          address: "서울 용산",
          period: "2026.02.03 - 2026.02.27",
        },
        {
          rank: 3,
          id: 909,
          title: "패션 팝업 위크",
          thumbnail: "https://picsum.photos/seed/pop-month-909/400/560",
          address: "서울 성수",
          period: "2026.02.06 - 2026.03.02",
        },
      ],
    },
    exhibition: {
      daily: [
        {
          rank: 1,
          id: 951,
          title: "현대미술 특별전",
          thumbnail: "https://picsum.photos/seed/exh-daily-951/400/560",
          address: "서울 종로",
          period: "2026.02.01 - 2026.03.10",
        },
        {
          rank: 2,
          id: 952,
          title: "사진전: 도시의 순간",
          thumbnail: "https://picsum.photos/seed/exh-daily-952/400/560",
          address: "서울 용산",
          period: "2026.02.05 - 2026.03.12",
        },
        {
          rank: 3,
          id: 953,
          title: "일러스트 기획전",
          thumbnail: "https://picsum.photos/seed/exh-daily-953/400/560",
          address: "서울 마포",
          period: "2026.02.07 - 2026.03.08",
        },
      ],
      weekly: [
        {
          rank: 1,
          id: 954,
          title: "디자인 아카이브전",
          thumbnail: "https://picsum.photos/seed/exh-week-954/400/560",
          address: "서울 성동",
          period: "2026.02.02 - 2026.03.20",
        },
        {
          rank: 2,
          id: 955,
          title: "조각의 흐름전",
          thumbnail: "https://picsum.photos/seed/exh-week-955/400/560",
          address: "서울 서초",
          period: "2026.02.10 - 2026.03.30",
        },
        {
          rank: 3,
          id: 956,
          title: "설치미술전",
          thumbnail: "https://picsum.photos/seed/exh-week-956/400/560",
          address: "서울 강남",
          period: "2026.02.12 - 2026.03.25",
        },
      ],
      monthly: [
        {
          rank: 1,
          id: 957,
          title: "사진 아트 페스티벌",
          thumbnail: "https://picsum.photos/seed/exh-month-957/400/560",
          address: "서울 용산",
          period: "2026.02.01 - 2026.03.31",
        },
        {
          rank: 2,
          id: 958,
          title: "현대미술 컬렉션",
          thumbnail: "https://picsum.photos/seed/exh-month-958/400/560",
          address: "서울 종로",
          period: "2026.02.03 - 2026.03.28",
        },
        {
          rank: 3,
          id: 959,
          title: "일러스트 페어",
          thumbnail: "https://picsum.photos/seed/exh-month-959/400/560",
          address: "서울 마포",
          period: "2026.02.06 - 2026.03.22",
        },
      ],
    },
  },
};

export async function getMain() {
  const response = await axiosInstance.get<MainResponse>("/main");
  return response.data;
}

export async function getPopular(limit: number = 10) {
  if (USE_MOCK_MAIN) return MOCK_POPULAR;
  const response = await axiosInstance.get<PopularResponse>(
    "/main/popular",
    { params: { limit } }
  );
  return response.data;
}
