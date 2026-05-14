import { useState } from "react";
import { Plus, Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_AUDITS } from "../mock/data";
import { AuditStatus } from "../types";

const statusColors: Record<string, string> = {
  in_progress: "text-yellow-400 bg-yellow-400/10",
  concluded: "text-green-400 bg-green-400/10",
  pending: "text-red-400 bg-red-400/10",
  open: "text-blue-400 bg-blue-400/10",
};
const statusLabels: Record<string, string> = {
  in_progress: "Em andamento",
  concluded: "Concluída",
  pending: "Pendente",
  open: "Aberta",
};

export default function AuditsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [showNew, setShowNew] = useState(false);

  const filtered = MOCK_AUDITS.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.departmentName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchDept = deptFilter === "all" || a.departmentId === deptFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const depts = Array.from(
    new Set(
      MOCK_AUDITS.map((a) => ({ id: a.departmentId, name: a.departmentName })),
    ),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-white text-2xl font-bold"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            Auditorias
          </h1>
          <p className="text-slate-400 text-sm">
            Lista de todas as auditorias disponíveis
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#060f1e] font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
        >
          <Plus size={16} />
          Nova Auditoria
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar auditoria..."
            className="w-full bg-[#0d1f3c] border border-[#1e3a5f] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#4ade80] transition-colors placeholder:text-slate-600"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="bg-[#0d1f3c] border border-[#1e3a5f] text-slate-300 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#4ade80]"
        >
          <option value="all">Todos os departamentos</option>
          {depts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0d1f3c] border border-[#1e3a5f] text-slate-300 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#4ade80]"
        >
          <option value="all">Todos os status</option>
          <option value="in_progress">Em andamento</option>
          <option value="concluded">Concluída</option>
          <option value="pending">Pendente</option>
          <option value="open">Aberta</option>
        </select>
      </div>

      <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                {[
                  "Auditoria",
                  "Departamento",
                  "Status",
                  "Conformidade",
                  "Prazo",
                  "Ações",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-slate-500 text-xs font-medium uppercase tracking-wider px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-slate-500 py-10 text-sm"
                  >
                    Nenhuma auditoria encontrada.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-[#1e3a5f]/50 hover:bg-[#1e3a5f]/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-white text-sm font-medium">
                      {a.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-sm">
                      {a.departmentName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[a.status]}`}
                      >
                        {statusLabels[a.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {a.conformity !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#060f1e] rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${a.conformity}%`,
                                background:
                                  a.conformity >= 85
                                    ? "#4ade80"
                                    : a.conformity >= 70
                                      ? "#facc15"
                                      : "#f87171",
                              }}
                            />
                          </div>
                          <span
                            className={`text-sm font-semibold ${a.conformity >= 85 ? "text-green-400" : a.conformity >= 70 ? "text-yellow-400" : "text-red-400"}`}
                          >
                            {a.conformity}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-sm">-</span>
                      )}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-sm ${a.status === "pending" ? "text-red-400 font-semibold" : "text-slate-400"}`}
                    >
                      {a.deadline}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/audits/${a.id}`}
                        className="text-slate-400 hover:text-[#4ade80] transition-colors inline-flex"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-2xl p-6 w-full max-w-md">
            <h3
              className="text-white font-bold text-lg mb-4"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Nova Auditoria
            </h3>
            <div className="space-y-3">
              <input
                placeholder="Nome da auditoria"
                className="w-full bg-[#060f1e] border border-[#1e3a5f] text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#4ade80] placeholder:text-slate-600"
              />
              <select className="w-full bg-[#060f1e] border border-[#1e3a5f] text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#4ade80]">
                <option>Selecionar departamento</option>
              </select>
              <input
                type="date"
                className="w-full bg-[#060f1e] border border-[#1e3a5f] text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#4ade80]"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNew(false)}
                className="flex-1 bg-[#1e3a5f] text-slate-300 text-sm py-2.5 rounded-lg hover:bg-[#1e3a5f]/70 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="flex-1 bg-[#4ade80] text-[#060f1e] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#22c55e] transition-all"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
