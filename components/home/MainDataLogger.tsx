"use client";

import { useEffect } from "react";
import { useMain } from "@/queries/main";

export function MainDataLogger() {
  const { data, error, isLoading } = useMain();

  useEffect(() => {
    if (data) {
      console.log("✅ /main 응답:", data);
    }
    if (error) {
      console.error("❌ /main 에러:", error);
    }
  }, [data, error]);

  if (isLoading) {
    console.log("⏳ /main 로딩 중...");
  }

  return null;
}
