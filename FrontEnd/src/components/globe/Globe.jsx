import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import TrendModal from "./TrendModal";
import NewsModal from "./NewsModal";
import { getTrend } from "../../api/landingPageAPI";
import styles from "./Globe.module.css";
import { getApiErrorMessage } from "../../api/apiClient";

const BASE_THETA = 0.3;

// BE에서 실제 트렌드를 수집하는 26개 지원 국가
const COUNTRY_MARKERS = {
  KR: { lat: 35.9, lng: 127.8, name: "South Korea" },
  JP: { lat: 36.2, lng: 138.3, name: "Japan" },
  HK: { lat: 22.4, lng: 114.1, name: "Hong Kong" },
  TW: { lat: 23.7, lng: 121.0, name: "Taiwan" },
  SG: { lat: 1.4, lng: 103.8, name: "Singapore" },
  MY: { lat: 4.2, lng: 108.0, name: "Malaysia" },
  ID: { lat: -0.8, lng: 113.9, name: "Indonesia" },
  IN: { lat: 20.6, lng: 79.1, name: "India" },
  AU: { lat: -25.3, lng: 133.8, name: "Australia" },
  US: { lat: 37.1, lng: -95.7, name: "United States" },
  CA: { lat: 56.1, lng: -106.3, name: "Canada" },
  MX: { lat: 23.6, lng: -102.6, name: "Mexico" },
  BR: { lat: -14.2, lng: -51.9, name: "Brazil" },
  CO: { lat: 4.6, lng: -74.1, name: "Colombia" },
  GB: { lat: 55.4, lng: -3.4, name: "United Kingdom" },
  FR: { lat: 46.2, lng: 2.2, name: "France" },
  DE: { lat: 51.2, lng: 10.5, name: "Germany" },
  IT: { lat: 41.9, lng: 12.6, name: "Italy" },
  ES: { lat: 40.5, lng: -3.7, name: "Spain" },
  NL: { lat: 52.1, lng: 5.3, name: "Netherlands" },
  AT: { lat: 47.5, lng: 14.6, name: "Austria" },
  DK: { lat: 56.3, lng: 9.5, name: "Denmark" },
  GR: { lat: 39.1, lng: 21.8, name: "Greece" },
  RU: { lat: 61.5, lng: 105.3, name: "Russia" },
  TR: { lat: 38.9, lng: 35.2, name: "Turkey" },
  EG: { lat: 26.8, lng: 30.8, name: "Egypt" },
};

const GlobeComponent = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const labelElsRef = useRef({});
  const phiRef = useRef(0);
  const thetaRef = useRef(BASE_THETA);
  const trendModalRef = useRef(null);
  const newsModalRef = useRef(null);
  const markerInteractionRef = useRef({
    hovered: new Set(),
    focused: new Set(),
  });
  /** 연속 국가 클릭 시 마지막 요청만 반영 (레이스 방지) */
  const trendFetchGenRef = useRef(0);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [now, setNow] = useState(new Date());

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const city = timezone.split("/").pop().replace(/_/g, " ");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const getSize = () => ({
      w: container.offsetWidth,
      h: container.offsetHeight,
    });
    const { w, h } = getSize();

    // cobe 마커에 id 부여 → CSS 앵커 포지셔닝용 --cobe-{id} 변수 생성
    const cobeMarkers = Object.entries(COUNTRY_MARKERS).map(
      ([code, { lat, lng }]) => ({
        location: [lat, lng],
        size: 0.03,
        id: code.toLowerCase(),
      }),
    );

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: w * 2,
      height: h * 2,
      phi: 0,
      theta: BASE_THETA,
      dark: 1,
      diffuse: 1.5,
      mapSamples: 12000,
      mapBrightness: 3.5,
      mapBaseBrightness: 0.05,
      baseColor: [0.12, 0.18, 0.38],
      markerColor: [0.98, 0.82, 0.2],
      glowColor: [0.6, 0.65, 1.0],
      markers: cobeMarkers,
    });

    let phi = 0;
    let currentTheta = BASE_THETA;
    let targetTheta = BASE_THETA;
    let autoRotate = true;
    let rafId;

    const animate = () => {
      const { hovered, focused } = markerInteractionRef.current;
      if (autoRotate && hovered.size === 0 && focused.size === 0) {
        phi += 0.003;
      }
      currentTheta += (targetTheta - currentTheta) * 0.08;
      phiRef.current = phi;
      thetaRef.current = currentTheta;
      globe.update({ phi, theta: currentTheta });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    let dragStartX = null;
    let dragStartPhi = 0;
    let didDrag = false;

    const onPointerDown = (e) => {
      dragStartX = e.clientX;
      dragStartPhi = phi;
      didDrag = false;
      autoRotate = false;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (dragStartX !== null) {
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) > 4) didDrag = true;
        phi = dragStartPhi + dx * 0.006;
        phiRef.current = phi;
        globe.update({ phi, theta: currentTheta });
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const y = (e.clientY - rect.top) / rect.height;
      targetTheta = BASE_THETA + (y - 0.5) * 0.5;

      // 라벨 DOM 실제 위치 기준으로 hover cursor 설정
      let near = false;
      for (const el of Object.values(labelElsRef.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (
          e.clientX >= r.left - 12 &&
          e.clientX <= r.right + 12 &&
          e.clientY >= r.top - 12 &&
          e.clientY <= r.bottom + 12
        ) {
          near = true;
          break;
        }
      }
      canvas.style.cursor = near ? "pointer" : "default";
    };

    const onPointerUp = (e) => {
      const wasDrag = didDrag;
      dragStartX = null;
      autoRotate = true;
      if (!wasDrag) {
        // 라벨 DOM 실제 위치로 클릭 감지 (수식 오차 없음)
        let bestCode = null;
        let minDist = Infinity;
        const THRESHOLD = 50;
        for (const [code, el] of Object.entries(labelElsRef.current)) {
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const d = Math.hypot(e.clientX - cx, e.clientY - cy);
          if (d < THRESHOLD && d < minDist) {
            minDist = d;
            bestCode = code;
          }
        }
        if (bestCode) {
          setSelectedCountry(bestCode);
        } else {
          setSelectedCountry(null);
          setTrendData(null);
          setSelectedNews(null);
        }
      }
    };

    const onPointerLeave = () => {
      dragStartX = null;
      autoRotate = true;
      targetTheta = BASE_THETA;
    };

    const onDocMouseDown = (e) => {
      if (e.target === canvas) return;
      if (trendModalRef.current?.contains(e.target)) return;
      if (newsModalRef.current?.contains(e.target)) return;
      setSelectedCountry(null);
      setTrendData(null);
      setSelectedNews(null);
    };

    const onResize = () => {
      const { w: nw, h: nh } = getSize();
      globe.update({ width: nw * 2, height: nh * 2 });
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("mousedown", onDocMouseDown);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("mousedown", onDocMouseDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    // 국가가 없다 : 마커 선택 x , 모달창을 닫은 경우 전부 포함 : 분기 해당

    const gen = ++trendFetchGenRef.current;
    setTrendData(null); // 이전 요청 취소를 위해 데이터 초기화
    // 선택된 국가가 변경되었는데도 Trend Data 는 아직 이전 요청의 결과일 수 있기 때문임.

    const controller = new AbortController(); // 요청 취소를 위해 AbortController 생성

    getTrend(selectedCountry, { signal: controller.signal })
      .then((data) => {
        if (gen !== trendFetchGenRef.current) return;
        setTrendData(data);
      })
      .catch((err) => {
        if (
          // Optional Chaining 공부해보기
          err?.code === "ERR_CANCELED" ||
          err?.name === "CanceledError" ||
          err?.name === "AbortError"
        ) {
          return;
        }
        if (gen !== trendFetchGenRef.current) return;
        setTrendData({
          isSuccess: false,
          data: [],
          timestamp: new Date().toISOString(),
          message: getApiErrorMessage(err, "트렌드 정보를 불러오지 못했습니다."),
        });
      });

    return () => controller.abort();
  }, [selectedCountry]);

  return (
    <div ref={containerRef} className={styles.globeContainer}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      {/* cobe CSS 앵커 포지셔닝: --cobe-{id} 앵커에 자동 부착 */}
      {Object.entries(COUNTRY_MARKERS).map(([code, { name }]) => (
        <button
          type="button"
          key={code}
          ref={(el) => {
            labelElsRef.current[code] = el;
          }}
          className={styles.markerLabel}
          data-name={name}
          aria-label={`${name} trends`}
          style={{
            positionAnchor: `--cobe-${code.toLowerCase()}`,
            opacity: `var(--cobe-visible-${code.toLowerCase()}, 0)`,
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseEnter={() => {
            markerInteractionRef.current.hovered.add(code);
          }}
          onMouseLeave={() => {
            markerInteractionRef.current.hovered.delete(code);
          }}
          onFocus={() => {
            markerInteractionRef.current.focused.add(code);
          }}
          onBlur={() => {
            markerInteractionRef.current.focused.delete(code);
          }}
          onClick={() => setSelectedCountry(code)}
        >
          <img
            src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
            alt={name}
            className={styles.flagImg}
            draggable={false}
          />
          <span className={styles.flagName}>{name}</span>
        </button>
      ))}

      {/* 좌측 하단 실시간 로컬 시계 */}
      <div className={styles.clockWidget}>
        <div className={styles.clockCity}>{city}</div>
        <div className={styles.clockTime}>
          {now.toLocaleTimeString("en-GB", { hour12: false })}
        </div>
        <div className={styles.clockDate}>
          {now.toLocaleDateString("en-GB", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className={styles.clockTz}>{timezone}</div>
      </div>

      {selectedCountry && trendData && (
        <div ref={trendModalRef}>
          <TrendModal
            country={COUNTRY_MARKERS[selectedCountry].name}
            trends={trendData.data}
            timestamp={trendData.timestamp}
            errorMessage={trendData.isSuccess === false ? trendData.message : ""}
            onSelect={(news) => setSelectedNews(news)}
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
