import axios from "axios";

export async function getTrend(code) {
  try {
    const baseUrl = `${import.meta.env.VITE_APP_API}/api/trend?code=${code}`;
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("트렌드 데이터를 불러오는 데 실패했습니다:", error);
    return [];
  }
}

export const getSummary = async (url) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/trend/summary?url=${encodeURIComponent(url)}`);
    
    // 응답이 성공적이고 data가 존재하면 반환
    if (response.data?.isSuccess && response.data?.data) {
      return response.data.data;
    } else {
      return "해당 언론사는 요약 정보 제공이 불가능합니다."; // 실패 또는 data가 없는 경우
    }
  } catch (error) {
    console.error("요약을 가져오는 데 실패했습니다:", error);
    return "해당 언론사는 요약 정보 제공이 불가능합니다."; // API 호출 자체가 실패한 경우
  }
};
