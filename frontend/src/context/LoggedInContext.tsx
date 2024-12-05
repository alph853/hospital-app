import { createContext, useState, useEffect } from "react"
import { isTokenExpired, refreshToken } from "@/utils"

export const LoggedInContext = createContext<{
  loggedIn: boolean
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}>({
  loggedIn: false,
  setLoggedIn: () => {},
})

function LoggedInProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      if (isTokenExpired("refresh_token")) {
        setLoggedIn(false)
        setLoading(false)
        return
      }
      if (isTokenExpired("access_token")) {
        const res = await refreshToken()
        if (!res) {
          setLoggedIn(false)
          setLoading(false)
          return
        }
      }
      setLoggedIn(true)
      setLoading(false)
    })()
  }, [])

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn, loading }}>
      {children}
    </LoggedInContext.Provider>
  )
}

export default LoggedInProvider
