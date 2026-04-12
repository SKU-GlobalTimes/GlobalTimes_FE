import styled from "./ExploreNewsCard.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import TranslatedText from "../../api/TranslatedText";
import { Compass } from "lucide-react";

export default function ExploreNewsCard({
  id,
  press,
  title,
  summary,
  image,
  year,
  month,
  day,
}) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/detail/${id}`);
  }

  return (
    <div
      className={styled.exploreCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className={styled.exploreCard__inner}>
        <div>
          <span className={styled.exploreCard__badge}>
            <Compass size={11} strokeWidth={2.5} aria-hidden />
            <TranslatedText text="탐색" />
          </span>
          <p className={styled.exploreCard__press}>{press}</p>
          <p className={styled.exploreCard__title}>
            <TranslatedText text={title} />
          </p>
          <p className={styled.exploreCard__preview}>
            <TranslatedText text={summary} />
          </p>
        </div>
        <p className={styled.exploreCard__date}>
          {year}.{month}.{day}
        </p>
      </div>
      <div className={styled.exploreCard__imageCol}>
        <div className={styled.exploreCard__imageFrame}>
          <div
            className={styled.exploreCard__image}
            style={image ? { backgroundImage: `url(${image})` } : {}}
          />
        </div>
      </div>
    </div>
  );
}

ExploreNewsCard.propTypes = {
  id: PropTypes.number.isRequired,
  press: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
};
