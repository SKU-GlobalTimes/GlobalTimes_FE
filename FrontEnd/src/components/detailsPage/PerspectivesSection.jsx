import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MutatingDots } from "react-loader-spinner";

import TranslatedText from "../../api/TranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { getNewsPerspectives } from "../../api/detailsAPI.js";
import styles from "./PerspectivesSection.module.css";

function regionLabel(countryCode, locale) {
  if (!countryCode) return "";
  const code = String(countryCode).toUpperCase();
  try {
    const loc = locale === "ja" ? "ja" : locale === "ko" ? "ko" : "en";
    const dn = new Intl.DisplayNames([loc], { type: "region" });
    return dn.of(code);
  } catch {
    return code;
  }
}

function formatPublishedAt(value, dateLocale) {
  if (value == null) return "";
  try {
    const d =
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null;
    if (d && !Number.isNaN(d.getTime())) {
      return d.toLocaleString(dateLocale);
    }
  } catch {
    /* ignore */
  }
  return "";
}

export default function PerspectivesSection({ articleId }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [payload, setPayload] = useState(null);

  const dateLocale =
    language === "ja" ? "ja-JP" : language === "ko" ? "ko-KR" : "en-US";

  useEffect(() => {
    let cancelled = false;
    const id = Number(articleId);
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await getNewsPerspectives(id);
        if (cancelled) return;
        if (res?.isSuccess && res.data) {
          setPayload(res.data);
        } else {
          setPayload(null);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const sortedEntries = useMemo(() => {
    const map = payload?.perspectives;
    if (!map || typeof map !== "object") return [];
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [payload]);

  const total = payload?.totalArticles ?? 0;

  if (loading) {
    return (
      <section className={styles.section} aria-busy="true">
        <div className={styles.inner}>
          <h2 className={styles.heading}>
            <TranslatedText text="다른 나라의 관련 기사" />
          </h2>
          <div className={styles.loading}>
            <MutatingDots
              height={60}
              width={60}
              color="#4fa94d"
              secondaryColor="#ccc"
              radius={10}
              ariaLabel="loading-perspectives"
              visible
            />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>
            <TranslatedText text="다른 나라의 관련 기사" />
          </h2>
          <p className={styles.error}>
            <TranslatedText text="관련 기사를 불러오지 못했습니다." />
          </p>
        </div>
      </section>
    );
  }

  if (!payload || total === 0 || sortedEntries.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>
            <TranslatedText text="다른 나라의 관련 기사" />
          </h2>
          <p className={styles.empty}>
            <TranslatedText text="해당 기사의 내용과 유사한 키워드로 타 국가 기사를 찾지 못했습니다." />
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        <TranslatedText text="다른 나라의 관련 기사" />
      </h2>
      <p className={styles.hint}>
        <TranslatedText text="유사 키워드 기반 탐색 시, 실제 검색에는 해당 데이터를 영어 키워드로 바꿔 사용합니다." />
        <br />
        <TranslatedText text="아래 표시는 기사 제목에서 추출한 원문 키워드입니다." />
      </p>
      {payload.keyword ? (
        <p className={styles.sub}>
          <TranslatedText text="탐색 키워드" />
          {": "}
          {payload.keyword}
        </p>
      ) : null}

      {sortedEntries.map(([countryCode, articles]) => {
        if (!Array.isArray(articles) || articles.length === 0) return null;
        const label = regionLabel(countryCode, language);
        return (
          <div key={countryCode} className={styles.countryBlock}>
            <h3 className={styles.countryTitle}>
              {label}{" "}
              <span style={{ fontWeight: 500, color: "#888" }}>
                ({String(countryCode).toUpperCase()})
              </span>
            </h3>
            {articles.map((article) => (
              <button
                key={article.id}
                type="button"
                className={styles.card}
                onClick={() => navigate(`/detail/${article.id}`)}
              >
                <div
                  className={styles.thumb}
                  style={
                    article.urlToImage
                      ? { backgroundImage: `url(${article.urlToImage})` }
                      : undefined
                  }
                />
                <div className={styles.body}>
                  <p className={styles.source}>{article.source}</p>
                  <p className={styles.cardTitle}>
                    <TranslatedText text={article.title} />
                  </p>
                  <p className={styles.date}>
                    {formatPublishedAt(article.publishedAt, dateLocale)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        );
      })}
    </section>
  );
}
