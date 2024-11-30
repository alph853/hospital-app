import { createContext, useState, Dispatch, SetStateAction } from "react";

type LoggedInContextType = [boolean, Dispatch<SetStateAction<boolean>>];

export const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined);

function LoggedInProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  return <LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>{children}</LoggedInContext.Provider>;
}

export default LoggedInProvider;