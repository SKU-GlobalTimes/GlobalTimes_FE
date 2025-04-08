import { useEffect, useState } from "react";
import styles from "./TrendModal.module.css";

const TrendModal = ({ country, trends, timestamp, onSelect, onClose }) => {
  return (
    <div className={styles.trendModal}>
      <div className={styles.titleContainer}>
        <h3>{country}의 실시간 트렌드</h3>
        <p className={styles.dateTime}>업데이트: {new Date(timestamp).toLocaleString()}</p>
      </div>

      <ul>
        {trends.map((trend, index) => (
          <li key={index} onClick={() => onSelect(trend)}>
            {trend.keyword}
          </li>
        ))}
      </ul>

      {/* 저작권 문구 추가 */}
      <p className={styles.copyright}>
        본 페이지에 표시된 트렌드 데이터는{" "}
        <a href="https://trends.google.com/trends/" target="_blank" rel="noopener noreferrer">
          Google Trends
        </a>
        에서 제공하는 RSS 피드를 기반으로 수집되었습니다.
      </p>
    </div>
  );
};

export default TrendModal;
