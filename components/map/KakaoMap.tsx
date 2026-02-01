"use client";

import { useState, useRef } from "react";
import { Map, MapMarker, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { LocateFixed } from "lucide-react";

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
  showMyLocation?: boolean;
}

export function KakaoMap({
  center: initialCenter = { lat: 37.5665, lng: 126.978 },
  level: initialLevel = 5,
  locations = [],
  onMarkerClick,
  className = "h-full w-full",
  enableClustering = false,
  showMyLocation = true,
}: KakaoMapProps) {
  const [center, setCenter] = useState(initialCenter);
  const [level, setLevel] = useState(initialLevel);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<kakao.maps.Map>(null);


  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "",
    libraries: ["clusterer"],
  });

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMyLocation(newCenter);
        setCenter(newCenter);
        setLevel(3);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert("위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.");
        } else {
          alert("위치를 가져올 수 없습니다.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

  const MyLocationButton = () => (
    showMyLocation && (
      <button
        type="button"
        onClick={handleMyLocation}
        disabled={isLocating}
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50 disabled:opacity-50"
        aria-label="내 위치"
      >
        <LocateFixed className={`h-5 w-5 text-gray-700 ${isLocating ? "animate-pulse" : ""}`} />
      </button>
    )
  );

  const MyLocationMarker = () => (
    myLocation && (
      <MapMarker
        position={myLocation}
        image={{
          src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
          size: { width: 32, height: 32 },
        }}
      />
    )
  );

  if (!enableClustering) {
    return (
      <div className={`relative ${className}`}>
        <Map
          center={center}
          level={level}
          className="h-full w-full"
          ref={mapRef}
          onCenterChanged={(map) => setCenter({ lat: map.getCenter().getLat(), lng: map.getCenter().getLng() })}
          onZoomChanged={(map) => setLevel(map.getLevel())}
        >
          {locations.map((location) => (
            <MapMarker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              title={location.title}
              onClick={() => onMarkerClick?.(location)}
            />
          ))}
          <MyLocationMarker />
        </Map>
        <MyLocationButton />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Map
        center={center}
        level={level}
        className="h-full w-full"
        ref={mapRef}
        onCenterChanged={(map) => setCenter({ lat: map.getCenter().getLat(), lng: map.getCenter().getLng() })}
        onZoomChanged={(map) => setLevel(map.getLevel())}
      >
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
        <MyLocationMarker />
      </Map>
      <MyLocationButton />
    </div>
  );
}
