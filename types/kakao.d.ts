declare namespace kakao.maps {
  class Map {
    getCenter(): LatLng;
    getLevel(): number;
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
  }

  class LatLng {
    getLat(): number;
    getLng(): number;
  }
}
