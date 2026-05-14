import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-base)', fontFamily: 'DM Sans, sans-serif' }}
    >
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
        <footer
          className="text-center py-2 text-[10px] border-t"
          style={{ color: 'var(--text-faint)', borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
        >
          © 2026 WLM Scania & Agro — Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}