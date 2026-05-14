import { User, Department, Audit, Topic, Notification } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ramon Silva', email: 'ramonbarbosa@wlm.com.br', role: 'master', departmentId: null, active: true },
  { id: 'u2', name: 'Sandro Lubanco', email: 'sandrolubanco@wlm.com.br', role: 'responsible', departmentId: 'd1', departmentName: 'Oficina', active: true },
  { id: 'u3', name: 'Flávia Gomes', email: 'flaviagomes@wlm.com.br', role: 'responsible', departmentId: 'd2', departmentName: 'Administrativo', active: true },
  { id: 'u4', name: 'Marcos Pereira', email: 'marcospereira@wlm.com.br', role: 'responsible', departmentId: 'd3', departmentName: 'Almoxarifado', active: true },
  { id: 'u5', name: 'Ana Costa', email: 'anacosta@wlm.com.br', role: 'responsible', departmentId: 'd4', departmentName: 'Garantia', active: true },
  { id: 'u6', name: 'Roberto Dias', email: 'robertodias@wlm.com.br', role: 'responsible', departmentId: 'd5', departmentName: 'Consultoria Técnica', active: false },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Oficina', responsible: 'Sandro Lubanco', responsibleId: 'u2', conformity: 78, status: 'in_progress' },
  { id: 'd2', name: 'Administrativo', responsible: 'Flávia Gomes', responsibleId: 'u3', conformity: 92, status: 'concluded' },
  { id: 'd3', name: 'Almoxarifado', responsible: 'Marcos Pereira', responsibleId: 'u4', conformity: 90, status: 'in_progress' },
  { id: 'd4', name: 'Garantia', responsible: 'Ana Costa', responsibleId: 'u5', conformity: 80, status: 'pending' },
  { id: 'd5', name: 'Consultoria Técnica', responsible: 'Roberto Dias', responsibleId: 'u6', conformity: 85, status: 'in_progress' },
  { id: 'd6', name: 'Peças', responsible: '-', conformity: 0, status: 'pending' },
  { id: 'd7', name: 'Atendimento', responsible: '-', conformity: 65, status: 'in_progress' },
];

export const MOCK_TOPICS: Topic[] = [
  {
    id: 't1', departmentId: 'd1', name: 'Organização do Box', conformity: 75,
    subtopics: [
      {
        id: 's1', topicId: 't1', title: 'Piso Limpo e Sinalizado',
        description: 'O box deve estar limpo, organizado e com as ferramentas nos locais adequados. Não deve haver vazamento de óleo ou materiais no piso.',
        criteria: ['Piso sem óleo ou resíduos', 'Sinalização de piso visível', 'Área de circulação livre'],
        standardImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
        status: 'conforme', comment: 'Piso em perfeito estado', evidenceImages: [],
      },
      {
        id: 's2', topicId: 't1', title: 'Ferramentas Organizadas',
        description: 'Todas as ferramentas devem estar no painel ou carro de ferramentas, identificadas e em bom estado de conservação.',
        criteria: ['Ferramentas no local designado', 'Identificação visível', 'Sem ferramentas danificadas'],
        standardImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
        status: 'nao_conforme', comment: 'Algumas chaves inglesas fora do lugar', evidenceImages: [],
      },
      {
        id: 's3', topicId: 't1', title: 'Área Delimitada',
        description: 'A área do box deve ser claramente delimitada com fita amarela ou pintura no piso.',
        criteria: ['Delimitação visível e conservada', 'Área correta por tamanho de veículo'],
        standardImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80',
        status: 'pendente', evidenceImages: [],
      },
    ],
  },
  {
    id: 't2', departmentId: 'd1', name: 'EPIs e Segurança', conformity: 82,
    subtopics: [
      {
        id: 's4', topicId: 't2', title: 'EPIs Disponíveis',
        description: 'Todos os EPIs obrigatórios devem estar disponíveis, em bom estado e acessíveis ao técnico.',
        criteria: ['Capacete disponível', 'Luvas de procedimento', 'Óculos de segurança', 'Calçado de segurança'],
        standardImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
        status: 'conforme', evidenceImages: [],
      },
    ],
  },
  {
    id: 't3', departmentId: 'd1', name: 'Processo de Serviço', conformity: 70,
    subtopics: [
      {
        id: 's5', topicId: 't3', title: 'Ordem de Serviço Aberta',
        description: 'Toda OS deve estar impressa e disponível no box antes do início do serviço.',
        criteria: ['OS impressa e legível', 'Checklist preenchido', 'Técnico identificado'],
        standardImage: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80',
        status: 'parcialmente', comment: 'OS impressa mas checklist incompleto', evidenceImages: [],
      },
    ],
  },
  {
    id: 't4', departmentId: 'd2', name: 'Documentação', conformity: 95,
    subtopics: [
      {
        id: 's6', topicId: 't4', title: 'Arquivos Organizados',
        description: 'Todos os documentos devem estar organizados em pastas identificadas e arquivados corretamente.',
        criteria: ['Pastas identificadas', 'Documentos em ordem cronológica', 'Sem documentos soltos'],
        standardImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
        status: 'conforme', evidenceImages: [],
      },
    ],
  },
  {
    id: 't5', departmentId: 'd3', name: 'Controle de Estoque', conformity: 88,
    subtopics: [
      {
        id: 's7', topicId: 't5', title: 'Inventário Atualizado',
        description: 'O sistema de estoque deve refletir exatamente a quantidade física de peças disponíveis.',
        criteria: ['Sistema atualizado', 'Divergência máxima de 2%', 'Contagem semanal realizada'],
        standardImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80',
        status: 'conforme', evidenceImages: [],
      },
    ],
  },
];

export const MOCK_AUDITS: Audit[] = [
  { id: 'a1', name: 'DOS 2026- Oficina', year: 2026, status: 'in_progress', deadline: '25/01/2026', departmentId: 'd1', departmentName: 'Oficina', conformity: 78, createdAt: '01/01/2026' },
  { id: 'a2', name: 'DOS 2026- Almoxarifado', year: 2026, status: 'in_progress', deadline: '26/01/2026', departmentId: 'd3', departmentName: 'Almoxarifado', conformity: 90, createdAt: '01/01/2026' },
  { id: 'a3', name: 'DOS 2026- Administrativo', year: 2026, status: 'concluded', deadline: '20/01/2026', departmentId: 'd2', departmentName: 'Administrativo', conformity: 92, createdAt: '01/01/2026' },
  { id: 'a4', name: 'DOS 2026- Consultoria Técnica', year: 2026, status: 'in_progress', deadline: '27/01/2026', departmentId: 'd5', departmentName: 'Consultoria Técnica', conformity: 85, createdAt: '01/01/2026' },
  { id: 'a5', name: 'DOS 2026- Garantia', year: 2026, status: 'pending', deadline: '30/01/2026', departmentId: 'd4', departmentName: 'Garantia', conformity: undefined, createdAt: '01/01/2026' },
  { id: 'a6', name: 'DOS 2026- Atendimento', year: 2026, status: 'in_progress', deadline: '28/01/2026', departmentId: 'd7', departmentName: 'Atendimento', conformity: 65, createdAt: '01/01/2026' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Prazo Próximo', message: 'Oficina - Organização do Box vence em 2 dias', type: 'warning', read: false, date: '2026-05-13' },
  { id: 'n2', title: 'Item Reprovado', message: 'Ferramentas Organizadas foi reprovado pelo auditor', type: 'danger', read: false, date: '2026-03-12' },
  { id: 'n3', title: 'Auditoria Enviada', message: 'Almoxarifado enviou evidências para revisão', type: 'info', read: true, date: '2026-02-03' },
  { id: 'n4', title: 'Aprovado', message: 'Documentação Administrativa aprovada com sucesso', type: 'success', read: true, date: '2026-02-10' },
];

export const CONFORMITY_BY_DEPT = [
  { name: 'Administrativo', value: 92, fill: '#4ade80' },
  { name: 'Oficina', value: 78, fill: '#facc15' },
  { name: 'Consultoria', value: 85, fill: '#60a5fa' },
  { name: 'Almoxarifado', value: 90, fill: '#34d399' },
  { name: 'Garantia', value: 80, fill: '#f87171' },
];
