import { Link, useLocation } from '@tanstack/react-router';
import { Home, BarChart3, Plus, FileText, User } from 'lucide-react';

const tabs = [
  { to: '/' as const, icon: Home, label: 'Home', center: false },
  { to: '/reports' as const, icon: BarChart3, label: 'Reports', center: false },
  { to: '/log' as const, icon: Plus, label: 'Log', center: true },
  { to: '/tax' as const, icon: FileText, label: 'Tax', center: false },
  { to: '/profile' as const, icon: User, label: 'Profile', center: false },
];

export function TabBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 glass-tab-bar px-4 py-3 flex items-center gap-2" style={{ width: 'min(360px, calc(100% - 40px))' }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.to || (tab.to !== '/' && location.pathname.startsWith(tab.to));
        const isHome = tab.to === '/' && location.pathname === '/';
        const active = isActive || isHome;

        if (tab.center) {
          return (
            <Link key={tab.to} to={tab.to} className="flex flex-col items-center justify-center mx-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0A84FF' }}>
                <Plus className="w-6 h-6 text-foreground" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <tab.icon
              className="w-[22px] h-[22px] transition-colors"
              style={{ color: active ? '#0A84FF' : 'rgba(255,255,255,0.45)' }}
            />
            <span
              className="text-[10px] transition-colors"
              style={{ color: active ? '#0A84FF' : 'rgba(255,255,255,0.45)' }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
