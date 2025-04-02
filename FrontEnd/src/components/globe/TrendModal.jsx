import { useEffect, useState } from "react";
import styles from "./TrendModal.module.css";

const TrendModal = ({ country, onSelect, onClose }) => {
  const [currentDateTime, setCurrentDateTime] = useState("");

  const trends = [
    "노엘",
    "챗GPT 지브리 이미지",
    "넥슨",
    "nc파크 사고",
    "만우절 장난",
    "가세연",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const dateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      setCurrentDateTime(dateTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.trendModal}>
      <div className={styles.titleContainer}>
        <h3>{country}의</h3>
        <h3>실시간 트렌드</h3>
        <p className={styles.dateTime}>{currentDateTime}</p>
      </div>
      <ul>
        {trends.map((trend) => (
          <li key={trend} onClick={() => onSelect(trend)}>
            {trend}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendModal;
