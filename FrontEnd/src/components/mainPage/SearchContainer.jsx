import styled from './SearchContainer.module.css'
import PropTypes from 'prop-types';
import { Search } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function SearchContainer(props) { 
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm, onSearch} = props;
    const [value, setValue] = useState(searchTerm || ''); 
    
    function handleInputChange(event){
        setSearchTerm(event.target.value);
        setValue(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && value.trim()) {
            const keyword = searchTerm;
            navigate(`/search/${keyword}`);
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
                        placeholder={'Search news'}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    ></input>
                </div>
                <button 
                    id="searchButton"
                    className={styled['searchContainer--searchButton']}
                    onClick={onSearch}
                    disabled={!value.trim()}
                >Search</button>
            </div>
            
        </div>
    )
}

SearchContainer.propTypes = {
    searchTerm: PropTypes.string.isRequired,   // searchTerm은 string이어야 함
    setSearchTerm: PropTypes.func.isRequired,  // setSearchTerm은 함수여야 함
};


