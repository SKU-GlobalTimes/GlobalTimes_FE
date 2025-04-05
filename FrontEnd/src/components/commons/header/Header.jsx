import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState("KO");

  // 현재 경로가 "/"이면 흰색 테마 적용
  const isHome = location.pathname === "/" || 
                  location.pathname === "/intro";

  function handleMainPageClick() {
    navigate('/main', {state: {isSearch: false}});
    window.location.reload();  // 페이지 강제 새로고침
  }

  return (
    <div
      className={`${styles.header} ${
        isHome ? styles.whiteText : styles.blackText
      }`}
    >
      <p
        onClick={() => navigate("/")}
        className={location.pathname === "/" ? styles.active : ""}
      >
        GLOBAL TIMES
      </p>
      <p
        onClick={handleMainPageClick}
        className={location.pathname === "/main" ? styles.active : ""}
      >
        메인페이지
      </p>
      <p
        onClick={() => navigate("/scrap")}
        className={location.pathname === "/scrap" ? styles.active : ""}
      >
        마이스크랩
      </p>
      <p
        onClick={() => navigate("/intro")}
        className={location.pathname === "/intro" ? styles.active : ""}
      >
        서비스 소개
      </p>
      <div
        className={`${styles.languageToggle} ${
          isHome ? styles.whiteText : styles.blackText
        }`}
      >
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="KO">한국어</option>
          <option value="EN">English</option>
        </select>
      </div>
    </div>
  );
}
