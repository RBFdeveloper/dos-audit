import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, CheckCircle, XCircle, AlertCircle, Clock, Upload, X, CheckCircle2 } from 'lucide-react';
import { MOCK_TOPICS } from '../mock/data';
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

export default function TopicAuditPage() {
  const { topicId } = useParams();
  const topic = MOCK_TOPICS.find(t => t.id === topicId);
  const { subtopicStates, saveSubtopic } = useStore();

  const [subIdx, setSubIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!topic) return <div className="p-8" style={{ color: 'var(--text-primary)' }}>Tópico não encontrado.</div>;

  const sub = topic.subtopics[subIdx];

  const getState = (id: string): SubtopicState => subtopicStates[id] ?? {
    status: topic.subtopics.find(s => s.id === id)?.status ?? 'pendente',
    comment: topic.subtopics.find(s => s.id === id)?.comment ?? '',
    evidenceImages: topic.subtopics.find(s => s.id === id)?.evidenceImages ?? [],
  };

  const currentState = getState(sub.id);

  const updateCurrent = (patch: Partial<SubtopicState>) => {
    saveSubtopic(sub.id, { ...currentState, ...patch });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = Math.max(0, 6 - currentState.evidenceImages.length);
    const toProcess = Array.from(files).slice(0, remaining);
    toProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target?.result as string;
        updateCurrent({ evidenceImages: [...currentState.evidenceImages, dataUrl] });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    const next = currentState.evidenceImages.filter((_, i) => i !== idx);
    updateCurrent({ evidenceImages: next });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 20,
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          to="/my-audits"
          className="flex items-center gap-1 text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={16} />
          Voltar
        </Link>
      </div>

      <div style={cardStyle}>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
          {topic.name}
        </div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
          {subIdx + 1}. {sub.title}
        </h2>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {subIdx + 1} de {topic.subtopics.length}
        </div>
        <div className="mt-3 w-full rounded-full h-1.5" style={{ background: 'var(--bg-base)' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${((subIdx + 1) / topic.subtopics.length) * 100}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>

      <div style={cardStyle}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
          Padrão Esperado
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {sub.description}
        </p>
        {sub.criteria && (
          <div className="space-y-1.5 mb-4">
            {sub.criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <CheckCircle size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                {c}
              </div>
            ))}
          </div>
        )}
        {sub.standardImage && (
          <img src={sub.standardImage} alt="Padrão" className="w-full rounded-lg object-cover h-48" />
        )}
      </div>

      <div style={cardStyle}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
          Avaliação
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(statusConfig) as [ConformityStatus, typeof statusConfig[ConformityStatus]][]).map(([key, conf]) => {
            const Icon = conf.icon;
            const active = currentState.status === key;
            return (
              <button
                key={key}
                onClick={() => updateCurrent({ status: key })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all"
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
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
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
                  onClick={() => removeImage(i)}
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
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer group transition-colors"
            style={{ borderColor: 'var(--border)' }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)')}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
          >
            <Upload size={24} className="mx-auto mb-2 transition-colors" style={{ color: 'var(--text-muted)' }} />
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Clique para anexar fotos
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              ou arraste e solte aqui · Máximo 6 arquivos
            </div>
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
          onClick={() => setSubIdx(i => Math.max(0, i - 1))}
          disabled={subIdx === 0}
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

          {subIdx < topic.subtopics.length - 1 ? (
            <button
              onClick={() => setSubIdx(i => i + 1)}
              className="flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
              style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}
            >
              Próximo <ChevronRight size={16} />
            </button>
          ) : (
            <Link
              to="/my-audits"
              className="flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
              style={{ background: 'var(--accent)', color: 'var(--accent-dark)' }}
            >
              Finalizar <CheckCircle size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}