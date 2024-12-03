import { createContext, useState, useEffect } from "react";
import { isTokenExpired, refreshToken} from "@/utils";
export const LoggedInContext = createContext<boolean | undefined>(undefined);

function LoggedInProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      if (isTokenExpired('refresh_token')) {
        setLoggedIn(false);
        return;
      }
      if (isTokenExpired('access_token')) {
        const res = await refreshToken();
        if (!res) {
          setLoggedIn(false);
          return;
        }
      }
      setLoggedIn(true);
    })()
  }, []);

  return <LoggedInContext.Provider value={loggedIn}>{children}</LoggedInContext.Provider>;
}

export default LoggedInProvider;