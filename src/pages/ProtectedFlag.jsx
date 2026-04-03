// ProtectedFlag.jsx
import { Navigate } from 'react-router-dom'

function ProtectedFlag({ children }) {
  const unlocked = sessionStorage.getItem('konami_unlocked')

  if (!unlocked) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedFlag