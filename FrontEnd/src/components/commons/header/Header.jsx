import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    function handleMainPageClick() {
        navigate('/main', {state: {isSearch: false}});
        window.location.reload();  // 페이지 강제 새로고침
    }

    return(
        <div>
            <p onClick={()=>navigate('/')}>GLOBAL TIMES</p>
            <p onClick={handleMainPageClick}>메인페이지</p>
            <p>마이스크랩</p>
            <p>서비스 소개</p>
        </div>
    )
}

