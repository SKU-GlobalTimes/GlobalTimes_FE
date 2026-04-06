import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css";
import Logo from "../../../assets/logo/logo.png";
import { useLanguage } from "../../../util/LanguageContext.jsx";
import { useAuth } from "../../../util/AuthContext.jsx";
import TranslatedText from "../../../api/TranslatedText.jsx";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { language, setLanguage } = useLanguage();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  const isHome = location.pathname === "/" || location.pathname === "/intro";

  const navItems = [
    { label: "메인페이지", path: "/main" },
    { label: "마이스크랩", path: "/scrap" },
    { label: "서비스 소개", path: "/intro" },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className={styles.headerContainer}>
      <div
        className={`${styles.header} ${
          isHome ? styles.whiteText : styles.blackText
        } ${isHome ? styles.blackBackground : styles.whiteBackground}`}
      >
        {/* 로고 */}
        <div className={styles.logoContainer}>
          <img
            src={Logo}
            className={styles.image}
            onClick={() => navigate("/")}
          />
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className={styles.desktopNav}>
          {navItems.map(({ label, path }) => (
            <p
              key={path}
              onClick={() => handleNav(path)}
              className={location.pathname === path ? styles.active : ""}
            >
              <TranslatedText text={label} />
            </p>
          ))}
        </nav>

        {/* 데스크탑 우측 영역 */}
        <div className={styles.desktopRight}>
          <div className={styles.authContainer}>
            {isLoggedIn ? (
              <>
                <span className={styles.nickname}>
                  {user?.nickname ?? ""} 🌐
                </span>
                <button onClick={logout} className={`${styles.authButton} ${styles.logoutButton}`}>
                  <TranslatedText text="로그아웃" />
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className={`${styles.authButton} ${styles.loginButton}`}>
                <TranslatedText text="로그인" />
              </button>
            )}
          </div>
          <div className={`${styles.languageToggle} ${isHome ? styles.whiteText : styles.blackText}`}>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
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

        {/* 햄버거 버튼 (모바일) */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* 오버레이 (메뉴 외 영역 클릭 시 닫힘) */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* 모바일 사이드 메뉴 (우측 슬라이드) */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        {navItems.map(({ label, path }) => (
          <p
            key={path}
            onClick={() => handleNav(path)}
            className={`${styles.mobileMenuItem} ${location.pathname === path ? styles.mobileMenuActive : ""}`}
          >
            <TranslatedText text={label} />
          </p>
        ))}
        <div className={styles.mobileMenuAuth}>
          {isLoggedIn ? (
            <>
              <span className={styles.mobileNickname}>
                {user?.nickname ?? ""} 🌐
              </span>
              <button onClick={() => { logout(); setMenuOpen(false); }} className={`${styles.authButton} ${styles.logoutButton}`}>
                <TranslatedText text="로그아웃" />
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className={`${styles.authButton} ${styles.loginButton}`}>
              <TranslatedText text="로그인" />
            </button>
          )}
        </div>
        <div className={styles.mobileMenuLang}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="zh-CN">中文 (간체)</option>
            <option value="zh-TW">繁體中文 (번체)</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>
    </div>
  );
}
