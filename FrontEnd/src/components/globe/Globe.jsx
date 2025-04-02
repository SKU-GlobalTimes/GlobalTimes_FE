import { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import countries from "world-countries";
import TrendModal from "./TrendModal";
import NewsModal from "./NewsModal";

const GlobeComponent = () => {
  const globeRef = useRef(null); // 지구본을 표시할 DOM 요소의 참조
  const trendModalRef = useRef(null); // 트렌드 모달의 DOM 요소 참조
  const newsModalRef = useRef(null); // 뉴스 모달의 DOM 요소 참조
  const [selectedCountry, setSelectedCountry] = useState(null); // 선택한 국가 상태
  const [selectedNews, setSelectedNews] = useState(null); // 선택한 뉴스 상태

  useEffect(() => {
    // 지구본 초기화 및 설정 (한 번만 실행)
    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg") // 지구 텍스처
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png") // 지형 정보
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png") // 배경 이미지
      .pointOfView({ lat: 0, lng: 0, altitude: 2 }); // 초기 카메라 위치 설정

    // 자동 회전 활성화 (지구가 천천히 회전)
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5; // 회전 속도 조정

    // 각 나라별 마커(포인트) 데이터 생성
    const markers = countries.map((country) => ({
      lat: country.latlng[0], // 위도
      lng: country.latlng[1], // 경도
      name: country.name.common, // 나라 이름
    }));

    // 마커 설정
    globe
      .pointsData(markers) // 마커 데이터 적용
      .pointLat((d) => d.lat) // 위도 설정
      .pointLng((d) => d.lng) // 경도 설정
      .pointAltitude(() => 0) // 지구 표면에 밀착 (2D)
      .pointRadius(() => 0.8) // 마커 크기 설정
      .pointColor(() => "rgba(125, 231, 50, 0.5)") // 마커 색상 (반투명 초록색)
      .pointResolution(10) // 원형 마커 해상도 조정
      .onPointClick((marker) => setSelectedCountry(marker.name)); // 마커 클릭 시 해당 국가 선택

    // 모달 외부 클릭 시 닫히도록 이벤트 리스너 추가
    const handleClickOutside = (event) => {
      // 뉴스 모달 내부를 클릭하면 아무 동작도 하지 않음
      if (newsModalRef.current && newsModalRef.current.contains(event.target)) {
        return;
      }
      // 트렌드 모달 내부를 클릭하면 아무 동작도 하지 않음
      if (trendModalRef.current && trendModalRef.current.contains(event.target)) {
        return;
      }
      // 외부를 클릭하면 모든 모달 닫기
      setSelectedCountry(null);
      setSelectedNews(null);
    };

    document.addEventListener("mousedown", handleClickOutside); // 클릭 이벤트 감지
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 이벤트 제거 (클린업)
    };
  }, []); // 빈 배열 -> 최초 1회 실행 (지구본이 불필요하게 새로고침되는 것 방지)

  return (
    <div>
      {/* 지구본을 표시할 영역 */}
      <div ref={globeRef} style={{ width: "100%", height: "500px" }} />

      {/* 트렌드 모달 (나라 선택 시 표시) */}
      {selectedCountry && (
        <div ref={trendModalRef}>
          <TrendModal
            country={selectedCountry} // 선택한 나라 정보 전달
            onSelect={(trend) => setSelectedNews(trend)} // 트렌드 선택 시 뉴스 모달 열기
            onClose={() => setSelectedCountry(null)} // 닫기 버튼 클릭 시 모달 닫기
          />
        </div>
      )}

      {/* 뉴스 모달 (트렌드 선택 시 표시) */}
      {selectedNews && (
        <div ref={newsModalRef}>
          <NewsModal
            trend={selectedNews} // 선택한 뉴스 정보 전달
            onClose={() => setSelectedNews(null)} // 닫기 버튼 클릭 시 뉴스 모달 닫기
          />
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
