import { useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import Document from '../components/Document'
import { documents, docTypes } from '../data/moneyforward'

export default function MoneyForwardPage() {
  const { docType } = useParams()
  const invoiceRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const currentDoc = documents[docType]
  if (!currentDoc) return <Navigate to="/" replace />

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
    <div className="doc-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <span>MoneyForward</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{currentDoc.title}</span>
      </nav>

      {/* Tab Navigation */}
      <nav className="doc-tabs">
        {docTypes.map((dt) => (
          <Link
            key={dt.key}
            to={`/moneyforward/${dt.key}`}
            className={`doc-tab ${docType === dt.key ? 'active' : ''}`}
          >
            {dt.label}
          </Link>
        ))}
      </nav>

      {/* Document */}
      <div ref={invoiceRef}>
        <Document data={currentDoc} />
      </div>

      {/* Download */}
      <div className="download-section">
        <button
          className="btn-download"
          onClick={handleDownload}
          disabled={downloading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {downloading ? 'PDF生成中...' : `${currentDoc.title}PDFダウンロード`}
        </button>
      </div>
    </div>
  )
}
