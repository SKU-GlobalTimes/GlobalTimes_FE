import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css";
import Logo from "../../../assets/logo/logo.png";
import { useLanguage } from "../../../util/LanguageContext.jsx";
import { useAuth } from "../../../util/AuthContext.jsx";
import TranslatedText from "../../../api/TranslatedText.jsx";
import LanguageSelect from "./LanguageSelect.jsx";

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

  const logoTooltipLabel =
    language === "en"
      ? "Live trends check"
      : language === "ja"
        ? "リアルタイムトレンド 確認"
        : "실시간 트렌드 확인하기";

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
        {/* 로고 — 클릭 시 랜딩(실시간 트렌드) */}
        <div
          className={styles.logoContainer}
          onClick={() => navigate("/")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/");
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="홈 · 실시간 트렌드로 이동"
        >
          <img src={Logo} className={styles.image} alt="" draggable={false} />
          <span
            className={`${styles.logoTooltip} ${isHome ? styles.logoTooltipOnDark : styles.logoTooltipOnLight}`}
          >
            <svg
              className={styles.logoTooltipCaret}
              viewBox="0 0 22 12"
              width="22"
              height="12"
              aria-hidden
            >
              <polygon points="11,1 21,11 1,11" className={styles.logoTooltipCaretFill} />
              <path
                d="M1 11 L11 1 L21 11"
                fill="none"
                strokeWidth="1"
                strokeLinejoin="miter"
                className={styles.logoTooltipCaretStroke}
              />
            </svg>
            <span className={styles.logoTooltipText}>{logoTooltipLabel}</span>
          </span>
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
                  {user?.nickname ?? ""} 💡
                </span>
                <button
                  onClick={logout}
                  className={`${styles.authButton} ${styles.logoutButton}`}
                >
                  <TranslatedText text="로그아웃" />
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className={`${styles.authButton} ${styles.loginButton}`}
              >
                <TranslatedText text="로그인" />
              </button>
            )}
          </div>
          <LanguageSelect
            value={language}
            onChange={setLanguage}
            isHome={isHome}
          />
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
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
      >
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
                {user?.nickname ?? ""} 💡
              </span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className={`${styles.authButton} ${styles.logoutButton}`}
              >
                <TranslatedText text="로그아웃" />
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className={`${styles.authButton} ${styles.loginButton}`}
            >
              <TranslatedText text="로그인" />
            </button>
          )}
        </div>
        <div className={styles.mobileMenuLang}>
          <LanguageSelect
            value={language}
            onChange={setLanguage}
            isHome={true}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
}
