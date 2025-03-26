import styles from "./DetailsPage.module.css";
import ArticleDetail from "../components/detailsPage/ArticleDetail";
import Sidebar from "../components/detailsPage/Sidebar";

export default function DetailsPage() {
    return (
        <div className={styles.detailsPage}>
            <div className={styles.article}>
                <ArticleDetail />
            </div>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
        </div>
    );
}
