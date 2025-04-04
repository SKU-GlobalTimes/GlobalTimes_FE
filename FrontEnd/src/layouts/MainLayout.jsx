import { Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import classNames from 'classnames';
import styles from './MainLayout.module.css';

import Footer from '../components/commons/footer/Footer';
import Header from '../components/commons/header/Header';

export default function MainLayout() {
  const location = useLocation();

  const isFooterVisible = location.pathname !== "/"; // /일 때 footer 숨기기

  return (
    <div 
      className={classNames(styles.layout)}
    >
      <Header />
      <Outlet />
      {isFooterVisible && <Footer />}
    </div>
  );
}
