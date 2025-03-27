import styles from "./Sidebar.module.css";
import SideImage from "../../assets/image11.png";

export default function Sidebar() {
    // 더미 데이터
    const articles = [
        {
            id: 1,
            source: "🚀매일신문",
            title: "왕립대 대장, 네팔 비자 없이 자유 왕래 허가",
            image: "https://via.placeholder.com/50",
            timeAgo: "1시간 전",
        },
        {
            id: 2,
            source: "🚀매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표 우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 3,
            source: "🚀매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 4,
            source: "🚀매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 5,
            source: "🚀매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 6,
            source: "🚀매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 7,
            source: "🚀매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 7,
            source: "매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 7,
            source: "매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 7,
            source: "매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 7,
            source: "매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
        {
            id: 7,
            source: "매일신문",
            title: "우크라이나 전쟁 관련 미국의 추가 지원 발표",
            image: "https://via.placeholder.com/50",
            timeAgo: "2시간 전",
        },
    ];

    return (
        <div className={styles.sidebar}>
            <h2>최근기사</h2>
            <ul>
                {articles.map((article) => (
                    <li key={article.id} className={styles.articleItem}>
                        <img src={SideImage} alt="썸네일" className={styles.thumbnail} />
                        <div>
                            <p className={styles.articleSource}>{article.source}</p>
                            <p className={styles.articleTitle}>{article.title}</p>
                            <p className={styles.articleTime}>{article.timeAgo}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}