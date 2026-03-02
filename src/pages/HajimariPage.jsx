import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import Document from '../components/Document'
import { downloads, invoiceDoc, reportData, expenseData } from '../data/hajimari'
import './HajimariPage.css'

function formatNumber(num) {
  return num.toLocaleString('ja-JP')
}

function WorkReport({ data }) {
  const totalHours = data.entries.reduce((sum, e) => sum + e.hours, 0)
  return (
    <div className="hj-doc">
      <h1 className="hj-doc-title">{data.title}</h1>
      <div className="hj-doc-meta">
        <p>報告書番号: {data.docNumber}</p>
        <p>発行日: {data.issueDate}</p>
      </div>
      <div className="hj-doc-info-grid">
        <div className="hj-doc-info-row"><span>対象期間</span><span>{data.period}</span></div>
        <div className="hj-doc-info-row"><span>プロジェクト</span><span>{data.project}</span></div>
        <div className="hj-doc-info-row"><span>担当者</span><span>{data.worker}</span></div>
        <div className="hj-doc-info-row"><span>クライアント</span><span>{data.client}</span></div>
      </div>
      <table className="hj-doc-table">
        <thead>
          <tr><th>日付</th><th>作業内容</th><th className="text-right">時間</th></tr>
        </thead>
        <tbody>
          {data.entries.map((e, i) => (
            <tr key={i}><td>{e.date}</td><td>{e.description}</td><td className="text-right">{e.hours}h</td></tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="hj-doc-total-row"><td colSpan={2}>合計作業時間</td><td className="text-right">{totalHours}h</td></tr>
        </tfoot>
      </table>
      <div className="hj-doc-sender">
        <p>{data.sender.name}</p>
        <p>{data.sender.address} {data.sender.building}</p>
      </div>
    </div>
  )
}

function ExpenseReport({ data }) {
  const total = data.entries.reduce((sum, e) => sum + e.amount, 0)
  return (
    <div className="hj-doc">
      <h1 className="hj-doc-title">{data.title}</h1>
      <div className="hj-doc-meta">
        <p>精算番号: {data.docNumber}</p>
        <p>発行日: {data.issueDate}</p>
      </div>
      <div className="hj-doc-info-grid">
        <div className="hj-doc-info-row"><span>対象期間</span><span>{data.period}</span></div>
        <div className="hj-doc-info-row"><span>担当者</span><span>{data.worker}</span></div>
        <div className="hj-doc-info-row"><span>クライアント</span><span>{data.client}</span></div>
      </div>
      <table className="hj-doc-table">
        <thead>
          <tr><th>日付</th><th>内容</th><th>区分</th><th className="text-right">金額</th></tr>
        </thead>
        <tbody>
          {data.entries.map((e, i) => (
            <tr key={i}><td>{e.date}</td><td>{e.description}</td><td>{e.category}</td><td className="text-right">¥{formatNumber(e.amount)}</td></tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="hj-doc-total-row"><td colSpan={3}>合計金額</td><td className="text-right">¥{formatNumber(total)}</td></tr>
        </tfoot>
      </table>
      <div className="hj-doc-sender">
        <p>{data.sender.name}</p>
        <p>{data.sender.address} {data.sender.building}</p>
      </div>
    </div>
  )
}

export default function HajimariPage() {
  const [email, setEmail] = useState('')
  const [downloading, setDownloading] = useState(null)
  const invoiceRef = useRef(null)
  const reportRef = useRef(null)
  const expenseRef = useRef(null)

  const refMap = {
    invoice: invoiceRef,
    report: reportRef,
    expense: expenseRef,
  }

  const filenameMap = {
    invoice: invoiceDoc.docNumber,
    report: reportData.docNumber,
    expense: expenseData.docNumber,
  }

  const handleDownload = async (item) => {
    if (!email) return
    const ref = refMap[item.key]
    if (!ref?.current) return

    setDownloading(item.key)
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF('p', 'mm', 'a4')
      if (imgHeight > 297) {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
      }
      pdf.save(`${filenameMap[item.key]}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="hj-page">
      {/* ===== Sidebar ===== */}
      <aside className="hj-sidebar">
        <div className="hj-sidebar-icons">
          <button className="hj-sidebar-icon" title="設定">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button className="hj-sidebar-icon" title="書類">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </button>
          <button className="hj-sidebar-icon" title="履歴">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>
          <button className="hj-sidebar-icon" title="お気に入り">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
        </div>
      </aside>

      {/* ===== Main Area ===== */}
      <div className="hj-main-area">
        {/* Logo */}
        <header className="hj-header">
          <Link to="/" className="hj-logo">
            <span className="hj-logo-text">Hajimari</span>
            <span className="hj-logo-badge">WORKS</span>
          </Link>
        </header>

        {/* Page Title */}
        <h1 className="hj-title">請求書・作業報告書・経費ダウンロード</h1>

        {/* Download Card */}
        <div className="hj-card">
          {/* Email Input */}
          <div className="hj-email-section">
            <p className="hj-email-label">ダウンロードリンクを受け取ったメールアドレスを入力してください</p>
            <input
              type="email"
              className="hj-email-input"
              placeholder="あなたのメールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Download Table */}
          <div className="hj-table-wrapper">
            <table className="hj-table">
              <thead>
                <tr>
                  <th>請求年月</th>
                  <th>支払期限日</th>
                  <th>件名</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((group) =>
                  group.items.map((item, i) => (
                    <tr key={`${group.billingPeriod}-${item.key}`}>
                      {i === 0 && (
                        <>
                          <td rowSpan={group.items.length} className="hj-cell-period">
                            {group.billingPeriod}
                          </td>
                          <td rowSpan={group.items.length} className="hj-cell-due">
                            {group.dueDate}
                          </td>
                        </>
                      )}
                      <td className="hj-cell-name">{item.label}</td>
                      <td className="hj-cell-action">
                        <button
                          className="hj-download-btn"
                          disabled={!email || downloading === item.key}
                          onClick={() => handleDownload(item)}
                        >
                          {downloading === item.key ? 'ダウンロード中...' : 'ダウンロード'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Hidden render area for PDF generation ===== */}
      <div className="hj-offscreen">
        <div ref={invoiceRef} className="hj-pdf-page">
          <Document data={invoiceDoc} />
        </div>
        <div ref={reportRef} className="hj-pdf-page">
          <WorkReport data={reportData} />
        </div>
        <div ref={expenseRef} className="hj-pdf-page">
          <ExpenseReport data={expenseData} />
        </div>
      </div>
    </div>
  )
}
