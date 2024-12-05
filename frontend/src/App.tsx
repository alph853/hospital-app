import useAuth from "./hooks/useAuth"
import { Navigate } from "react-router-dom"

function App({children}: {children?: React.ReactNode}) {
  useAuth()
  
  return (
    <div>
      {<Navigate to="/dashboard" />}
      {children}
    </div>
  )
}

export default App
