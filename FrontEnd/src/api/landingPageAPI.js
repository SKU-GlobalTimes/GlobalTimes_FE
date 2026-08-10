import { apiClient } from "./apiClient";

function isAbortError(error) {
  return (
    error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError"
  );
}

/** @param {string} code 국가 코드
 *  @param {{ signal?: AbortSignal }} [options] 연속 클릭 시 이전 요청 취소용 */
export async function getTrend(code, options = {}) {
  const { signal } = options;
  try {
    const response = await apiClient.get("/api/trend", {
      params: { code },
      signal,
    });
    return response.data;
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw error;
  }
}

export const getSummary = async (url) => {
  const response = await apiClient.get("/api/trend/summary", {
    params: { url },
  });

  if (response.data?.isSuccess && response.data?.data) {
    return response.data.data;
  }
  return "해당 언론사는 요약 정보 제공이 불가능합니다.";
};
