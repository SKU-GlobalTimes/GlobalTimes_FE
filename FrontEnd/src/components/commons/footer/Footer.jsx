import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footerContainer}>
        <h2>GLOBAL TIMES</h2>
      <footer className={styles.footer}>
        <div className={styles.links}>
          <p>오류신고</p>
          <p>|</p>
          <p>서비스안내</p>
          <p>|</p>
          <p>책임자 </p>
        </div>
        <div className={styles.info}>
          각 언론사가 직접 콘텐츠를 편집합니다.
        </div>
        <div className={styles.copyright}>
          이 콘텐츠의 저작권은 저작권자 또는 제공처에 있으며, 무단 이용하는 경우
          저작권법 등에 따라 법적 책임을 질 수 있습니다.
        </div>
      </footer>
    </div>
  );
}
