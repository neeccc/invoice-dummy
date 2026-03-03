import { useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import Document from '../components/Document'
import { documents } from '../data/sakura'
import './SakuraPage.css'

function formatNumber(num) {
  return num.toLocaleString('ja-JP')
}

export default function SakuraPage() {
  const { docType } = useParams()
  const invoiceRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const currentDoc = documents[docType]
  if (!currentDoc) return <Navigate to="/" replace />

  const subtotal = currentDoc.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = currentDoc.items.reduce((sum, item) => sum + Math.floor(item.quantity * item.unitPrice * (item.taxRate / 100)), 0)
  const total = subtotal + tax

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'password') {
      setAuthenticated(true)
      setError('')
    } else {
      setError('ユーザー名またはパスワードが正しくありません。')
    }
  }

  const handleDownload = async () => {
    if (!invoiceRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${currentDoc.docNumber}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="sakura-page">
      {/* ===== Header ===== */}
      <header className="sakura-header">
        <div className="sakura-header-inner">
          <Link to="/" className="sakura-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M12 2C9.5 5 7 7.5 7 11c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3.5-2.5-6-5-9z" fill="#d946a8"/></svg>
            <span className="sakura-logo-text">サクラファイナンス</span>
          </Link>
        </div>
      </header>

      {/* ===== Sub-nav ===== */}
      <div className="sakura-subnav">
        <div className="sakura-subnav-inner">
          <Link to="/" className="sakura-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.354 3.146a.5.5 0 010 .708L6.207 8l4.147 4.146a.5.5 0 01-.708.708l-4.5-4.5a.5.5 0 010-.708l4.5-4.5a.5.5 0 01.708 0z"/></svg>
            一覧に戻る
          </Link>
        </div>
      </div>

      {!authenticated ? (
        /* ===== Login Form ===== */
        <div className="sakura-login-wrapper">
          <div className="sakura-login-card">
            <h2 className="sakura-login-title">ログイン</h2>
            <p className="sakura-login-subtitle">請求書を閲覧するにはログインしてください</p>
            <form onSubmit={handleLogin}>
              {error && <div className="sakura-login-error">{error}</div>}
              <div className="sakura-form-group">
                <label className="sakura-form-label" htmlFor="sakura-username">ユーザー名</label>
                <input
                  id="sakura-username"
                  className="sakura-form-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="sakura-form-group">
                <label className="sakura-form-label" htmlFor="sakura-password">パスワード</label>
                <input
                  id="sakura-password"
                  className="sakura-form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="sakura-login-btn">ログイン</button>
            </form>
          </div>
        </div>
      ) : (
        /* ===== Invoice Viewer ===== */
        <main className="sakura-main">
          <div className="sakura-action-card">
            <div className="sakura-action-card-body">
              <div className="sakura-info-grid">
                <h2 className="sakura-info-title">{currentDoc.title}の確認</h2>
                <div className="sakura-info-rows">
                  <div className="sakura-info-row">
                    <span className="sakura-info-label">送付元</span>
                    <span className="sakura-info-value">{currentDoc.sender.name}</span>
                  </div>
                  <div className="sakura-info-row">
                    <span className="sakura-info-label">書類番号</span>
                    <span className="sakura-info-value">{currentDoc.docNumber}</span>
                  </div>
                  <div className="sakura-info-row">
                    <span className="sakura-info-label">発行日</span>
                    <span className="sakura-info-value">{currentDoc.issueDate}</span>
                  </div>
                  {currentDoc.dueDate && (
                    <div className="sakura-info-row">
                      <span className="sakura-info-label">{currentDoc.dateLabels.due}</span>
                      <span className="sakura-info-value">{currentDoc.dueDate}</span>
                    </div>
                  )}
                  <div className="sakura-info-row">
                    <span className="sakura-info-label">件名</span>
                    <span className="sakura-info-value">{currentDoc.subject}</span>
                  </div>
                  <div className="sakura-info-row total">
                    <span className="sakura-info-label">合計金額</span>
                    <span className="sakura-info-value sakura-info-amount">¥{formatNumber(total)}</span>
                  </div>
                </div>
              </div>

              <div className="sakura-action-buttons">
                <button
                  className="sakura-btn sakura-btn-download"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {downloading ? 'ダウンロード中...' : 'PDFダウンロード'}
                </button>
                <button
                  className="sakura-btn sakura-btn-logout"
                  onClick={() => setAuthenticated(false)}
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>

          <div className="sakura-preview-wrapper">
            <div className="sakura-preview-label">プレビュー</div>
            <div className="sakura-preview" ref={invoiceRef}>
              <Document data={currentDoc} />
            </div>
          </div>
        </main>
      )}

      {/* ===== Footer ===== */}
      <footer className="sakura-footer">
        <p>&copy; Sakura Finance, Inc. — This is a demo replica for reference only.</p>
      </footer>
    </div>
  )
}
