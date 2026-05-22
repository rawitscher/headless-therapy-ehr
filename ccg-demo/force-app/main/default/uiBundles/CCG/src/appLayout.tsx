import { Outlet, NavLink, useLocation, Link } from 'react-router';
import { useState } from 'react';
import {
  Home as HomeIcon,
  CheckSquare,
  MessageSquare,
  Calendar,
  Users,
  UserCog,
  Contact,
  Receipt,
  Wallet,
  BookOpen,
  Search,
  ChevronDown,
  HelpCircle,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { currentUser } from './data/demoData';
import CcgCopilot from './components/CcgCopilot';

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number | string;
};

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/to-do', label: 'To-Do', icon: CheckSquare, badge: 3 },
  { to: '/messages', label: 'Messages', icon: MessageSquare, badge: 5 },
  { to: '/scheduling', label: 'Scheduling', icon: Calendar },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/staff', label: 'Staff', icon: UserCog },
  { to: '/contacts', label: 'Contacts', icon: Contact },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/payers', label: 'Payers', icon: Wallet },
  { to: '/library', label: 'Library', icon: BookOpen },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const location = useLocation();

  const breadcrumb = (() => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/patients/'))
      return `Patients · ${decodeURIComponent(path.split('/').pop() || '')
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')}`;
    const seg = path.split('/').filter(Boolean)[0] || '';
    return seg.charAt(0).toUpperCase() + seg.slice(1).replace('-', ' ');
  })();

  const currentRole = (() => {
    const path = location.pathname;
    if (path.startsWith('/intake-preview'))
      return { label: 'Intake (Lauren)', dot: '#6366f1' };
    if (path.startsWith('/portal-preview'))
      return { label: 'Patient portal (Sarah)', dot: '#0a9396' };
    if (path.startsWith('/consolidation'))
      return { label: 'Tech stack overview', dot: '#d6336c' };
    return { label: 'Provider view', dot: 'var(--ccg-success)' };
  })();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--ccg-bg)]">
      {/* Left navigation */}
      <aside
        className={`flex flex-col bg-[var(--ccg-nav-bg)] text-gray-200 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b border-white/10">
          <div className="w-7 h-7 rounded-md bg-[var(--ccg-primary)] flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-white font-semibold text-sm">CCG Clinical</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                Counseling Center Group
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-gray-400 hover:text-white text-xs"
            aria-label="Toggle sidebar"
          >
            «
          </button>
        </div>

        {!collapsed && (
          <div className="px-3 py-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-white/5 border border-white/10 rounded-md text-xs text-gray-200 placeholder-gray-500 pl-8 pr-2 py-1.5 focus:outline-none focus:border-[var(--ccg-primary)]"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 pt-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 my-0.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-[var(--ccg-primary)] text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-[var(--ccg-accent)] text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-3 space-y-1">
          {!collapsed && (
            <div className="text-[10px] uppercase tracking-wider text-gray-500 px-1 pb-1">
              User Options
            </div>
          )}
          <button className="w-full flex items-center gap-2 text-xs text-gray-300 hover:text-white px-1 py-1">
            <SettingsIcon size={14} /> {!collapsed && 'Profile'}
          </button>
          <button className="w-full flex items-center gap-2 text-xs text-gray-300 hover:text-white px-1 py-1">
            <HelpCircle size={14} /> {!collapsed && 'Help'}
          </button>
          <button className="w-full flex items-center gap-2 text-xs text-gray-300 hover:text-white px-1 py-1">
            <LogOut size={14} /> {!collapsed && 'Log Out'}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-14 bg-white border-b border-[var(--ccg-border)] flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2 text-sm text-[var(--ccg-text-muted)]">
            <Link to="/" className="hover:text-[var(--ccg-primary)]">
              {breadcrumb.split('·')[0].trim()}
            </Link>
            {breadcrumb.includes('·') && (
              <>
                <span>›</span>
                <span className="text-[var(--ccg-text)] font-medium">
                  {breadcrumb.split('·')[1].trim()}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(o => !o)}
                className="flex items-center gap-2 text-xs text-[var(--ccg-text-muted)] border border-[var(--ccg-border)] rounded-md px-2.5 py-1.5 hover:border-[var(--ccg-primary)]"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: currentRole.dot }}
                ></span>
                {currentRole.label}
                <ChevronDown size={12} />
              </button>
              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-[var(--ccg-border)] rounded-md shadow-lg z-50 py-1 text-sm">
                  <Link
                    to="/"
                    onClick={() => setRoleMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-[var(--ccg-primary-soft)]"
                  >
                    Provider view
                  </Link>
                  <Link
                    to="/intake-preview"
                    onClick={() => setRoleMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-[var(--ccg-primary-soft)]"
                  >
                    Intake (Lauren)
                  </Link>
                  <Link
                    to="/portal-preview"
                    onClick={() => setRoleMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-[var(--ccg-primary-soft)]"
                  >
                    Patient portal (Sarah)
                  </Link>
                  <div className="border-t border-[var(--ccg-border)] my-1" />
                  <Link
                    to="/consolidation"
                    onClick={() => setRoleMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-[var(--ccg-primary-soft)] text-[var(--ccg-primary)] font-medium"
                  >
                    Tech stack overview
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-[var(--ccg-border)]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: currentUser.avatarColor }}
              >
                {currentUser.initials}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-semibold text-[var(--ccg-text)]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[var(--ccg-text-muted)]">
                  {currentUser.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-24">
          <Outlet />
        </main>
      </div>

      {/* Floating Agentforce copilot */}
      <CcgCopilot />
    </div>
  );
}
