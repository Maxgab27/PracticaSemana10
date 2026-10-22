import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar, NavTab } from './Sidebar';

interface LayoutProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  onTabChange,
  children
}) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        <Sidebar currentTab={currentTab} onTabChange={onTabChange} />
        <main className="app-content-area">{children}</main>
      </div>
    </div>
  );
};
