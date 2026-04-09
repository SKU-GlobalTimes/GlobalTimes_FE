import { Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import classNames from 'classnames';
import styles from './MainLayout.module.css';

import Footer from '../components/commons/footer/Footer';
import Header from '../components/commons/header/Header';
import ChatHistoryButton from '../components/chat/ChatHistoryButton';

export default function MainLayout() {
  const location = useLocation();

  const isIntroPage = location.pathname === "/intro";
  const isLandingPage = location.pathname === "/";
  const isFooterVisible = !isLandingPage;

  return (
    <div 
      className={classNames(styles.layout, {
        [styles['intro-page']]: isIntroPage,
        [styles['landing-page']]: isLandingPage,
      })}
    >
      <Header />
      <Outlet />
      {isFooterVisible && <Footer />}
      <ChatHistoryButton />
    </div>
  );
}
