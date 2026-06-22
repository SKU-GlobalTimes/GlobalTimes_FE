import styles from "./TrendModal.module.css";
import { formatLocal } from "../../util/date";
import TranslatedText from "../../api/TranslatedText";
import { useLanguage } from "../../util/LanguageContext.jsx";

const TrendModal = ({ country, trends, timestamp, onSelect, onClose }) => {
  const { language } = useLanguage();
  const dateLocale =
    language === "ja" ? "ja-JP" : language === "ko" ? "ko-KR" : "en-US";

  return (
    <div className={styles.trendModal}>
      <div className={styles.titleContainer}>
        <h3>
          <TranslatedText text={`${country}의 실시간 트렌드`} />
        </h3>
        <p className={styles.dateTime}>
          <TranslatedText text="업데이트:" />{" "}
          {formatLocal(timestamp, dateLocale)}
        </p>
      </div>

      <ul>
        {trends.map((trend, index) => (
          <li key={index} onClick={() => onSelect(trend)}>
            {trend.keyword}
          </li>
        ))}
      </ul>

      <p className={styles.copyright}>
        <TranslatedText text="본 페이지에 표시된 트렌드 데이터는 " />
        <a
          href="https://trends.google.com/trends/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Trends
        </a>
        <TranslatedText text="에서 제공하는 RSS 피드를 기반으로 수집되었습니다." />
      </p>
    </div>
  );
};

export default TrendModal;
