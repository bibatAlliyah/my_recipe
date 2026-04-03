import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Details from './pages/Details'
import Flag from './pages/Flag'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meal/:id" element={<Details />} />
        <Route path="/flag" element={<Flag />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App