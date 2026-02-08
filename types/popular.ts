export interface PopularItem {
  rank: number;
  id: number;
  title: string;
  thumbnail: string;
  address: string;
  period: string;
}

export type PopularPeriod = "daily" | "weekly" | "monthly";

export interface PopularCategoryData {
  daily: PopularItem[];
  weekly: PopularItem[];
  monthly: PopularItem[];
}

export interface PopularResponse {
  result: string;
  data: {
    popup: PopularCategoryData;
    exhibition: PopularCategoryData;
  };
}
