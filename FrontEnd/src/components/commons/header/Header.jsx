import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import Logo from "../../../assets/logo/logo.png";
import { useLanguage } from "../../../util/LanguageContext.jsx";
import TranslatedText from "../../../api/TranslatedText.jsx";

//import GoogleTranslate from "../../../api/GoogleTranslate";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // 전역으로 언어를 선택하는 함수
  const { language, setLanguage } = useLanguage();

  // 현재 경로가 "/"이면 흰색 테마 적용
  const isHome = location.pathname === "/" || location.pathname === "/intro";

  function handleMainPageClick() {
    navigate("/main");
  }

  return (
    <div className={styles.headerContainer}>
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
          <TranslatedText text="메인페이지" />
        </p>
        <p
          onClick={() => navigate("/scrap")}
          className={location.pathname === "/scrap" ? styles.active : ""}
        >
          <TranslatedText text="마이스크랩" />
        </p>
        <p
          onClick={() => navigate("/intro")}
          className={location.pathname === "/intro" ? styles.active : ""}
        >
          <TranslatedText text="서비스 소개" />
        </p>
        <div
          className={`${styles.languageToggle} ${
            isHome ? styles.whiteText : styles.blackText
          }`}
        >
          {/* 언어선택 */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">
              日本語 (<TranslatedText text="일본어" />)
            </option>
            <option value="zh-CN">
              中文 (<TranslatedText text="간체 중국어" />)
            </option>
            <option value="zh-TW">
              繁體中文 (<TranslatedText text="번체 중국어" />)
            </option>
            <option value="vi">
              Tiếng Việt (<TranslatedText text="베트남어" />)
            </option>
            <option value="th">
              ไทย (<TranslatedText text="태국어" />)
            </option>
            <option value="id">
              Bahasa Indonesia (<TranslatedText text="인도네시아어" />)
            </option>
            <option value="ms">
              Bahasa Melayu (<TranslatedText text="말레이어" />)
            </option>
            <option value="hi">
              हिन्दी (<TranslatedText text="힌디어" />)
            </option>
            <option value="bn">
              বাংলা (<TranslatedText text="벵골어" />)
            </option>
            <option value="ta">
              தமிழ் (<TranslatedText text="타밀어" />)
            </option>
            <option value="te">
              తెలుగు (<TranslatedText text="텔루구어" />)
            </option>
            <option value="ur">
              اردو (<TranslatedText text="우르두어" />)
            </option>
            <option value="km">
              ភាសាខ្មែរ (<TranslatedText text="크메르어" />)
            </option>
            <option value="my">
              မြန်မာဘာသာ (<TranslatedText text="버마어/미얀마어" />)
            </option>
            <option value="ne">
              नेपाली (<TranslatedText text="네팔어" />)
            </option>
            <option value="si">
              සිංහල (<TranslatedText text="싱할라어" />)
            </option>
            <option value="lo">
              ລາວ (<TranslatedText text="라오어" />)
            </option>
            <option value="ru">
              Русский (<TranslatedText text="러시아어" />)
            </option>
            <option value="pa">
              ਪੰਜਾਬੀ (<TranslatedText text="펀자브어" />)
            </option>
            <option value="gu">
              ગુજરાતી (<TranslatedText text="구자라트어" />)
            </option>
            <option value="ml">
              മലയാളം (<TranslatedText text="말라얄람어" />)
            </option>
            <option value="kn">
              ಕನ್ನಡ (<TranslatedText text="칸나다어" />)
            </option>
            <option value="mr">
              मराठी (<TranslatedText text="마라티어" />)
            </option>
            <option value="fr">
              Français (<TranslatedText text="프랑스어" />)
            </option>
            <option value="es">
              Español (<TranslatedText text="스페인어" />)
            </option>
            <option value="de">
              Deutsch (<TranslatedText text="독일어" />)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
