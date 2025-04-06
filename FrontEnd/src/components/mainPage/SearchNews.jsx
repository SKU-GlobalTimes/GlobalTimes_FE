import PropTypes from 'prop-types';
import styled from './News.module.css';
import SearchNewsCard from '../newsCard/SearchNewsCard';


export default function SearchNews({ searchResults = [] }) {


    return(
        <div className={styled['SearchNews--container']}>
            <div className={styled['SearchNews--Newscontainer']}>
                <div className={styled['SearchNews--titleContainer']}>
                    <h1 className={styled['SearchNews--title']}>검색 결과</h1>
                </div>

                <div className={styled['SearchNews--News']}>
                    {searchResults.map((news) => (
                        <SearchNewsCard key={news.id} id={news.id} press={news.sourceName} title={news.title} summary={news.description} image={news.urlToImage} year={news.year} month={news.month} day={news.day}  />
                    ))}
                </div>
            </div>
        </div>
    )
}



SearchNews.propTypes = {
    searchResults: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            sourceName: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            urlToImage: PropTypes.string,
            publishedAt: PropTypes.string.isRequired, // 원래 날짜 형태
            year: PropTypes.string.isRequired,
            month: PropTypes.string.isRequired,
            day: PropTypes.string.isRequired,
        })
    ).isRequired
};


