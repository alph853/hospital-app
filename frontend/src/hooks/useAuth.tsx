import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoggedInContext } from "../context/LoggedInContext"

function useAuth() {
  const { loggedIn, setLoggedIn, loading } = useContext(LoggedInContext)
  const navigate = useNavigate()
  console.log("isLoggedIn", loggedIn)
  useEffect(() => {
    if (!loggedIn && !loading) {
      navigate("/login")
    }
  }, [loggedIn, loading])
  return [loggedIn, setLoggedIn]
}

export default useAuth
