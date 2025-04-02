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
    </div>
  );
};

export default TrendModal;
