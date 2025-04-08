import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import Logo from "../../../assets/logo/logo.png";
import { useLanguage } from "../../../util/LanguageContext.jsx";
import TranslatedText from '../../../api/TranslatedText.jsx';

//import GoogleTranslate from "../../../api/GoogleTranslate";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // 전역으로 언어를 선택하는 함수
  const { language, setLanguage } = useLanguage();



  // 현재 경로가 "/"이면 흰색 테마 적용
  const isHome = location.pathname === "/" || 
                  location.pathname === "/intro";

  function handleMainPageClick() {
    navigate("/main", { state: { isSearch: false } });
    window.location.reload(); // 페이지 강제 새로고침
  }

  return (
    <div
      className={`${styles.header} ${
        isHome ? styles.whiteText : styles.blackText
      } ${isHome ? styles.blackBackground : styles.whiteBackground}`}
    >
      <div className={styles.logoContainer}>
        <img
          src={Logo}
          className={styles.image}
          onClick={() => navigate("/")}
        />
      </div>
      <p
        onClick={handleMainPageClick}
        className={location.pathname === "/main" ? styles.active : ""}
      >
        <TranslatedText text="메인페이지"/>
      </p>
      <p
        onClick={() => navigate("/scrap")}
        className={location.pathname === "/scrap" ? styles.active : ""}
      >
        <TranslatedText text="마이스크랩"/>
      </p>
      <p
        onClick={() => navigate("/intro")}
        className={location.pathname === "/intro" ? styles.active : ""}
      >
        <TranslatedText text="서비스 소개"/>
      </p>
      <div
        className={`${styles.languageToggle} ${
          isHome ? styles.whiteText : styles.blackText
        }`}
      >
        {/* 언어선택 */}
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="zh-CN">中文</option>
        </select>
      </div>
    </div>
  );
}
