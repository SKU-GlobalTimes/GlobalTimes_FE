import styles from "./ArticleDetail.module.css";
import { FaBookmark } from "react-icons/fa";
import MainImage from "../../assets/image 37.png";

export default function ArticleDetail() {
  const article = {
    title: "러시아와 우크라이나, 흑해에서의 해상 휴전 합의",
    author: "Ian Aikman",
    source: "BBC News",
    timeAgo: "4시간 전",
    content:
      "러시아와 우크라이나는 사우디아라비아에서 3일간의 평화 회담을 마친 후 미국과 별도로 협상으로 흑해에서의 해상 휴전을 합의했습니다. 러시아와 우크라이나는 사우디아라비아에서 3일간의 평화 회담을 마친 후 미국과 별도로 협상으로 흑해에서의 해상 휴전을 합의했습니다.러시아와 우크라이나는 사우디아라비아에서 3일간의 평화 회담을 마친 후 미국과 별도로 협상으로 흑해에서의 해상 휴전을 합의했습니다. 러시아와 우크라이나는 사우디아라비아에서 3일간의 평화 회담을 마친 후 미국과 별도로 협상으로 흑해에서의 해상 휴전을 합의했습니다",
    views: 121,
  };

  return (
    <div className={styles.articleDetail}>
      <h1>{article.title}</h1>
      <div className={styles.infoContainer}>
          <p className={styles.timeText}>{article.timeAgo}</p>
        <div className={styles.stats}>
          <span>조회수 {article.views}</span>
          <span className={styles.scrap}>
            스크랩 <FaBookmark className={styles.icon} />
          </span>
        </div>
      </div>
      <p className={styles.meta}>
        {article.source} - {article.author}
      </p>
      <img src={MainImage} alt="기사 이미지" className={styles.image} />
      <p className={styles.content}>{article.content}</p>
    </div>
  );
}
