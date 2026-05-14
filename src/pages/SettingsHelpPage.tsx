export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Configurações</h1>
        <p className="text-slate-400 text-sm">Preferências do sistema</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Perfil do Sistema', desc: 'Nome, logo e informações da empresa' },
          { title: 'Notificações', desc: 'Configurar alertas e e-mails automáticos' },
          { title: 'Segurança', desc: 'Políticas de senha e autenticação' },
          { title: 'Integrações', desc: 'Conectar com sistemas externos' },
        ].map(s => (
          <div key={s.title} className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5 hover:border-[#4ade80]/30 transition-all cursor-pointer">
            <h3 className="text-white font-semibold text-sm">{s.title}</h3>
            <p className="text-slate-500 text-xs mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Ajuda</h1>
        <p className="text-slate-400 text-sm">Central de suporte do DOS</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Como iniciar uma auditoria?', desc: 'Guia passo a passo para configurar e iniciar o processo de auditoria.' },
          { title: 'Como enviar evidências?', desc: 'Aprenda a fazer upload de fotos e comentários nos subtópicos.' },
          { title: 'Perfis de acesso', desc: 'Entenda as diferenças entre Master Admin e Responsável de Departamento.' },
          { title: 'Relatórios e exportação', desc: 'Como gerar e exportar relatórios em PDF e Excel.' },
          { title: 'Notificações', desc: 'Configure alertas de prazo e itens pendentes.' },
          { title: 'Suporte técnico', desc: 'Contate a equipe de suporte da WLM Scania & Agro.' },
        ].map(h => (
          <div key={h.title} className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5 hover:border-[#4ade80]/30 transition-all cursor-pointer">
            <h3 className="text-white font-semibold text-sm">{h.title}</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">{h.desc}</p>
            <span className="text-[#4ade80] text-xs mt-3 block hover:underline">Ler mais →</span>
          </div>
        ))}
      </div>
    </div>
  );
}