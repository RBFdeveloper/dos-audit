import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Department, Topic, ConformityStatus } from "../types";
import {
  MOCK_USERS as INITIAL_USERS,
  MOCK_DEPARTMENTS as INITIAL_DEPTS,
  MOCK_TOPICS as INITIAL_TOPICS,
} from "../mock/data";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export interface SubtopicState {
  status: ConformityStatus;
  comment: string;
  evidenceImages: string[]; 
}

interface StoreContextType {
  subtopicStates: Record<string, SubtopicState>;
  saveSubtopic: (id: string, state: SubtopicState) => void;

  departments: Department[];
  addDepartment: (d: Department) => void;

  users: User[];
  addUser: (u: User) => void;
  updateUser: (u: User) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [subtopicStates, setSubtopicStates] = useState<
    Record<string, SubtopicState>
  >(() => load("dos-subtopics", {}));
  const [departments, setDepartments] = useState<Department[]>(() =>
    load("dos-departments", INITIAL_DEPTS),
  );
  const [users, setUsers] = useState<User[]>(() =>
    load("dos-users", INITIAL_USERS),
  );

  const saveSubtopic = (id: string, state: SubtopicState) => {
    setSubtopicStates((prev) => {
      const next = { ...prev, [id]: state };
      save("dos-subtopics", next);
      return next;
    });
  };

  const addDepartment = (d: Department) => {
    setDepartments((prev) => {
      const next = [...prev, d];
      save("dos-departments", next);
      return next;
    });
  };

  const addUser = (u: User) => {
    setUsers((prev) => {
      const next = [...prev, u];
      save("dos-users", next);
      return next;
    });
  };

  const updateUser = (u: User) => {
    setUsers((prev) => {
      const next = prev.map((x) => (x.id === u.id ? u : x));
      save("dos-users", next);
      return next;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        subtopicStates,
        saveSubtopic,
        departments,
        addDepartment,
        users,
        addUser,
        updateUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
