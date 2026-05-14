import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('ramonbarbosa@wlm.com.br');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email, password);
    if (ok) navigate('/dashboard');
    else setError('Usuário ou senha inválidos.');
    setLoading(false);
  };

  const quickLogin = (e: string) => {
    setEmail(e);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="hidden lg:flex flex-col justify-between w-3/5 bg-[#060f1e] relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#060f1e] to-[#0d2240]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 50%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5"
          style={{ background: 'linear-gradient(to top, #4ade80, transparent)' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[#4ade80] font-bold text-2xl tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>WLM</div>
              <div className="text-slate-400 text-xs tracking-widest">SCANIA & AGRO</div>
            </div>
            <div className="w-px h-10 bg-[#1e3a5f] mx-2" />
            <div className="text-white font-bold text-xl tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>SCANIA</div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-[#4ade80] text-8xl font-black tracking-tight leading-none" style={{ fontFamily: 'Rajdhani, sans-serif' }}>DOS</div>
          <div className="text-white text-2xl font-light mt-2">Dealer Operation Service</div>
          <div className="text-[#4ade80] text-sm font-semibold tracking-widest mt-1">PORTAL DE AUDITORIA INTERNA</div>
          <div className="text-slate-400 text-sm mt-4">WLM Scania & Agro</div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {['Auditoria Distribuída', 'Evidências Digitais', 'Conformidade Rastreável'].map(f => (
              <div key={f} className="bg-[#1e3a5f]/40 border border-[#1e3a5f] rounded-lg px-3 py-2 text-center">
                <div className="text-[#4ade80] text-[11px] font-semibold">{f}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-600">© 2026 WLM Scania & Agro — Todos os direitos reservados.</div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-[#0a1628] px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="text-[#4ade80] font-bold text-3xl tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>DOS</div>
            <div className="text-slate-400 text-xs mt-1">DEALER OPERATION SERVICE</div>
          </div>

          <h2 className="text-white text-xl font-semibold mb-1">Acesse sua conta</h2>
          <p className="text-slate-400 text-sm mb-6">Informe seu usuário e senha para entrar</p>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-300 text-xs font-medium mb-1.5 block">Usuário ou e-mail</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Digite seu usuário ou e-mail"
                  className="w-full bg-[#060f1e] border border-[#1e3a5f] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#4ade80] transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-medium mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-[#060f1e] border border-[#1e3a5f] text-white text-sm rounded-lg pl-9 pr-10 py-2.5 outline-none focus:border-[#4ade80] transition-colors placeholder:text-slate-600"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-[#4ade80]"
                />
                <span className="text-slate-400 text-xs">Lembrar-me</span>
              </label>
              <button type="button" className="text-[#4ade80] text-xs hover:underline">Esqueci minha senha</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-[#060f1e] font-bold text-sm py-3 rounded-lg transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-[#060f1e]/30 border-t-[#060f1e] rounded-full animate-spin" />Entrando...</>
              ) : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#060f1e]/50 border border-[#1e3a5f] rounded-lg">
            <p className="text-slate-500 text-[11px] mb-2 font-semibold">Acesso rápido (demo):</p>
            <div className="space-y-1.5">
              <button onClick={() => quickLogin('ramonbarbosa@wlm.com.br')} className="w-full text-left text-xs text-slate-400 hover:text-[#4ade80] transition-colors py-0.5">
                👑 ramonbarbosa@wlm.com.br — Master Admin
              </button>
              <button onClick={() => quickLogin('sandrolubanco@wlm.com.br')} className="w-full text-left text-xs text-slate-400 hover:text-[#4ade80] transition-colors py-0.5">
                🔧 sandrolubanco@wlm.com.br — Responsável Oficina
              </button>
              <button onClick={() => quickLogin('flaviagomes@wlm.com.br')} className="w-full text-left text-xs text-slate-400 hover:text-[#4ade80] transition-colors py-0.5">
                📋 flaviagomes@wlm.com.br — Responsável Administrativo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
