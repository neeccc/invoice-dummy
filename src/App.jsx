import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MoneyForwardPage from './pages/MoneyForwardPage'
import HajimariPage from './pages/HajimariPage'
import SakuraPage from './pages/SakuraPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moneyforward/:docType" element={<MoneyForwardPage />} />
        <Route path="/hajimari/download" element={<HajimariPage />} />
        <Route path="/sakura/:docType" element={<SakuraPage />} />
      </Routes>
    </BrowserRouter>
  )
}
