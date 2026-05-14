import { ClipboardList, CheckCircle, TrendingUp, AlertTriangle, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_AUDITS, CONFORMITY_BY_DEPT } from '../../mock/data';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#4ade80', '#facc15', '#60a5fa', '#34d399', '#f87171'];

function ThemedTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--tooltip-bg)',
      border: '1px solid var(--tooltip-border)',
      borderRadius: 8,
      fontSize: 12,
      padding: '8px 12px',
      color: 'var(--tooltip-text)',
    }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--tooltip-text)' }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: 'var(--tooltip-text)' }}>
          {p.name ?? 'Conformidade'}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
}

export default function MasterDashboard() {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#64748b' : '#5a7a99';

  const open = MOCK_AUDITS.filter(a => a.status === 'in_progress' || a.status === 'open').length;
  const concluded = MOCK_AUDITS.filter(a => a.status === 'concluded').length;
  const pending = MOCK_AUDITS.filter(a => a.status === 'pending').length;
  const avgConformity = Math.round(CONFORMITY_BY_DEPT.reduce((acc, d) => acc + d.value, 0) / CONFORMITY_BY_DEPT.length);

  const statusColors: Record<string, { color: string; bg: string }> = {
    in_progress: { color: '#facc15', bg: 'rgba(250,204,21,0.1)' },
    concluded:   { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    pending:     { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    open:        { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  };
  const statusLabels: Record<string, string> = {
    in_progress: 'Em andamento',
    concluded: 'Concluída',
    pending: 'Pendente',
    open: 'Aberta',
  };

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 20,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Visão geral das auditorias internas</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: ClipboardList, label: 'Auditorias Abertas', value: open, sub: 'Em andamento', iconBg: 'rgba(96,165,250,0.15)', iconColor: '#60a5fa' },
          { icon: CheckCircle, label: 'Concluídas', value: concluded, sub: 'Neste mês', iconBg: 'rgba(74,222,128,0.15)', iconColor: '#4ade80' },
          { icon: TrendingUp, label: 'Conformidade Geral', value: `${avgConformity}%`, sub: 'Índice médio', iconBg: 'rgba(52,211,153,0.15)', iconColor: '#34d399' },
          { icon: AlertTriangle, label: 'Não Conformidades', value: 7, sub: 'Itens pendentes', iconBg: 'rgba(248,113,113,0.15)', iconColor: '#f87171' },
        ].map(({ icon: Icon, label, value, sub, iconBg, iconColor }) => (
          <div key={label} style={cardStyle} className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
              <Icon size={22} style={{ color: iconColor }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>{value}</div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div style={cardStyle}>
          <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
            Conformidade por Departamento
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={CONFORMITY_BY_DEPT} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                  {CONFORMITY_BY_DEPT.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<ThemedTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {CONFORMITY_BY_DEPT.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
            Índice de Conformidade por Setor
          </h3>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={CONFORMITY_BY_DEPT} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ThemedTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {CONFORMITY_BY_DEPT.map((d, i) => (
                  <Cell key={i} fill={d.value >= 85 ? '#4ade80' : d.value >= 75 ? '#facc15' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Auditorias Pendentes por Setor
          </h3>
          <Link to="/audits" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>Ver todas</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Auditoria', 'Departamento', 'Status', 'Conformidade', 'Prazo', ''].map(h => (
                  <th key={h} className="text-left text-xs font-medium uppercase tracking-wider px-5 py-3" style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_AUDITS.map(a => {
                const sc = statusColors[a.status];
                return (
                  <tr key={a.id} className="border-b transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{a.name}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{a.departmentName}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ color: sc.color, background: sc.bg }}>
                        {statusLabels[a.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {a.conformity !== undefined ? (
                        <span className="text-sm font-semibold" style={{ color: a.conformity >= 85 ? '#4ade80' : a.conformity >= 70 ? '#facc15' : '#f87171' }}>
                          {a.conformity}%
                        </span>
                      ) : <span className="text-sm" style={{ color: 'var(--text-faint)' }}>-</span>}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: a.status === 'pending' ? '#f87171' : 'var(--text-secondary)' }}>
                      {a.deadline}
                    </td>
                    <td className="px-5 py-3">
                      <Link to={`/audits/${a.id}`} className="transition-colors" style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}