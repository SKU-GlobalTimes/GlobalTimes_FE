import styles from "./Footer.module.css";
import TranslatedText from "../../../api/TranslatedText.jsx";

export default function Footer() {
  return (
    <div className={styles.footerContainer}>
      <h2>GLOBAL TIMES</h2>
      <footer className={styles.footer}>
        <div className={styles.links}>
          <p>
            <TranslatedText text="오류신고" />
          </p>
          <p>|</p>
          <p>
            <TranslatedText text="서비스안내" />
          </p>
          <p>|</p>
          <p>
            <TranslatedText text="책임자 " />
          </p>
        </div>
        <div className={styles.info}>
          <TranslatedText text="각 언론사가 직접 콘텐츠를 편집합니다." />
        </div>
        <div className={styles.copyright}>
          <TranslatedText text="이 콘텐츠의 저작권은 저작권자 또는 제공처에 있으며, 무단 이용하는 경우 저작권법 등에 따라 법적 책임을 질 수 있습니다." />
        </div>
        <div className={styles.copyright}>
          <TranslatedText text="트랜드 데이터는 Google의 서비스 정책 및 저작권 보호 하에 있으며, 상업적 이용 시에는 Google의 명시적인 허가가 필요할 수 있습니다." />
        </div>
      </footer>
    </div>
  );
}
