import { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import countries from "world-countries";
import TrendModal from "./TrendModal";
import NewsModal from "./NewsModal";
import { getTrend } from "../../api/landingPageAPI";

const countryCodeMap = {
  KR: "한국",
  AU: "호주",
  AT: "오스트리아",
  BR: "브라질",
  CA: "캐나다",
  CO: "콜롬비아",
  DK: "덴마크",
  EG: "이집트",
  FR: "프랑스",
  DE: "독일",
  GR: "그리스",
  HK: "홍콩",
  IN: "인도",
  ID: "인도네시아",
  IT: "이탈리아",
  JP: "일본",
  MY: "말레이시아",
  MX: "멕시코",
  NL: "네덜란드",
  RU: "러시아",
  SG: "싱가포르",
  TW: "대만",
  TR: "터키",
  GB: "영국",
  US: "미국",
  ES: "스페인",
};

const GlobeComponent = () => {
  const globeRef = useRef(null);
  const trendModalRef = useRef(null);
  const newsModalRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null); // 선택한 국가 코드
  const [trendData, setTrendData] = useState(null); // 트렌드 데이터 상태
  const [selectedNews, setSelectedNews] = useState(null); // 선택한 뉴스 상태

  useEffect(() => {
    // 지구본 초기화
    const globe = Globe()(globeRef.current)
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
      .pointOfView({ lat: 0, lng: 0, altitude: 2 });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    // 마커 데이터 설정
    const markers = countries.map((country) => ({
      lat: country.latlng[0],
      lng: country.latlng[1],
      countryCode: country.cca2,
      label: country.name.common,
    }));

    globe
      .pointsData(markers)
      .pointLat((d) => d.lat)
      .pointLng((d) => d.lng)
      .pointAltitude(() => 0)
      .pointRadius(() => 0.8)
      .pointColor(() => "rgba(125, 231, 50, 0.5)")
      .pointResolution(10)
      .pointLabel((d) => d.label)
      .onPointClick((marker) => {
        const countryCode = marker.countryCode;
        if (countryCodeMap[countryCode]) {
          setSelectedCountry(countryCode);
        }
      });

    const handleResize = () => {
      globe.width([globeRef.current.offsetWidth]);
      globe.height([globeRef.current.offsetHeight]);
    };
  
    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 사이즈 설정

    // 모달 외부 클릭 시 닫기
    const handleClickOutside = (event) => {
      if (newsModalRef.current && newsModalRef.current.contains(event.target)) {
        return;
      }
      if (
        trendModalRef.current &&
        trendModalRef.current.contains(event.target)
      ) {
        return;
      }
      setSelectedCountry(null);
      setSelectedNews(null);
      setTrendData(null); // 모달 닫을 때 트렌드 데이터 초기화
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 선택한 국가의 트렌드 데이터 불러오기
  useEffect(() => {
    if (selectedCountry) {
      setTrendData(null); // 새로운 데이터 요청 전 초기화
      getTrend(selectedCountry)
        .then((data) => setTrendData(data))
        .catch(() => setTrendData([])); // 에러 발생 시 빈 배열 처리
    }
  }, [selectedCountry]);

  return (
    <div>
      {/* 지구본 표시 */}
      <div ref={globeRef} style={{ width: "100vw", height: "100vh" }} />

      {selectedCountry && trendData && (
        <div ref={trendModalRef}>
          <TrendModal
            country={countryCodeMap[selectedCountry]}
            trends={trendData.data} // data 배열 전달
            timestamp={trendData.timestamp} // timestamp 전달
            onSelect={(news) => setSelectedNews(news)}
            onClose={() => setSelectedCountry(null)}
          />
        </div>
      )}

      {selectedNews && (
        <div ref={newsModalRef}>
          <NewsModal
            news={selectedNews}
            onClose={() => setSelectedNews(null)}
          />
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
