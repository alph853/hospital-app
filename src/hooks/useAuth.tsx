import { LoggedInContext } from "@/context/LoggedInContext";
import { useContext } from "react";

function useAuth() {
  const context =  useContext(LoggedInContext)
  if (!context) throw new Error("useAuth must be used within a LoggedInProvider")
  return context
}

export default useAuth;