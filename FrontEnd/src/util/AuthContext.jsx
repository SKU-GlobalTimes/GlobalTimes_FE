import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { authAPI } from "../api/authAPI";
import { AUTH_EXPIRED_EVENT } from "../api/apiClient";
import { clearAnonymousSessionId } from "./anonymousSession.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleExpired = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, []);

  // 토큰이 있으면 내 정보 조회
  useEffect(() => {
    if (token) {
      authAPI.get("/api/user/me")
        .then((res) => setUser(res.data.data))
        .catch(() => {
          // 토큰 만료 등 오류 시 로그아웃 처리
          logout();
        });
    }
  }, [token]);

  const login = (newToken) => {
    clearAnonymousSessionId();
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
