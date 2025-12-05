import { ReactNode } from 'react';
import Navbar from './Navbar';
import './layout.css';

interface Props {
  sidebar: ReactNode;
  content: ReactNode;
}

const Layout = ({ sidebar, content }: Props) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <aside className="layout-sidebar">{sidebar}</aside>
        <main className="layout-content">{content}</main>
      </div>
    </div>
  );
};

export default Layout;

