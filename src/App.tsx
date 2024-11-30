import useAuth from "./hooks/useAuth"
import { Navigate } from "react-router-dom"

function App({children}: {children?: React.ReactNode}) {
  const [isLoggedIn, _] = useAuth()
  
  return (
    <div>
      {isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      {children}
    </div>
  )
}

export default App
