import { createContext, useState, useEffect } from "react";
import { routes } from "@/utils";
export const LoggedInContext = createContext<boolean | undefined>(undefined);

function LoggedInProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const { url, options } = routes.verifyLogin();
      const res = await fetch(url, options);
      if (res.ok) {
        setLoggedIn(true);
        return;
      }
      setLoggedIn(false);
    })()
  }, []);

  return <LoggedInContext.Provider value={loggedIn}>{children}</LoggedInContext.Provider>;
}

export default LoggedInProvider;