import styled from './SearchContainer.module.css'
import PropTypes from 'prop-types';
import { Search } from "lucide-react";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function SearchContainer({searchTerm} ) { 
    const navigate = useNavigate();
    const [ inputSearchTerm, setInputSearchTerm ] = useState(searchTerm);
    const [value, setValue] = useState(searchTerm || ''); 

    useEffect(() => {
        setInputSearchTerm(searchTerm);
        setValue(searchTerm);
    }, [searchTerm]);
    
    function handleSearch() {
        const keyword = inputSearchTerm.trim();
        if (!keyword) return;
        navigate(`/search/${keyword}`);
    }

    function handleInputChange(event){
        setInputSearchTerm(event.target.value);
        setValue(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    }

    function handleClickSearch(){
        handleSearch();
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
                    onClick={handleClickSearch}
                    disabled={!value.trim()}
                >Search</button>
            </div>
            
        </div>
    )
}

SearchContainer.propTypes = {
    searchTerm: PropTypes.string.isRequired,   // searchTerm은 string이어야 함
};


