import { useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import Document from '../components/Document'
import { documents, credentials } from '../data/kuracloud'
import './KuraCloudPage.css'

function formatNumber(num) {
  return num.toLocaleString('ja-JP')
}

export default function KuraCloudPage() {
  const { docType } = useParams()
  const invoiceRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const currentDoc = documents[docType]
  if (!currentDoc) return <Navigate to="/" replace />

  const subtotal = currentDoc.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = currentDoc.items.reduce((sum, item) => sum + Math.floor(item.quantity * item.unitPrice * (item.taxRate / 100)), 0)
  const total = subtotal + tax

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === credentials.email && password === credentials.password) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('メールアドレスまたはパスワードが正しくありません。')
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
      setDownloaded(true)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  const Header = () => (
    <>
      <header className="kura-header">
        <div className="kura-header-inner">
          <Link to="/" className="kura-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#fff"/>
              <path d="M6 8h12M6 12h8M6 16h10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="kura-logo-text">KuraCloud</span>
          </Link>
        </div>
      </header>
      <div className="kura-subnav">
        <div className="kura-subnav-inner">
          <Link to="/" className="kura-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.354 3.146a.5.5 0 010 .708L6.207 8l4.147 4.146a.5.5 0 01-.708.708l-4.5-4.5a.5.5 0 010-.708l4.5-4.5a.5.5 0 01.708 0z"/>
            </svg>
            一覧に戻る
          </Link>
        </div>
      </div>
    </>
  )

  // Download complete page
  if (downloaded) {
    return (
      <div className="kura-page">
        <Header />
        <div className="kura-complete-wrapper">
          <div className="kura-complete-card">
            <div className="kura-complete-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#dcfce7"/>
                <path d="M14 24l7 7 13-13" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="kura-complete-title">ダウンロード完了</h2>
            <p className="kura-complete-desc">
              請求書のPDFファイルが正常にダウンロードされました。
            </p>
            <div className="kura-complete-info">
              <div className="kura-complete-row">
                <span className="kura-complete-label">ファイル名</span>
                <span className="kura-complete-value">{currentDoc.docNumber}.pdf</span>
              </div>
              <div className="kura-complete-row">
                <span className="kura-complete-label">書類番号</span>
                <span className="kura-complete-value">{currentDoc.docNumber}</span>
              </div>
              <div className="kura-complete-row">
                <span className="kura-complete-label">合計金額</span>
                <span className="kura-complete-value">¥{formatNumber(total)}</span>
              </div>
            </div>
            <p className="kura-complete-note">
              ご不明な点がございましたら、送付元の担当者までお問い合わせください。
            </p>
            <button
              className="kura-btn kura-btn-back"
              onClick={() => { setDownloaded(false) }}
            >
              請求書に戻る
            </button>
          </div>
        </div>
        <footer className="kura-footer">
          <p>&copy; KuraCloud, Inc. — This is a demo replica for reference only.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="kura-page">
      <Header />

      {!authenticated ? (
        <div className="kura-login-wrapper">
          <div className="kura-login-card">
            <div className="kura-login-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#eff6ff"/>
                <path d="M20 12v6m0 0v2m0-2h0m-6 6a6 6 0 1112 0v2H14v-2z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="kura-login-title">請求書のダウンロード</h2>
            <p className="kura-login-subtitle">
              この請求書を閲覧するには、メールアドレスとパスワードを入力してください。
              パスワードは別途メールでお送りしています。
            </p>
            <form onSubmit={handleLogin}>
              {error && <div className="kura-login-error">{error}</div>}
              <div className="kura-form-group">
                <label className="kura-form-label" htmlFor="kura-email">メールアドレス</label>
                <input
                  id="kura-email"
                  className="kura-form-input"
                  type="email"
                  placeholder="example@company.co.jp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="kura-form-group">
                <label className="kura-form-label" htmlFor="kura-password">パスワード</label>
                <input
                  id="kura-password"
                  className="kura-form-input"
                  type="password"
                  placeholder="別メールで送付されたパスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="kura-login-btn">ログインして閲覧</button>
            </form>
            <div className="kura-login-help">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#94a3b8">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 8.5a.75.75 0 01-1.5 0V7.25a.75.75 0 011.5 0V8.5zM8 4a2.25 2.25 0 00-2.25 2.25.75.75 0 001.5 0 .75.75 0 111.5 0c0 .41-.168.585-.547.883l-.14.109C7.578 7.636 7.25 8.082 7.25 9a.75.75 0 001.5 0c0-.41.168-.585.547-.883l.14-.109C9.922 7.614 10.25 7.168 10.25 6.25A2.25 2.25 0 008 4z"/>
              </svg>
              <span>パスワードが届かない場合は、迷惑メールフォルダをご確認ください。</span>
            </div>
          </div>
        </div>
      ) : (
        <main className="kura-main">
          <div className="kura-action-card">
            <div className="kura-action-card-body">
              <div className="kura-info-grid">
                <h2 className="kura-info-title">{currentDoc.title}の確認</h2>
                <div className="kura-info-rows">
                  <div className="kura-info-row">
                    <span className="kura-info-label">送付元</span>
                    <span className="kura-info-value">{currentDoc.sender.name}</span>
                  </div>
                  <div className="kura-info-row">
                    <span className="kura-info-label">書類番号</span>
                    <span className="kura-info-value">{currentDoc.docNumber}</span>
                  </div>
                  <div className="kura-info-row">
                    <span className="kura-info-label">発行日</span>
                    <span className="kura-info-value">{currentDoc.issueDate}</span>
                  </div>
                  {currentDoc.dueDate && (
                    <div className="kura-info-row">
                      <span className="kura-info-label">{currentDoc.dateLabels.due}</span>
                      <span className="kura-info-value">{currentDoc.dueDate}</span>
                    </div>
                  )}
                  <div className="kura-info-row">
                    <span className="kura-info-label">件名</span>
                    <span className="kura-info-value">{currentDoc.subject}</span>
                  </div>
                  <div className="kura-info-row total">
                    <span className="kura-info-label">合計金額</span>
                    <span className="kura-info-value kura-info-amount">¥{formatNumber(total)}</span>
                  </div>
                </div>
              </div>

              <div className="kura-action-buttons">
                <button
                  className="kura-btn kura-btn-download"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {downloading ? 'ダウンロード中...' : 'PDFダウンロード'}
                </button>
                <button
                  className="kura-btn kura-btn-logout"
                  onClick={() => { setAuthenticated(false); setEmail(''); setPassword('') }}
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>

          <div className="kura-preview-wrapper">
            <div className="kura-preview-label">プレビュー</div>
            <div className="kura-preview" ref={invoiceRef}>
              <Document data={currentDoc} />
            </div>
          </div>
        </main>
      )}

      <footer className="kura-footer">
        <p>&copy; KuraCloud, Inc. — This is a demo replica for reference only.</p>
      </footer>
    </div>
  )
}
