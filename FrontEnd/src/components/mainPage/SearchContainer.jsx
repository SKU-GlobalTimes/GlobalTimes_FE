import styled from './SearchContainer.module.css'
import PropTypes from 'prop-types';
import { Search } from "lucide-react";
import { useState } from 'react';

export default function SearchContainer(props) {
    const { searchTerm, setSearchTerm, setIsSearch} = props;
    const [value, setValue] = useState(searchTerm || ''); 

    function handleInputChange(event){
        setSearchTerm(event.target.value);
        setValue(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            setIsSearch(false);
            setIsSearch(true);
            // document.getElementById('searchButton').click(); 
        }
    }
    
    function handleClickDownBtn(){
        setIsSearch(false);
    }
    function handleClickUpBtn() {
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
                        placeholder={'뉴스 검색'}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    ></input>
                </div>
                <button 
                    id="searchButton"
                    className={styled['searchContainer--searchButton']}
                    onMouseDown={handleClickDownBtn}
                    onMouseUp={handleClickUpBtn}
                >검색</button>
            </div>
            
        </div>
    )
}

SearchContainer.propTypes = {
    searchTerm: PropTypes.string.isRequired,   // searchTerm은 string이어야 함
    setSearchTerm: PropTypes.func.isRequired,  // setSearchTerm은 함수여야 함
    setIsSearch: PropTypes.func.isRequired,
};


