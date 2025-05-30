import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./IntroBottom.module.css";

//번역 컴포넌트
import TranslatedText from "../../../api/TranslatedText";


// img
import teamImg from "../../../assets/ourWorksImg.jpg";
import teamImage1 from "../../../assets/team7.jpg";
import teamImage2 from "../../../assets/team8.jpg";
import teamImage3 from "../../../assets/team9.jpg";
import teamImage4 from "../../../assets/team10.jpg";
import teamImage5 from "../../../assets/team11.jpg";
import teamImage6 from "../../../assets/team12.jpg";

export default function IntroBottom(){
    useEffect(() => {
        AOS.init({
          duration: 800, // 애니메이션 지속 시간
          once: false,    // 한 번만 실행할지 여부
          easing: "ease-in-out",
        });
      }, []);

    return(
        <div className={styles['introPage--container']}>

            {/* 팀 소개 */}
            <div className={styles['introPage--team']}>
                <div className={styles["contentDiv"]} data-aos="fade" data-aos-offset="200">
                    <p>Our Team...</p>
                    <span> <TranslatedText text="프론트엔드 개발자와 백엔드 개발자로 이루어진 저희 팀은, 각 분야 팀원들끼리 많은 소통을 통해 프로젝트를 더욱 꼼꼼하고 효율적으로 진행해오고 있습니다."/></span>
                </div>
                <div className={styles["imgDiv"]} data-aos="fade-left" data-aos-offset="250">
                    <img src={teamImg} alt="팀 사진..."/>
                </div>
            </div>

            {/* 코딩하는 사진 소개 */}
            <div className={styles['introPage--works']} data-aos="fade" data-aos-offset="200">
                <p>Our Works...</p>
            </div>

            {/* 코딩 이미지 */}
            <div className={styles['gridContainer']} data-aos="fade-down" data-aos-offset="100">
                <img src={teamImage1} alt=""/>
                <img src={teamImage2} alt=""/>
                <img src={teamImage3} alt="" />
                <img src={teamImage4} alt=""/>
                <img src={teamImage5} alt=""/>
                <img src={teamImage6} alt=""/>
            </div>
        </div>
    )
}