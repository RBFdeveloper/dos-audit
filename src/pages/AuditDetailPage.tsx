import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, Save, CheckCircle, XCircle, AlertCircle, Clock, X, CheckCircle2 } from 'lucide-react';
import { MOCK_TOPICS, MOCK_AUDITS } from '../mock/data';
import { ConformityStatus } from '../types';
import { useStore, SubtopicState } from '../context/StoreContext';

const statusConfig: Record<ConformityStatus, { label: string; activeStyle: React.CSSProperties; icon: any }> = {
  conforme: {
    label: 'Conforme',
    activeStyle: { color: '#4ade80', background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.4)' },
    icon: CheckCircle,
  },
  nao_conforme: {
    label: 'Não Conforme',
    activeStyle: { color: '#f87171', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.4)' },
    icon: XCircle,
  },
  parcialmente: {
    label: 'Parcialmente',
    activeStyle: { color: '#facc15', background: 'rgba(250,204,21,0.1)', borderColor: 'rgba(250,204,21,0.4)' },
    icon: AlertCircle,
  },
  pendente: {
    label: 'Pendente',
    activeStyle: { color: 'var(--text-secondary)', background: 'rgba(148,163,184,0.1)', borderColor: 'rgba(148,163,184,0.3)' },
    icon: Clock,
  },
};

export default function AuditDetailPage() {
  const { id } = useParams();
  const audit = MOCK_AUDITS.find(a => a.id === id);
  const topics = MOCK_TOPICS.filter(t => t.departmentId === audit?.departmentId);
  const { subtopicStates, saveSubtopic } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSubIdx, setActiveSubIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  const allSubtopics = topics.flatMap(t => t.subtopics.map(s => ({ ...s, topicName: t.name })));
  const currentSub = allSubtopics[activeSubIdx];

  const getState = (id: string): SubtopicState => subtopicStates[id] ?? {
    status: allSubtopics.find(s => s.id === id)?.status ?? 'pendente',
    comment: allSubtopics.find(s => s.id === id)?.comment ?? '',
    evidenceImages: allSubtopics.find(s => s.id === id)?.evidenceImages ?? [],
  };

  if (!audit) return <div className="p-8" style={{ color: 'var(--text-primary)' }}>Auditoria não encontrada.</div>;
  if (!currentSub) return <div className="p-8" style={{ color: 'var(--text-secondary)' }}>Sem subtópicos.</div>;

  const currentState = getState(currentSub.id);

  const updateCurrent = (patch: Partial<SubtopicState>) => {
    saveSubtopic(currentSub.id, { ...currentState, ...patch });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = Math.max(0, 6 - currentState.evidenceImages.length);
    Array.from(files).slice(0, remaining).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        updateCurrent({ evidenceImages: [...currentState.evidenceImages, e.target?.result as string] });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 20,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          to="/audits"
          className="flex items-center gap-1 text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={16} />
          Voltar para auditorias
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div style={{ ...cardStyle, padding: 16 }} className="lg:w-64 lg:self-start">
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
            {audit.name}
          </h3>
          <div className="space-y-1">
            {topics.map((topic, ti) => (
              <div key={topic.id}>
                <div className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5" style={{ color: 'var(--text-muted)' }}>
                  {topic.name}
                </div>
                {topic.subtopics.map((sub, si) => {
                  const flatIdx = topics.slice(0, ti).reduce((acc, t) => acc + t.subtopics.length, 0) + si;
                  const st = getState(sub.id).status;
                  const isActive = flatIdx === activeSubIdx;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubIdx(flatIdx)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2"
                      style={isActive
                        ? { background: 'var(--accent)', color: 'var(--accent-dark)', fontWeight: 600 }
                        : { color: 'var(--text-secondary)', background: 'transparent' }
                      }
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        st === 'conforme' ? 'bg-green-400' :
                        st === 'nao_conforme' ? 'bg-red-400' :
                        st === 'parcialmente' ? 'bg-yellow-400' : 'bg-slate-500'
                      }`} />
                      {sub.title}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div style={cardStyle}>
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <span>{activeSubIdx + 1} de {allSubtopics.length}</span>
              <span>·</span>
              <span style={{ color: 'var(--accent)' }}>{(currentSub as any).topicName}</span>
              <span>·</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                {audit.departmentName}
              </span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
              {activeSubIdx + 1}. {currentSub.title}
            </h2>
          </div>

          <div style={cardStyle}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              Padrão Esperado
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {currentSub.description}
            </p>
            {currentSub.criteria && (
              <div className="mb-4 space-y-1.5">
                <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                  Critérios de aceite:
                </div>
                {currentSub.criteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    {c}
                  </div>
                ))}
              </div>
            )}
            {currentSub.standardImage && (
              <img src={currentSub.standardImage} alt="Padrão" className="w-full max-w-md rounded-lg object-cover h-48" />
            )}
          </div>

          <div style={cardStyle}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
              Avaliação
            </h3>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(statusConfig) as [ConformityStatus, typeof statusConfig[ConformityStatus]][]).map(([key, conf]) => {
                const Icon = conf.icon;
                const active = currentState.status === key;
                return (
                  <button
                    key={key}
                    onClick={() => updateCurrent({ status: key })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                    style={active
                      ? conf.activeStyle
                      : { color: 'var(--text-muted)', background: 'transparent', borderColor: 'var(--border)' }
                    }
                  >
                    <Icon size={15} />
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
              Comentário
            </h3>
            <textarea
              value={currentState.comment}
              onChange={e => updateCurrent({ comment: e.target.value })}
              placeholder="Digite seu comentário..."
              rows={3}
              className="w-full text-sm rounded-lg px-4 py-3 outline-none transition-colors resize-none"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={cardStyle}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
              Evidências (Fotos) — {currentState.evidenceImages.length}/6
            </h3>

            {currentState.evidenceImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {currentState.evidenceImages.map((img, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden aspect-square">
                    <img src={img} alt={`Evidência ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const next = currentState.evidenceImages.filter((_, idx) => idx !== i);
                        updateCurrent({ evidenceImages: next });
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentState.evidenceImages.length < 6 && (
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
                style={{ borderColor: 'var(--border)' }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                onDragOver={e => e.preventDefault()}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)')}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
              >
                <Upload size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Clique para anexar fotos</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>ou arraste e solte aqui · Máximo 6</div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          <div className="flex items-center justify-between pb-4">
            <button
              onClick={() => setActiveSubIdx(i => Math.max(0, i - 1))}
              disabled={activeSubIdx === 0}
              className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              <ChevronLeft size={16} /> Voltar
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg transition-all"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                {saved ? <CheckCircle2 size={15} style={{ color: 'var(--accent)' }} /> : <Save size={15} />}
                {saved ? 'Salvo!' : 'Salvar'}
              </button>
              <button
                onClick={() => setActiveSubIdx(i => Math.min(allSubtopics.length - 1, i + 1))}
                disabled={activeSubIdx === allSubtopics.length - 1}
                className="flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}
              >
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}