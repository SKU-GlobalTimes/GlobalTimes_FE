import styled from './SearchContainer.module.css'
import PropTypes from 'prop-types';
import { Search } from "lucide-react";
import { useState } from 'react';

export default function SearchContainer(props) {
    const { searchTerm, setSearchTerm, category, setCategory, setIsSearch} = props;
    const [value, setValue] = useState(searchTerm || ''); 
    const categories = ['전체', '시사', '정치', '경제', '사회', '문화', '지역', '스포츠', 'IT', '국제', '범죄', '사고', '재해', '연예'];

    function handleInputChange(event){
        setSearchTerm(event.target.value);
        setValue(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            document.getElementById('searchButton').click(); 
        }
    }
    
    function handleClickBtn() {
        setIsSearch(true);
    }

    return(
        <div className={styled['searchContainer--container']}>
            <div className={styled['searchContainer--searchBar']}>
                <div className={styled['searchContainer--searchInputContainer']}>
                    <Search className={styled['input-icon']} size={20} />
                    <input 
                        className={styled['searchContainer--Input']}
                        value={value}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    ></input>
                </div>
                <button 
                    id="searchButton"
                    className={styled['searchContainer--searchButton']}
                    onClick={handleClickBtn}
                >검색</button>
            </div>
            <div className={styled['searchContainer--categoryContainer']}>
            {categories.map((cat) => (
                    <button
                        key={cat}
                        className={
                            category === cat 
                                ? styled['searchContainer--categoryButtonActive'] 
                                : styled['searchContainer--categoryButton']       
                        }
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    )
}

SearchContainer.propTypes = {
    searchTerm: PropTypes.string.isRequired,   // searchTerm은 string이어야 함
    setSearchTerm: PropTypes.func.isRequired,  // setSearchTerm은 함수여야 함
    category: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired,
    setIsSearch: PropTypes.func.isRequired,
};


