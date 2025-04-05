import styles from "./IntroTop.module.css";
import { motion, useScroll } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from "react";

// 컴포넌트
import IntroTopAnimation from "./IntroTopAnimation";

// img
import askImg from "../../../assets/askImg.png";
import scrapImg from "../../../assets/scrapImg.png";
import translateImg from "../../../assets/translateImg.png";
import summarizeImg from "../../../assets/summarizeImg.png";


export default function IntroTop(){
    //상단 위치
    const { ref: topRef, inView: topInView } = useInView({
        threshold: 0.8,
    });

    //사용자의 스크롤 y축 값
    const { scrollY } = useScroll();

    // OurService 고정 및 visible여부
    const [isVisible, setIsVisible] = useState(false);
    // 번역 visible여부
    const [isTranslateVisible, setIsTranslateVisible] = useState(false);
    // 요약 visible여부
    const [isSummarizeVisible, setIsSummarizeVisible] = useState(false);
    // 질문 visible여부
    const [isAskVisible, setIsAskVisible] = useState(false);
    // 스크랩 visible여부
    const [isScrapVisible, setIsScrapVisible] = useState(false);

    
    // 고정 시작/끝 지점 (스크롤 Y값 기준)
    const pinStart = 740;  // Our Service가 고정되는 시점
    const pinEnd = 4000;  // 고정이 해제되고 사라지는 시점

    const pinTranslateStart = 820; // Translate가 고정되는 시점
    const pinSummarizeStart = 1620; // Summarize가 고정되는 시점
    const pinAskStart = 2420; // Ask가 고정되는 시점
    const pinScrapStart = 3220; // Scrap이 고정되는 시점



    useEffect(() => {
        const unsubscribe = scrollY.on("change", () => {
            const y = scrollY.get();
            console.log(y);

            //our service
            setIsVisible(y >= pinStart && y <= pinEnd);
            //translate
            setIsTranslateVisible(y >= pinTranslateStart && y <= pinTranslateStart+500);
            //summarize
            setIsSummarizeVisible(y >= pinSummarizeStart && y <= pinSummarizeStart+500);
            //ask
            setIsAskVisible(y >= pinAskStart && y <= pinAskStart+500);
            //scrap
            setIsScrapVisible(y >= pinScrapStart && y <= pinScrapStart+500);
        });
        return () => unsubscribe();
      }, [scrollY]);

    return(
        <div className={styles['introPage--container']}>
            {/* 설명 페이지 상단 */}
            <motion.div
                ref={topRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: topInView ? 1 : 0 }} // 화면에 안 보이면 흐릿하게
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={styles['introPage--top']}
            >
                <p>We Are</p>
                <span>세계 각국의 뉴스를 실시간으로 AI요약 및 번역하여,<br/>
                        시간과 언어의 장벽으로 인한 정보격차를<br />
                        해소하고자 합니다.</span>
            </motion.div>


            {/* 설명 페이지 서비스 소개 */}
            {/* Our Service 고정 섹션 */}
            <motion.div
                className={styles["introPage--service"]}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <p>Our Service</p>
            </motion.div>

            {/* 내용 */}
            {/* 번역 소개 애니메이션 */}
            <IntroTopAnimation
                isVisible={isTranslateVisible}
                title="1. TRANSLATE"
                description={"사용자 언어에 맞는<br/>실시간 번역"}
                imgSrc={translateImg}
            />

            {/* 요약 소개 애니메이션 */}
            <IntroTopAnimation
                isVisible={isSummarizeVisible}
                title="2. SUMMARIZE"
                description={"AI를 통한 실시간<br/>기사 요약"}
                imgSrc={summarizeImg}
            />

            {/* 질문 소개 애니메이션 */}
            <IntroTopAnimation
                isVisible={isAskVisible}
                title="3. QUESTION"
                description={"AI를 통해 뉴스 기사에 대한<br/>상세한 답변 제공"}
                imgSrc={askImg}
            />

            {/* 스크랩 소개 애니메이션 */}
            <IntroTopAnimation
                isVisible={isScrapVisible}
                title="4. SCRAP"
                description={"스크랩을 통해 관심있는<br/>뉴스 기사를 저장"}
                imgSrc={scrapImg}
            />
        </div>
    );
}