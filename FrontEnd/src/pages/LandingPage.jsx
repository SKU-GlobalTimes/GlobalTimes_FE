import GlobeComponent from "../components/globe/Globe";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.wrap}>
      <GlobeComponent />
    </div>
  );
}