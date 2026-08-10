import axios from "axios";

export const AUTH_EXPIRED_EVENT = "global-times:auth-expired";

const baseURL = (import.meta.env.VITE_APP_API ?? "").replace(/\/+$/, "");

const STATUS_MESSAGES = {
  401: "로그인이 만료되었습니다. 다시 로그인해주세요.",
  403: "이 요청을 처리할 권한이 없습니다.",
  502: "외부 서비스 응답에 실패했습니다.",
  503: "요청이 많아 잠시 후 다시 시도해주세요.",
  504: "외부 서비스 응답 시간이 초과되었습니다.",
};

export class ApiRequestError extends Error {
  constructor(message, { status = null, code = null, payload = null } = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

export function normalizeApiError(
  error,
  fallbackMessage = "요청을 처리하지 못했습니다.",
) {
  if (error instanceof ApiRequestError) return error;

  const payload = error?.response?.data ?? null;
  const message =
    payload?.message ||
    (error?.response ? fallbackMessage : "서버에 연결할 수 없습니다.");

  return new ApiRequestError(message, {
    status: error?.response?.status ?? null,
    code: error?.code ?? null,
    payload,
  });
}

export function getApiErrorMessage(error, fallbackMessage) {
  const normalized = normalizeApiError(error, fallbackMessage);
  if (normalized.payload?.message) return normalized.payload.message;
  if (STATUS_MESSAGES[normalized.status]) return STATUS_MESSAGES[normalized.status];
  if (normalized.message) return normalized.message;
  return fallbackMessage ?? "요청을 처리하지 못했습니다.";
}

export const apiClient = axios.create({ baseURL });
export const authAPI = axios.create({ baseURL });

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function rejectAsApiError(error) {
  if (axios.isCancel(error)) return Promise.reject(error);
  return Promise.reject(normalizeApiError(error));
}

function rejectFailedEnvelope(response) {
  const payload = response?.data;
  if (payload?.isSuccess === false) {
    return Promise.reject(
      new ApiRequestError(payload.message || "요청을 처리하지 못했습니다.", {
        status: response.status ?? null,
        code: payload.code ?? null,
        payload,
      }),
    );
  }
  return response;
}

apiClient.interceptors.response.use(rejectFailedEnvelope, rejectAsApiError);

authAPI.interceptors.response.use(
  rejectFailedEnvelope,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const normalized = normalizeApiError(error);
    if (normalized.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(normalized);
  },
);
