import styles from "./DetailsPage.module.css";
import ArticleDetail from "../components/detailsPage/ArticleDetail";
import Sidebar from "../components/detailsPage/Sidebar";
import Chatbot from "../components/detailsPage/Chatbot";

export default function DetailsPage() {
    return (
        <div className={styles.detailsPage}>
            <div className={styles.content}>
                <div className={styles.article}>
                    <ArticleDetail />
                    <Chatbot />
                </div>
                <div className={styles.sidebar}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
