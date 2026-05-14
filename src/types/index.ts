export type Role = 'master' | 'responsible';
export type AuditStatus = 'open' | 'concluded' | 'pending' | 'in_progress';
export type ConformityStatus = 'conforme' | 'nao_conforme' | 'parcialmente' | 'pendente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
  departmentName?: string;
  active: boolean;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  responsible?: string;
  responsibleId?: string;
  conformity?: number;
  status?: AuditStatus;
}

export interface Subtopic {
  id: string;
  topicId: string;
  title: string;
  description: string;
  standardImage?: string;
  criteria?: string[];
  status: ConformityStatus;
  evidenceImages?: string[];
  comment?: string;
  reviewedBy?: string;
}

export interface Topic {
  id: string;
  departmentId: string;
  name: string;
  subtopics: Subtopic[];
  conformity?: number;
}

export interface Audit {
  id: string;
  name: string;
  year: number;
  status: AuditStatus;
  deadline: string;
  departmentId: string;
  departmentName: string;
  conformity?: number;
  topics?: Topic[];
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'success' | 'info';
  read: boolean;
  date: string;
}
