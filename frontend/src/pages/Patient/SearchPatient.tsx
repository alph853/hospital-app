import { useState } from "react"
import { Patient } from "@/entities"
import QuickFind from "@/components/QuickFind"
import InfoGrid from "@/components/InfoGrid"
import { routes, parseSearch } from "@/utils"
import { Link, useNavigate } from "react-router-dom"
import styles from "@/styles/SearchPatient.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import useAuth from "@/hooks/useAuth"
function SearchPatient() {
  useAuth()
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const searchPatient = async (search: string) => {
    if (!search) {
      setError("Please enter a search term")
      return
    }
    setError("")
    setLoading(true)

    const searchResult = parseSearch(search)
    if (!searchResult) {
      setError("Invalid search term")
      return
    }
    const { id, fname, lname } = searchResult
    const { url, options } = await routes.patientSearch(id, fname, lname)
    if (!options) {
      navigate("/login")
      return
    }
    const res = await fetch(url, options)
    if (res.ok) {
      const data = await res.json()
      setPatients(data)
    }
    setLoading(false)
    // setPatients(samplePatients)
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <QuickFind onSubmit={searchPatient} placeholder={"Enter ID/Name"} />

        <Link to="/patient/add" className={styles.add}>
          <FontAwesomeIcon icon={faPlusCircle} /> Add Patient
        </Link>
      </div>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}
      {!loading && !error && patients.length > 0 && (
        <InfoGrid entities={patients} rows={10} />
      )}
    </div>
  )
}

export default SearchPatient
