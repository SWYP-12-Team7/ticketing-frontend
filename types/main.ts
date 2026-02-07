export interface MainCuration {
  id: number;
  type: "POPUP" | "EXHIBITION";
  title: string;
  subTitle: string | null;
  thumbnail: string;
  region: string;
  place: string;
  startDate: string;
  endDate: string;
  category: string[];
  dDay: number;
}

export interface MainResponse {
  result: "SUCCESS" | "FAIL";
  data: {
    userCurations: MainCuration[];
    upcomingCurations: MainCuration[];
    freeCurations: MainCuration[];
    todayOpenCurations: MainCuration[];
  };
}
