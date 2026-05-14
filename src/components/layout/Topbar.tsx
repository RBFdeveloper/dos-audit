import { useState } from "react";
import { Menu, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { MOCK_NOTIFICATIONS } from "../../mock/data";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const typeColors: Record<string, string> = {
    warning: "bg-yellow-400",
    danger: "bg-red-400",
    success: "bg-green-400",
    info: "bg-blue-400",
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sticky top-0 z-10 border-b"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg transition-all"
          style={{ color: "var(--text-secondary)" }}
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:block">
          <span
            className="font-bold tracking-widest text-sm"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              color: "var(--accent)",
            }}
          >
            DOS
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            Dealer Operating Standard
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all"
          style={{ color: "var(--text-secondary)" }}
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg transition-all"
            style={{ color: "var(--text-secondary)" }}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              className="absolute right-0 top-11 w-80 rounded-xl shadow-2xl z-50 overflow-hidden border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Notificações
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-3 px-4 py-3 border-b"
                    style={{
                      borderColor: "var(--border)",
                      background: !n.read
                        ? "color-mix(in srgb, var(--accent) 5%, transparent)"
                        : "transparent",
                    }}
                  >
                    <div
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${typeColors[n.type]}`}
                    />
                    <div>
                      <div
                        className="text-xs font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {n.title}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {n.message}
                      </div>
                      <div
                        className="text-[10px] mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {n.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
          style={{ color: "var(--text-primary)" }}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4ade80] to-[#0ea5e9] flex items-center justify-center text-[#0a1628] font-bold text-xs">
            {user?.name.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.name.split(" ")[0]}
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {user?.role === "master" ? "Auditor" : "Responsável"}
            </div>
          </div>
          <ChevronDown
            size={14}
            className="hidden sm:block"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>
    </header>
  );
}
