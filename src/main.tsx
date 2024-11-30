import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.scss'
import LoggedInProvider from './context/LoggedInContext'
import MyRouter from './Routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoggedInProvider>
      <MyRouter />
    </LoggedInProvider>
  </StrictMode>,
)
