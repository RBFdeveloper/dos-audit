import { useAuth } from '../../context/AuthContext';
import { MOCK_AUDITS, MOCK_TOPICS } from '../../mock/data';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResponsibleDashboard() {
  const { user } = useAuth();
  const myAudit = MOCK_AUDITS.find(a => a.departmentId === user?.departmentId);
  const myTopics = MOCK_TOPICS.filter(t => t.departmentId === user?.departmentId);
  const totalSubtopics = myTopics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const done = myTopics.reduce((acc, t) => acc + t.subtopics.filter(s => s.status !== 'pendente').length, 0);
  const progress = totalSubtopics > 0 ? Math.round((done / totalSubtopics) * 100) : 0;

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
          Olá, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Departamento:{' '}
          <span className="font-semibold" style={{ color: 'var(--accent)' }}>{user?.departmentName}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div style={cardStyle} className="col-span-2 sm:col-span-1">
          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Meu Setor</div>
          <div className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
            {user?.departmentName}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
            {myAudit?.name ?? 'Sem auditoria ativa'}
          </div>
        </div>
        <div style={cardStyle}>
          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Pendentes</div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#facc15' }}>
            {totalSubtopics - done}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>itens</div>
        </div>
        <div style={cardStyle}>
          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Prazo</div>
          <div className="text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f87171' }}>
            {myAudit?.deadline ?? '-'}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>vencimento</div>
        </div>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Progresso da Auditoria
          </h3>
          <span className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--accent)' }}>
            {progress}%
          </span>
        </div>
        <div className="w-full rounded-full h-3" style={{ background: 'var(--bg-base)' }}>
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: progress >= 80 ? '#4ade80' : progress >= 50 ? '#facc15' : '#f87171',
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{done} concluídos</span>
          <span>{totalSubtopics} total</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Tópicos do Meu Setor
          </h3>
        </div>
        {myTopics.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Nenhum tópico atribuído ao seu departamento.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {myTopics.map(topic => {
              const topicDone = topic.subtopics.filter(s => s.status !== 'pendente').length;
              const topicProgress = Math.round((topicDone / topic.subtopics.length) * 100);
              return (
                <Link
                  key={topic.id}
                  to={`/my-audits/${topic.id}`}
                  className="flex items-center justify-between px-5 py-4 transition-colors"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'color-mix(in srgb, var(--bg-hover) 50%, transparent)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {topic.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {topic.subtopics.length} subtópicos
                    </div>
                    <div className="mt-2 w-48 rounded-full h-1.5" style={{ background: 'var(--bg-base)' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${topicProgress}%`, background: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      {topicProgress === 100 ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)' }}>
                          Concluído
                        </span>
                      ) : topicProgress > 0 ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ color: '#facc15', background: 'rgba(250,204,21,0.1)' }}>
                          Em andamento
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ color: 'var(--text-secondary)', background: 'rgba(148,163,184,0.1)' }}>
                          Não iniciado
                        </span>
                      )}
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}