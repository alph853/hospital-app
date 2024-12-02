import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "../context/LoggedInContext";

function useAuth() {
  const isLoggedIn =  useContext(LoggedInContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn])
}

export default useAuth;