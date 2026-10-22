import React from 'react';

export type NavTab = 'dashboard' | 'customers' | 'segmentation' | 'recommendations';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Panel de Control',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="nav-svg">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
    {
      id: 'customers' as NavTab,
      label: 'Directorio de Clientes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="nav-svg">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'segmentation' as NavTab,
      label: 'Segmentación K-Means',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="nav-svg">
          <circle cx="12" cy="12" r="3" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="6" cy="6" r="2" />
          <line x1="10.2" y1="10.2" x2="7.4" y2="7.4" />
          <line x1="13.8" y1="10.2" x2="17.6" y2="7.4" />
          <line x1="10.2" y1="13.8" x2="6.6" y2="16.6" />
        </svg>
      )
    },
    {
      id: 'recommendations' as NavTab,
      label: 'Estrategia Comercial',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="nav-svg">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    }
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-section-title">NAVEGACIÓN PRINCIPAL</div>
        <nav className="sidebar-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item-btn ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              type="button"
            >
              <span className="nav-icon-wrap">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
