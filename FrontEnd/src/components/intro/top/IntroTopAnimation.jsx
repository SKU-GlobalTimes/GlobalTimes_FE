import { motion } from "framer-motion";
import styles from "./IntroTop.module.css";

export default function IntroAnimation({ isVisible, title, description, imgSrc, isMobile }) {

    if (isMobile) {
        return (
            <div className={styles["introPage--mainMobile"]}>
                <div className={styles["contentDiv"]}>
                    <p>{title}</p>
                    <span dangerouslySetInnerHTML={{ __html: description }} />
                </div>
                <div className={styles["imgDiv"]}>
                    <img src={imgSrc} alt="로딩중..." />
                </div>
            </div>
        );
    }

    return (
      <motion.div
        className={styles["introPage--main"]}
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{
            opacity: { duration: 0.45, ease: "easeOut" },
            y:       { duration: 0.5,  ease: [0.25, 0.46, 0.45, 0.94] },
        }}
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