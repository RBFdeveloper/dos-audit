import { useState } from 'react';
import { Plus, Building2, User, TrendingUp, Edit2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MOCK_USERS } from '../mock/data';
import { Department } from '../types';

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

export default function DepartmentsPage() {
  const { departments, addDepartment, users } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);

  const [formName, setFormName] = useState('');
  const [formResponsibleId, setFormResponsibleId] = useState('');
  const [formError, setFormError] = useState('');

  const responsibleUsers = users.filter(u => u.role === 'responsible' && u.active);

  const openNew = () => {
    setFormName('');
    setFormResponsibleId('');
    setFormError('');
    setEditDept(null);
    setShowNew(true);
  };

  const handleSave = () => {
    if (!formName.trim()) { setFormError('Nome do departamento é obrigatório.'); return; }
    const responsible = users.find(u => u.id === formResponsibleId);
    const newDept: Department = {
      id: `d${Date.now()}`,
      name: formName.trim(),
      responsible: responsible?.name ?? '-',
      responsibleId: formResponsibleId || undefined,
      conformity: 0,
      status: 'open',
    };
    addDepartment(newDept);
    setShowNew(false);
  };

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 20,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
            Departamentos
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Gestão de setores e responsáveis</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
          style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}
        >
          <Plus size={16} />
          Novo Departamento
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map(dept => {
          const sc = dept.status ? statusColors[dept.status] : null;
          return (
            <div
              key={dept.id}
              style={cardStyle}
              className="transition-all hover:opacity-90"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--bg-hover)' }}
                >
                  <Building2 size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex items-center gap-2">
                  {sc && dept.status && (
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ color: sc.color, background: sc.bg }}
                    >
                      {statusLabels[dept.status]}
                    </span>
                  )}
                </div>
              </div>

              <h3
                className="font-bold text-base mb-3"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}
              >
                {dept.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <User size={12} />
                  <span>{dept.responsible ?? 'Não atribuído'}</span>
                </div>
                {dept.conformity !== undefined && dept.conformity > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp
                      size={12}
                      style={{ color: dept.conformity >= 85 ? '#4ade80' : dept.conformity >= 70 ? '#facc15' : '#f87171' }}
                    />
                    <span
                      className="font-semibold"
                      style={{ color: dept.conformity >= 85 ? '#4ade80' : dept.conformity >= 70 ? '#facc15' : '#f87171' }}
                    >
                      {dept.conformity}% conformidade
                    </span>
                  </div>
                )}
              </div>

              {dept.conformity !== undefined && dept.conformity > 0 && (
                <div className="w-full rounded-full h-1.5" style={{ background: 'var(--bg-base)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${dept.conformity}%`,
                      background: dept.conformity >= 85 ? '#4ade80' : dept.conformity >= 70 ? '#facc15' : '#f87171',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3
              className="font-bold text-lg mb-4"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}
            >
              Novo Departamento
            </h3>

            {formError && (
              <div className="mb-3 text-sm px-4 py-3 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                {formError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Nome do departamento *
                </label>
                <input
                  value={formName}
                  onChange={e => { setFormName(e.target.value); setFormError(''); }}
                  placeholder="Ex: Vendas, Pós-Venda..."
                  className="w-full text-sm rounded-lg px-4 py-2.5 outline-none transition-colors"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Responsável
                </label>
                <select
                  value={formResponsibleId}
                  onChange={e => setFormResponsibleId(e.target.value)}
                  className="w-full text-sm rounded-lg px-4 py-2.5 outline-none transition-colors"
                  style={{ background: 'var(--select-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                >
                  <option value="">Selecionar responsável (opcional)</option>
                  {responsibleUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} — {u.departmentName ?? 'sem setor'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNew(false)}
                className="flex-1 text-sm py-2.5 rounded-lg transition-all"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 font-semibold text-sm py-2.5 rounded-lg transition-all"
                style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}
              >
                Criar Departamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}