import styles from "./NewsModal.module.css";
import { IoClose } from "react-icons/io5";

const NewsModal = ({ trend, onClose }) => {
  return (
    <div className={styles.newsModal}>
      <div className={styles.titleContainer}>
        <h3>📰 {trend} 관련 뉴스</h3>
        <IoClose className={styles.closeIcon} onClick={onClose} />
      </div>
      <p>해당 키워드와 관련된 뉴스가 여기에 표시됩니다.</p>
    </div>
  );
};

export default NewsModal;
