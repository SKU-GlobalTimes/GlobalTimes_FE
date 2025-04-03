import axios from "axios";


// mainPage - Hot News Card //
// response.data.data.content[0].title
export async function getHot(page, size) {
    try {
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/articles/popular?page=${page}&size=${size}`;
        const response = await axios.get(baseUrl);
        
        if (response.data.isSuccess === true) {
            // 날짜를 분리해서 새로운 객체 생성
            const formattedResults = response.data.data.content.map(article => {
                const date = new Date(article.publishedAt); // 문자열을 Date 객체로 변환
                return {
                    ...article,
                    year: date.getFullYear().toString(),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // 두 자리로 맞춤
                    day: date.getDate().toString().padStart(2, '0'), // 두 자리로 맞춤
                };
            });

            return formattedResults;
        }
        else {
            console.log("hot 설마");
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
        
        if (response.data.isSuccess === true) {
            // 날짜를 분리해서 새로운 객체 생성
            const formattedResults = response.data.data.content.map(article => {
                const date = new Date(article.publishedAt); // 문자열을 Date 객체로 변환
                return {
                    ...article,
                    year: date.getFullYear().toString(),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // 두 자리로 맞춤
                    day: date.getDate().toString().padStart(2, '0'), // 두 자리로 맞춤
                };
            });

            return formattedResults;
        }
        else {
            console.log("latest 설마");
        }
    } catch (error) {
        console.error("최근 뉴스 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}


// mainPage - Search News Card //
// response.data.data.originalText
export async function getSearch(input) {
    try {
        console.log("input: " + input);
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/search?text=${input}`;
        const response = await axios.get(baseUrl);


        if (response.data.isSuccess === true) {
            // 날짜를 분리해서 새로운 객체 생성
            const formattedResults = response.data.data.searchArticles.map(article => {
                const date = new Date(article.publishedAt); // 문자열을 Date 객체로 변환
                return {
                    ...article,
                    year: date.getFullYear().toString(),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // 두 자리로 맞춤
                    day: date.getDate().toString().padStart(2, '0'), // 두 자리로 맞춤
                };
            });

            return formattedResults;
        }
        else{
            console.log("설마...?");
        }
    } catch (error) {
        console.error("검색 뉴스 결과 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}


// scrapPage - Scrap News Card //
export async function getScrap() {
    try {
        const storedScrapIds = JSON.parse(localStorage.getItem('scrapIds')) || []; // 저장된 ID 가져오기
        console.log("불러온 scrapIds: ", storedScrapIds);

        if (storedScrapIds.length === 0) return [];

        const queryString = storedScrapIds.map(id => `id=${id}`).join("&");
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/scrap?${queryString}`;
        
        const response = await axios.get(baseUrl);

        console.log("Scrap 응답: ", response.data);

        if (response.data.isSuccess) {
            // 날짜를 분리해서 새로운 객체 생성
            const formattedResults = response.data.data.map(article => {
                if (!article.publishedAt) {
                    console.warn("날짜 정보 없음:", article);
                    return { ...article, year: "", month: "", day: "" }; // 날짜 없는 경우 빈 값 처리
                }

                const date = new Date(article.publishedAt); // 날짜 변환
                return {
                    ...article,
                    year: date.getFullYear().toString(),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // 두 자리수 맞춤
                    day: date.getDate().toString().padStart(2, '0'), // 두 자리수 맞춤
                };
            });

            return formattedResults;
        } else {
            console.log("설마...?");
            return [];
        }
    } catch (error) {
        console.error("스크랩 뉴스 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}

