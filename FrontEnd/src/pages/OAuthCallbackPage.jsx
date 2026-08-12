import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import TranslatedText from "../api/TranslatedText.jsx";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      navigate("/main", { replace: true });
    } else {
      // 토큰 없으면 메인으로
      navigate("/", { replace: true });
    }
  }, [login, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>
        <TranslatedText text="로그인 처리 중..." />
      </p>
    </div>
  );
}
