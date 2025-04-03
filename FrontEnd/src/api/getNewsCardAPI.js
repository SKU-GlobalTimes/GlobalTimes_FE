import axios from "axios";


// mainPage - Hot News Card //
export async function getHot(page, size) {
    try {
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/articles/popular?page=${page}&size=${size}`;
        const response = await axios.get(baseUrl);
        console.log("Hot: \n" + response.data);
        
        if(response.data.success === true){
            return response.data;
        }
        
    } catch (error) {
        console.error("인기 뉴스 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}


// mainPage - Latest News Card //
export async function getLatest(page, size) {
    try {
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/articles/latest?page=${page}&size=${size}`;
        const response = await axios.get(baseUrl);
        console.log("Latest: \n" + response.data);
        
        if(response.data.success === true){
            return response.data;
        }
    } catch (error) {
        console.error("최근 뉴스 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}


// mainPage - Search News Card //
export async function getSearch(input) {
    try {
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/search?text=${input}`;
        const response = await axios.get(baseUrl);
        console.log("Search: \n" + response.data);
        
        if(response.data.success === true){
            return response.data;
        }
    } catch (error) {
        console.error("검색 뉴스 결과 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}


// scrapPage - Scrap News Card //
export async function getScrap() {
    try {
        const ids = JSON.parse(localStorage.getItem("ids") || "[]");
        const queryString = ids.map(id => `id=${id}`).join("&");
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/scrap?${queryString}`;
        const response = await axios.get(baseUrl);
        console.log("Scrap: \n" + response.data);
        
        if(response.data.success === true){
            return response.data;
        }
    } catch (error) {
        console.error("스크랩 뉴스 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}



