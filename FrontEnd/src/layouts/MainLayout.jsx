import { Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import classNames from 'classnames';
import styles from './MainLayout.module.css';

import Footer from '../components/commons/footer/Footer';
import Header from '../components/commons/header/Header';

export default function MainLayout() {
  const location = useLocation();

  const isLandingPage = location.pathname === "/" || location.pathname === "";

  return (
    <div 
      className={classNames(styles.layout, {
        [styles['landing-page']]: isLandingPage, // isLandingPage가 true일 때만 landing-page 클래스 추가
      })}
    >
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}