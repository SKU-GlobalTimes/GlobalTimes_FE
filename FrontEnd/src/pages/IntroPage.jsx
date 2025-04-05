import styles from "./IntroPage.module.css";
import IntroTop from "../components/intro/top/IntroTop";
import IntroBottom from "../components/intro/bottom/IntroBottom";
import { useEffect, useState } from "react";

export default function IntroPage(){
    const [showButton, setShowButton] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
    };

    useEffect(() => {
    const handleScroll = () => {
        setShowButton(window.scrollY > 300); // 300px 이상 내려가면 보이게
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={styles.introPage}>
            <IntroTop/>
            <IntroBottom/>

            {showButton && (
                <button onClick={scrollToTop} className={styles.scrollTopBtn}>↑ Top</button>
            )}
        </div>
    );
}