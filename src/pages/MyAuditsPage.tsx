import { useAuth } from "../context/AuthContext";
import { MOCK_TOPICS } from "../mock/data";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { ConformityStatus } from "../types";

const statusIcon: Record<ConformityStatus, any> = {
  conforme: CheckCircle,
  nao_conforme: XCircle,
  parcialmente: AlertCircle,
  pendente: Clock,
};
const statusColor: Record<ConformityStatus, string> = {
  conforme: "text-green-400",
  nao_conforme: "text-red-400",
  parcialmente: "text-yellow-400",
  pendente: "text-slate-400",
};

export default function MyAuditsPage() {
  const { user } = useAuth();
  const myTopics = MOCK_TOPICS.filter(
    (t) => t.departmentId === user?.departmentId,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-white text-2xl font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Minhas Auditorias
        </h1>
        <p className="text-slate-400 text-sm">
          Departamento:{" "}
          <span className="text-[#4ade80]">{user?.departmentName}</span>
        </p>
      </div>

      {myTopics.length === 0 ? (
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-12 text-center">
          <div className="text-slate-500 text-sm">
            Nenhum tópico atribuído ao seu departamento.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {myTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[#1e3a5f] flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{topic.name}</h3>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {topic.subtopics.length} subtópicos
                  </div>
                </div>
                <div
                  className="text-[#4ade80] font-bold text-lg"
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  {topic.conformity}%
                </div>
              </div>
              <div className="divide-y divide-[#1e3a5f]/50">
                {topic.subtopics.map((sub) => {
                  const Icon = statusIcon[sub.status];
                  return (
                    <Link
                      key={sub.id}
                      to={`/my-audits/${topic.id}`}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-[#1e3a5f]/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={statusColor[sub.status]} />
                        <div>
                          <div className="text-white text-sm">{sub.title}</div>
                          {sub.comment && (
                            <div className="text-slate-500 text-xs mt-0.5">
                              {sub.comment}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-slate-500" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
