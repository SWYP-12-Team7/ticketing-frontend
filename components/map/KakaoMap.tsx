"use client";

import { useState, useRef, useCallback } from "react";
import { Map, MapMarker, MarkerClusterer, ZoomControl, useKakaoLoader } from "react-kakao-maps-sdk";
import { LocateFixed, Search, X } from "lucide-react";

interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

interface SearchResult {
  id: string;
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface KakaoMapProps {
  center?: { lat: number; lng: number };
  level?: number;
  maxLevel?: number;
  locations?: Location[];
  onMarkerClick?: (location: Location) => void;
  onMarkerHover?: (location: Location | null) => void;
  onClusterClick?: (locationIds: string[]) => void;
  onVisibleLocationIdsChange?: (locationIds: string[]) => void;
  className?: string;
  showMyLocation?: boolean;
  showSearch?: boolean;
}

export function KakaoMap({
  center: initialCenter = { lat: 37.5665, lng: 126.978 },
  level: initialLevel = 5,
  maxLevel = 12,
  locations = [],
  onMarkerClick,
  onMarkerHover,
  onClusterClick,
  onVisibleLocationIdsChange,
  className = "h-full w-full",
  showMyLocation = true,
  showSearch = true,
}: KakaoMapProps) {
  const [center, setCenter] = useState(initialCenter);
  const [level, setLevel] = useState(initialLevel);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const mapRef = useRef<kakao.maps.Map>(null);
  const markerIdMapRef = useRef(new WeakMap<kakao.maps.Marker, string>());

  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "",
    libraries: ["clusterer", "services"],
  });

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchQuery, (data, status) => {
      setIsSearching(false);
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(data as unknown as SearchResult[]);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    });
  }, [searchQuery, isSearching]);

  const handleSelectResult = (result: SearchResult) => {
    const newCenter = {
      lat: parseFloat(result.y),
      lng: parseFloat(result.x),
    };
    setCenter(newCenter);
    setLevel(3);
    setShowResults(false);
    setSearchQuery(result.place_name);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const emitVisibleLocationIds = useCallback(
    (map: kakao.maps.Map) => {
      if (!onVisibleLocationIdsChange) return;
      const bounds = map.getBounds();
      const ids = locations
        .filter((location) =>
          bounds.contain(new kakao.maps.LatLng(location.lat, location.lng))
        )
        .map((location) => location.id);
      onVisibleLocationIdsChange(ids);
    },
    [locations, onVisibleLocationIdsChange]
  );

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

  const myLocationButton = showMyLocation && (
    <button
      type="button"
      onClick={handleMyLocation}
      disabled={isLocating}
      className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50 disabled:opacity-50"
      aria-label="내 위치"
    >
      <LocateFixed className={`h-5 w-5 text-gray-700 ${isLocating ? "animate-pulse" : ""}`} />
    </button>
  );

  const myLocationMarker = myLocation && (
    <MapMarker
      position={myLocation}
      image={{
        src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
        size: { width: 32, height: 32 },
      }}
    />
  );

  const searchBox = showSearch && (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-80">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="장소 검색"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-20 text-sm shadow-md focus:border-orange focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-orange p-1.5 text-white hover:bg-orange/90 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {showResults && searchResults.length > 0 && (
        <ul className="mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md">
          {searchResults.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-900">{result.place_name}</p>
                <p className="text-xs text-gray-500">{result.address_name}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {searchBox}
      <Map
        center={center}
        level={level}
        maxLevel={maxLevel}
        className="h-full w-full"
        ref={mapRef}
        onCenterChanged={(map) => setCenter({ lat: map.getCenter().getLat(), lng: map.getCenter().getLng() })}
        onZoomChanged={(map) => setLevel(map.getLevel())}
        onIdle={emitVisibleLocationIds}
      >
        <MarkerClusterer
          averageCenter={true}
          minLevel={7}
          styles={clusterStyles}
          calculator={[50]}
          onClusterclick={(_, cluster) => {
            // 필터링 처리 (줌인은 SDK 기본 동작)
            const markers = cluster.getMarkers();
            const ids = Array.from(
              new Set(
                markers
                  .map((marker) =>
                    marker instanceof kakao.maps.Marker
                      ? markerIdMapRef.current.get(marker) || ""
                      : ""
                  )
                  .filter((id): id is string => Boolean(id))
              )
            );

            if (onClusterClick && ids.length > 0) {
              onClusterClick(ids);
            }
          }}
        >
          {locations.map((location) => (
            <MapMarker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onCreate={(marker) => {
                markerIdMapRef.current.set(marker, location.id);
              }}
              onClick={() => onMarkerClick?.(location)}
              onMouseOver={() => onMarkerHover?.(location)}
              onMouseOut={() => onMarkerHover?.(null)}
            />
          ))}
        </MarkerClusterer>
        {myLocationMarker}
        <ZoomControl position="RIGHT" />
      </Map>
      {myLocationButton}
    </div>
  );
}
