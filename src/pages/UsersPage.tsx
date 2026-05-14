import { useState } from 'react';
import { Plus, Edit2, Power, Search, X, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { User } from '../types';

export default function UsersPage() {
  const { users, addUser, updateUser, departments } = useStore();
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fRole, setFRole] = useState<'master' | 'responsible'>('responsible');
  const [fDeptId, setFDeptId] = useState('');
  const [fPass, setFPass] = useState('');
  const [fError, setFError] = useState('');

  const [eName, setEName] = useState('');
  const [eEmail, setEEmail] = useState('');
  const [eRole, setERole] = useState<'master' | 'responsible'>('responsible');
  const [eDeptId, setEDeptId] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setFName(''); setFEmail(''); setFRole('responsible');
    setFDeptId(''); setFPass(''); setFError('');
    setShowNew(true);
  };

  const handleCreate = () => {
    if (!fName.trim()) { setFError('Nome é obrigatório.'); return; }
    if (!fEmail.trim() || !fEmail.includes('@')) { setFError('E-mail inválido.'); return; }
    if (users.find(u => u.email === fEmail.trim())) { setFError('E-mail já cadastrado.'); return; }
    const dept = departments.find(d => d.id === fDeptId);
    const newUser: User = {
      id: `u${Date.now()}`,
      name: fName.trim(),
      email: fEmail.trim(),
      role: fRole,
      departmentId: fDeptId || null,
      departmentName: dept?.name,
      active: true,
    };
    addUser(newUser);
    setShowNew(false);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setEName(u.name);
    setEEmail(u.email);
    setERole(u.role);
    setEDeptId(u.departmentId ?? '');
  };

  const handleEdit = () => {
    if (!editUser) return;
    const dept = departments.find(d => d.id === eDeptId);
    updateUser({
      ...editUser,
      name: eName.trim(),
      email: eEmail.trim(),
      role: eRole,
      departmentId: eDeptId || null,
      departmentName: dept?.name,
    });
    setEditUser(null);
  };

  const toggleActive = (u: User) => {
    updateUser({ ...u, active: !u.active });
  };

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 13,
    outline: 'none',
    width: '100%',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
            Usuários
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Gerenciar acessos e permissões</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
          style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}
        >
          <Plus size={16} />
          Novo Usuário
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar usuário..."
          className="w-full text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Usuário', 'E-mail', 'Perfil', 'Departamento', 'Status', 'Ações'].map(h => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium uppercase tracking-wider px-5 py-3"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr
                  key={`${u.id}-${idx}`}
                  className="border-b transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4ade80] to-[#0ea5e9] flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ color: '#060f1e' }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={u.role === 'master'
                        ? { color: '#c084fc', background: 'rgba(192,132,252,0.1)' }
                        : { color: '#60a5fa', background: 'rgba(96,165,250,0.1)' }
                      }
                    >
                      {u.role === 'master' ? 'Master Admin' : 'Responsável'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {u.departmentName ?? '-'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={u.active
                        ? { color: '#4ade80', background: 'rgba(74,222,128,0.1)' }
                        : { color: 'var(--text-muted)', background: 'rgba(148,163,184,0.1)' }
                      }
                    >
                      {u.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
                        title="Editar usuário"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => toggleActive(u)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = u.active ? '#f87171' : '#4ade80')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
                        title={u.active ? 'Desativar usuário' : 'Ativar usuário'}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && (
        <Modal title="Novo Usuário" onClose={() => setShowNew(false)}>
          {fError && (
            <div className="mb-3 text-sm px-4 py-3 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
              {fError}
            </div>
          )}
          <div className="space-y-3">
            <Field label="Nome completo *">
              <input value={fName} onChange={e => { setFName(e.target.value); setFError(''); }} placeholder="Nome" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </Field>
            <Field label="E-mail *">
              <input value={fEmail} onChange={e => { setFEmail(e.target.value); setFError(''); }} placeholder="usuario@wlm.com.br" type="email" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </Field>
            <Field label="Perfil de acesso">
              <select value={fRole} onChange={e => setFRole(e.target.value as any)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                <option value="responsible">Responsável</option>
                <option value="master">Master Admin</option>
              </select>
            </Field>
            {fRole === 'responsible' && (
              <Field label="Departamento">
                <select value={fDeptId} onChange={e => setFDeptId(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                  <option value="">Sem departamento</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Senha temporária">
              <input value={fPass} onChange={e => setFPass(e.target.value)} placeholder="••••••••" type="password" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </Field>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowNew(false)} className="flex-1 text-sm py-2.5 rounded-lg transition-all"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              Cancelar
            </button>
            <button onClick={handleCreate} className="flex-1 font-semibold text-sm py-2.5 rounded-lg transition-all"
              style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}>
              Criar Usuário
            </button>
          </div>
        </Modal>
      )}

      {editUser && (
        <Modal title={`Editar: ${editUser.name}`} onClose={() => setEditUser(null)}>
          <div className="space-y-3">
            <Field label="Nome">
              <input value={eName} onChange={e => setEName(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </Field>
            <Field label="E-mail">
              <input value={eEmail} onChange={e => setEEmail(e.target.value)} type="email" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </Field>
            <Field label="Perfil">
              <select value={eRole} onChange={e => setERole(e.target.value as any)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                <option value="responsible">Responsável</option>
                <option value="master">Master Admin</option>
              </select>
            </Field>
            {eRole === 'responsible' && (
              <Field label="Departamento">
                <select value={eDeptId} onChange={e => setEDeptId(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                  <option value="">Sem departamento</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </Field>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setEditUser(null)} className="flex-1 text-sm py-2.5 rounded-lg transition-all"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              Cancelar
            </button>
            <button onClick={handleEdit} className="flex-1 font-semibold text-sm py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}>
              <Check size={15} /> Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}