import { createContext, useContext, useState } from "react";

type Ctx = { list: any[]; setList: (x: any[]) => void };
const C = createContext<Ctx>({ list: [], setList: () => {} });

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<any[]>([]);
  return <C.Provider value={{ list, setList }}>{children}</C.Provider>;
}

export const useList = () => useContext(C);
