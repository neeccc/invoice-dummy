import { useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import Document from '../components/Document'
import { documents, docTypes } from '../data/moneyforward'
import './MoneyForwardPage.css'

function formatNumber(num) {
  return num.toLocaleString('ja-JP')
}

export default function MoneyForwardPage() {
  const { docType } = useParams()
  const invoiceRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const currentDoc = documents[docType]
  if (!currentDoc) return <Navigate to="/" replace />

  const dueDate = currentDoc.dueDate || currentDoc.validUntil || currentDoc.deliveryDate
  const subtotal = currentDoc.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = currentDoc.items.reduce((sum, item) => sum + Math.floor(item.quantity * item.unitPrice * (item.taxRate / 100)), 0)
  const total = subtotal + tax

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
    <div className="mf-page">
      {/* ===== MF Header ===== */}
      <header className="mf-header">
        <div className="mf-header-inner">
          <Link to="/" className="mf-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M6 8h12v2H6zm0 3h12v2H6zm0 3h8v2H6z" fill="#3B82F6"/></svg>
            <span className="mf-logo-text">マネーフォワード クラウド請求書</span>
          </Link>
        </div>
      </header>

      {/* ===== Sub-nav: doc type tabs ===== */}
      <div className="mf-subnav">
        <div className="mf-subnav-inner">
          <Link to="/" className="mf-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.354 3.146a.5.5 0 010 .708L6.207 8l4.147 4.146a.5.5 0 01-.708.708l-4.5-4.5a.5.5 0 010-.708l4.5-4.5a.5.5 0 01.708 0z"/></svg>
            一覧に戻る
          </Link>
          <nav className="mf-doc-tabs">
            {docTypes.map((dt) => (
              <Link
                key={dt.key}
                to={`/moneyforward/${dt.key}`}
                className={`mf-doc-tab ${docType === dt.key ? 'active' : ''}`}
              >
                {dt.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <main className="mf-main">
        {/* Info + Action card */}
        <div className="mf-action-card">
          <div className="mf-action-card-body">
            {/* Left: invoice summary info */}
            <div className="mf-info-grid">
              <h2 className="mf-info-title">
                {currentDoc.title}の受領確認
              </h2>
              <div className="mf-info-rows">
                <div className="mf-info-row">
                  <span className="mf-info-label">送付元</span>
                  <span className="mf-info-value">{currentDoc.sender.name}</span>
                </div>
                <div className="mf-info-row">
                  <span className="mf-info-label">書類番号</span>
                  <span className="mf-info-value">{currentDoc.docNumber}</span>
                </div>
                <div className="mf-info-row">
                  <span className="mf-info-label">発行日</span>
                  <span className="mf-info-value">{currentDoc.issueDate}</span>
                </div>
                {dueDate && currentDoc.dateLabels.due && (
                  <div className="mf-info-row">
                    <span className="mf-info-label">{currentDoc.dateLabels.due}</span>
                    <span className="mf-info-value">{dueDate}</span>
                  </div>
                )}
                <div className="mf-info-row">
                  <span className="mf-info-label">件名</span>
                  <span className="mf-info-value">{currentDoc.subject}</span>
                </div>
                <div className="mf-info-row total">
                  <span className="mf-info-label">合計金額</span>
                  <span className="mf-info-value mf-info-amount">¥{formatNumber(total)}</span>
                </div>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="mf-action-buttons">
              {!accepted ? (
                <button
                  className="mf-btn mf-btn-accept"
                  onClick={() => setAccepted(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  受領する
                </button>
              ) : (
                <div className="mf-accepted-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  受領済み
                </div>
              )}
              <button
                className="mf-btn mf-btn-download"
                onClick={handleDownload}
                disabled={downloading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {downloading ? 'ダウンロード中...' : 'PDFダウンロード'}
              </button>
            </div>
          </div>

          {accepted && (
            <div className="mf-accepted-banner">
              この{currentDoc.title}は受領済みです。タイムスタンプが付与されました。
            </div>
          )}
        </div>

        {/* Invoice Preview */}
        <div className="mf-preview-wrapper">
          <div className="mf-preview-label">プレビュー</div>
          <div className="mf-preview" ref={invoiceRef}>
            <Document data={currentDoc} />
          </div>
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="mf-footer">
        <p>&copy; Money Forward, Inc. — This is a demo replica for reference only.</p>
      </footer>
    </div>
  )
}
