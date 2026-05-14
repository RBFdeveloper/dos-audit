import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, FileText, Building2,
  Users, Settings, HelpCircle, LogOut, ChevronRight,
  X, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const masterLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/audits', icon: ClipboardList, label: 'Auditorias' },
  { to: '/reports', icon: FileText, label: 'Relatórios' },
  { to: '/departments', icon: Building2, label: 'Departamentos' },
  { to: '/users', icon: Users, label: 'Usuários' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
  { to: '/help', icon: HelpCircle, label: 'Ajuda' },
];

const responsibleLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-audits', icon: ClipboardList, label: 'Minhas Auditorias' },
  { to: '/help', icon: HelpCircle, label: 'Ajuda' },
];

export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();
  const links = user?.role === 'master' ? masterLinks : responsibleLinks;

  const sidebarWidth = collapsed ? '68px' : '256px';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: 'var(--bg-surface)',
          borderColor: 'var(--border)',
          transition: 'width 0.25s ease, min-width 0.25s ease',
        }}
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col border-r
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div
          className="flex items-center justify-between px-3 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          {!collapsed && (
            <div className="overflow-hidden">
              <div
                className="font-bold text-lg tracking-widest whitespace-nowrap"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--accent)' }}
              >
                WLM
              </div>
              <div className="text-[10px] tracking-wider whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                SCANIA & AGRO
              </div>
            </div>
          )}
          <div className={`flex gap-1 ${collapsed ? 'w-full justify-center' : ''}`}>
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-secondary)' }}
              title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!collapsed && (
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4ade80] to-[#0ea5e9] flex items-center justify-center text-[#0a1628] font-bold text-sm flex-shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name.split(' ')[0]}
              </div>
              <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                {user?.role === 'master' ? 'Auditor Master' : user?.departmentName}
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4ade80] to-[#0ea5e9] flex items-center justify-center text-[#0a1628] font-bold text-sm"
              title={user?.name}
            >
              {user?.name.charAt(0)}
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="space-y-0.5">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-lg text-sm transition-all duration-150
                  ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                  ${isActive
                    ? 'font-semibold'
                    : 'hover:opacity-90'}
                `}
                style={({ isActive }) => ({
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'var(--accent-dark)' : 'var(--text-secondary)',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 whitespace-nowrap">{label}</span>
                        {isActive && <ChevronRight size={14} />}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={logout}
            title={collapsed ? 'Sair' : undefined}
            className={`flex items-center gap-3 w-full rounded-lg text-sm transition-all
              ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <LogOut size={17} className="flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>

        {!collapsed && (
          <div
            className="px-4 py-2 border-t flex items-center justify-between"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="text-[9px]" style={{ color: 'var(--text-faint)' }}>© 2026 WLM</div>
            <div
              className="text-[10px] font-bold tracking-widest"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--accent)' }}
            >
              SCANIA
            </div>
          </div>
        )}
      </aside>
    </>
  );
}