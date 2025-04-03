import styled from './SearchContainer.module.css'
import PropTypes from 'prop-types';
import { Search } from "lucide-react";
import { useState } from 'react';

export default function SearchContainer(props) {
    const { searchTerm, setSearchTerm, onSearch} = props;
    const [value, setValue] = useState(searchTerm || ''); 

    function handleInputChange(event){
        setSearchTerm(event.target.value);
        setValue(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && value.trim()) {
            onSearch(); // 
        }
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
                    onClick={onSearch}
                    disabled={!value.trim()}
                >검색</button>
            </div>
            
        </div>
    )
}

SearchContainer.propTypes = {
    searchTerm: PropTypes.string.isRequired,   // searchTerm은 string이어야 함
    setSearchTerm: PropTypes.func.isRequired,  // setSearchTerm은 함수여야 함
    onSearch: PropTypes.func.isRequired,
};


