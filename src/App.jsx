import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MoneyForwardPage from './pages/MoneyForwardPage'
import HajimariPage from './pages/HajimariPage'
import SakuraPage from './pages/SakuraPage'
import KuraCloudPage from './pages/KuraCloudPage'
import KuraCloudEmail from './pages/KuraCloudEmail'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moneyforward/:docType" element={<MoneyForwardPage />} />
        <Route path="/hajimari/download" element={<HajimariPage />} />
        <Route path="/sakura/:docType" element={<SakuraPage />} />
        <Route path="/kuracloud/email/:emailType" element={<KuraCloudEmail />} />
        <Route path="/kuracloud/:docType" element={<KuraCloudPage />} />
      </Routes>
    </BrowserRouter>
  )
}
