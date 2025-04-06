import { motion } from "framer-motion";
import styles from "./IntroTop.module.css";

export default function IntroAnimation({ isVisible, title, description, imgSrc }) {
    return (
      <motion.div
        className={styles["introPage--main"]}
        initial={{ opacity: 0, y: 30 }}
        animate={
            isVisible 
            ? { opacity: 1, y: 0 } 
            : { opacity: 0, y: -30 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className={styles["contentDiv"]}>
          <p>{title}</p>
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <div className={styles["imgDiv"]}>
          <img src={imgSrc} alt="로딩중..." />
        </div>
      </motion.div>
    );
  }