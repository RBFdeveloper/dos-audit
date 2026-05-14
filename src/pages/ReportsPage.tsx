import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { CONFORMITY_BY_DEPT, MOCK_AUDITS, MOCK_TOPICS } from '../mock/data';
import { useTheme } from '../context/ThemeContext';

const TABS = ['Visão Geral', 'Por Departamento', 'Não Conformidades', 'Histórico'];

const NON_CONFORMITIES = MOCK_TOPICS.flatMap(t =>
  t.subtopics
    .filter(s => s.status === 'nao_conforme' || s.status === 'parcialmente')
    .map(s => ({
      department: MOCK_AUDITS.find(a => a.departmentId === t.departmentId)?.departmentName ?? t.departmentId,
      topic: t.name,
      item: s.title,
      status: s.status,
      comment: s.comment ?? '-',
    }))
);

function exportCSV(tab: number) {
  let rows: string[][] = [];
  let filename = 'relatorio-dos.csv';

  if (tab === 0) {
    rows = [['Departamento', 'Conformidade (%)']];
    CONFORMITY_BY_DEPT.forEach(d => rows.push([d.name, String(d.value)]));
    filename = 'relatorio-geral.csv';
  } else if (tab === 1) {
    rows = [['Auditoria', 'Departamento', 'Conformidade (%)', 'Status', 'Prazo']];
    MOCK_AUDITS.forEach(a => rows.push([
      a.name, a.departmentName, a.conformity !== undefined ? String(a.conformity) : '-',
      a.status, a.deadline,
    ]));
    filename = 'relatorio-departamentos.csv';
  } else if (tab === 2) {
    rows = [['Departamento', 'Tópico', 'Item', 'Status', 'Comentário']];
    NON_CONFORMITIES.forEach(n => rows.push([n.department, n.topic, n.item, n.status, n.comment]));
    filename = 'nao-conformidades.csv';
  } else {
    rows = [['Auditoria', 'Departamento', 'Status', 'Criado em', 'Prazo', 'Conformidade']];
    MOCK_AUDITS.forEach(a => rows.push([
      a.name, a.departmentName, a.status, a.createdAt, a.deadline,
      a.conformity !== undefined ? String(a.conformity) + '%' : '-',
    ]));
    filename = 'historico-auditorias.csv';
  }

  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function ThemedTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--tooltip-bg)',
      border: '1px solid var(--tooltip-border)',
      color: 'var(--tooltip-text)',
      borderRadius: 8,
      fontSize: 12,
      padding: '8px 12px',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--tooltip-text)' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: 'var(--tooltip-text)' }}>
          {p.name ?? 'Conformidade'}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState(0);
  const [dateFrom, setDateFrom] = useState('01/01/2026');
  const [dateTo, setDateTo] = useState('31/12/2026');
  const [deptFilter, setDeptFilter] = useState('all');
  const { theme } = useTheme();

  const tickColor = theme === 'dark' ? '#64748b' : '#5a7a99';

  const filteredAudits = MOCK_AUDITS.filter(a =>
    deptFilter === 'all' || a.departmentId === deptFilter
  );

  const total = filteredAudits.length;
  const concluded = filteredAudits.filter(a => a.status === 'concluded').length;
  const inProgress = filteredAudits.filter(a => a.status === 'in_progress').length;
  const nonConformCount = NON_CONFORMITIES.filter(n =>
    deptFilter === 'all' || MOCK_AUDITS.find(a => a.departmentName === n.department && a.departmentId === deptFilter)
  ).length;

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--input-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
            Relatórios
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Acompanhe os resultados das auditorias</p>
        </div>
        <button
          onClick={() => exportCSV(tab)}
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg transition-all"
          style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
        >
          <Download size={15} />
          Exportar CSV
        </button>
      </div>

      <div
        className="flex gap-1 rounded-xl p-1 w-fit flex-wrap"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
            style={tab === i
              ? { background: 'var(--accent)', color: 'var(--accent-dark)' }
              : { color: 'var(--text-secondary)', background: 'transparent' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>De</label>
          <input type="text" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inputStyle, width: 120 }} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Até</label>
          <input type="text" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inputStyle, width: 120 }} />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          style={{ ...inputStyle, width: 200 }}
        >
          <option value="all">Todos os departamentos</option>
          {MOCK_AUDITS.map(a => (
            <option key={a.departmentId} value={a.departmentId}>{a.departmentName}</option>
          ))}
        </select>
        <button
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-semibold transition-all"
          style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}
        >
          <Filter size={14} />
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total de Auditorias', value: total, color: 'var(--text-primary)' },
          { label: 'Concluídas', value: concluded, color: '#4ade80' },
          { label: 'Em andamento', value: inProgress, color: '#facc15' },
          { label: 'Não Conformidades', value: nonConformCount, color: '#f87171' },
        ].map(c => (
          <div key={c.label} style={cardStyle} className="p-4 text-center">
            <div className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: c.color }}>
              {c.value}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {tab === 0 && (
        <>
          <div style={{ ...cardStyle, padding: 20 }}>
            <h3 className="font-semibold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>
              Conformidade por Departamento
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={CONFORMITY_BY_DEPT} barSize={36}>
                <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<ThemedTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {CONFORMITY_BY_DEPT.map((d, i) => (
                    <Cell key={i} fill={d.value >= 85 ? '#4ade80' : d.value >= 75 ? '#facc15' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle} className="overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Detalhamento
              </h3>
            </div>
            <TableContent audits={filteredAudits} />
          </div>
        </>
      )}

      {tab === 1 && (
        <div className="space-y-4">
          {CONFORMITY_BY_DEPT.filter(d => deptFilter === 'all' || MOCK_AUDITS.find(a => a.departmentName === d.name && a.departmentId === deptFilter)).map(dept => {
            const audit = MOCK_AUDITS.find(a => a.departmentName === dept.name);
            const topics = MOCK_TOPICS.filter(t => t.departmentId === audit?.departmentId);
            return (
              <div key={dept.name} style={cardStyle} className="overflow-hidden">
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', fontSize: 16 }}>
                    {dept.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-32 rounded-full h-2" style={{ background: 'var(--bg-base)' }}>
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${dept.value}%`,
                          background: dept.value >= 85 ? '#4ade80' : dept.value >= 75 ? '#facc15' : '#f87171',
                        }}
                      />
                    </div>
                    <span
                      className="font-bold text-sm"
                      style={{ color: dept.value >= 85 ? '#4ade80' : dept.value >= 75 ? '#facc15' : '#f87171' }}
                    >
                      {dept.value}%
                    </span>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {topics.flatMap(t => t.subtopics).map(sub => (
                    <div key={sub.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{sub.title}</div>
                        {sub.comment && (
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub.comment}</div>
                        )}
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 2 && (
        <div style={cardStyle} className="overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Itens Não Conformes e Parciais
            </h3>
          </div>
          {NON_CONFORMITIES.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Nenhuma não conformidade registrada.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {NON_CONFORMITIES.map((nc, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                        >
                          {nc.department}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>›</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{nc.topic}</span>
                      </div>
                      <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{nc.item}</div>
                      {nc.comment !== '-' && (
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{nc.comment}</div>
                      )}
                    </div>
                    <StatusBadge status={nc.status as any} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 3 && (
        <div style={cardStyle} className="overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Histórico de Auditorias
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filteredAudits.map(a => (
              <div key={a.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{a.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Criado: {a.createdAt} · Prazo: {a.deadline}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {a.conformity !== undefined && (
                    <span
                      className="font-bold text-sm"
                      style={{ color: a.conformity >= 85 ? '#4ade80' : a.conformity >= 70 ? '#facc15' : '#f87171' }}
                    >
                      {a.conformity}%
                    </span>
                  )}
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    concluded: { label: 'Concluída', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    in_progress: { label: 'Em andamento', color: '#facc15', bg: 'rgba(250,204,21,0.1)' },
    pending: { label: 'Pendente', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    open: { label: 'Aberta', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    conforme: { label: 'Conforme', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    nao_conforme: { label: 'Não Conforme', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    parcialmente: { label: 'Parcialmente', color: '#facc15', bg: 'rgba(250,204,21,0.1)' },
    pendente: { label: 'Pendente', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  };
  const s = map[status] ?? { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

function TableContent({ audits }: { audits: typeof MOCK_AUDITS }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            {['Departamento', 'Auditoria', 'Conformidade', 'Status', 'Prazo'].map(h => (
              <th key={h} className="text-left text-xs font-medium uppercase tracking-wider px-5 py-3" style={{ color: 'var(--text-muted)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {audits.map(a => (
            <tr key={a.id} className="border-b transition-colors" style={{ borderColor: 'var(--border)' }}>
              <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-primary)' }}>{a.departmentName}</td>
              <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{a.name}</td>
              <td className="px-5 py-3.5">
                {a.conformity !== undefined ? (
                  <span
                    className="text-sm font-bold"
                    style={{ color: a.conformity >= 85 ? '#4ade80' : a.conformity >= 70 ? '#facc15' : '#f87171' }}
                  >
                    {a.conformity}%
                  </span>
                ) : <span className="text-sm" style={{ color: 'var(--text-faint)' }}>-</span>}
              </td>
              <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
              <td className="px-5 py-3.5 text-sm" style={{ color: a.status === 'pending' ? '#f87171' : 'var(--text-secondary)' }}>
                {a.deadline}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}