import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return(
        <div>
            <p>GLOBAL TIMES</p>
            <p onClick={()=> {navigate("/main");}}>메인페이지</p>
            <p>마이스크랩</p>
            <p>서비스 소개</p>
        </div>
    )
}

