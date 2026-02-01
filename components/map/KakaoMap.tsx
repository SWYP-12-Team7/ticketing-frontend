"use client";

import { Map, MapMarker, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";

interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

interface KakaoMapProps {
  center?: { lat: number; lng: number };
  level?: number;
  locations?: Location[];
  onMarkerClick?: (location: Location) => void;
  className?: string;
  enableClustering?: boolean;
}

export function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  level = 5,
  locations = [],
  onMarkerClick,
  className = "h-full w-full",
  enableClustering = false,
}: KakaoMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "",
    libraries: ["clusterer"],
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <p className="text-sm text-muted-foreground">
          지도를 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  if (!enableClustering) {
    return (
      <Map center={center} level={level} className={className}>
        {locations.map((location) => (
          <MapMarker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.title}
            onClick={() => onMarkerClick?.(location)}
          />
        ))}
      </Map>
    );
  }

  const clusterStyles = [
    // 50 미만
    {
      width: "40px",
      height: "40px",
      background: "#FA7228",
      borderRadius: "50%",
      border: "2px solid #FFFFFF",
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center" as const,
      lineHeight: "36px",
    },
    // 50 이상
    {
      width: "50px",
      height: "50px",
      background: "#0062FF",
      borderRadius: "50%",
      border: "2px solid #FFFFFF",
      color: "#FFFFFF",
      fontSize: "16px",
      fontWeight: "500",
      textAlign: "center" as const,
      lineHeight: "46px",
    },
  ];

  return (
    <Map center={center} level={level} className={className}>
      <MarkerClusterer
        averageCenter={true}
        minLevel={5}
        styles={clusterStyles}
        calculator={[50]}
      >
        {locations.map((location) => (
          <MapMarker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => onMarkerClick?.(location)}
          />
        ))}
      </MarkerClusterer>
    </Map>
  );
}
