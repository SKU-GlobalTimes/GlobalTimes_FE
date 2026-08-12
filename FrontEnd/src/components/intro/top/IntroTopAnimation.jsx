import { motion } from "framer-motion";
import PropTypes from "prop-types";
import styles from "./IntroTop.module.css";
import { useTranslatedLabel } from "../../../hooks/useTranslatedLabel.js";

export default function IntroAnimation({ isVisible, title, description, imgSrc, isMobile }) {
    const loadingAlt = useTranslatedLabel("로딩중...");

    if (isMobile) {
        return (
            <div className={styles["introPage--mainMobile"]}>
                <div className={styles["contentDiv"]}>
                    <p>{title}</p>
                    <span dangerouslySetInnerHTML={{ __html: description }} />
                </div>
                <div className={styles["imgDiv"]}>
                    <img src={imgSrc} alt={loadingAlt} />
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
          <img src={imgSrc} alt={loadingAlt} />
        </div>
      </motion.div>
    );
  }

IntroAnimation.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
};
