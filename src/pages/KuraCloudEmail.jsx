import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { credentials } from '../data/kuracloud'
import './KuraCloudEmail.css'

export default function KuraCloudEmail() {
  const { emailType } = useParams()
  const [currentView, setCurrentView] = useState(emailType || 'invoice')

  if (emailType !== 'invoice' && emailType !== 'password') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="kura-email-page">
      <header className="kura-email-header">
        <div className="kura-email-header-inner">
          <Link to="/" className="kura-email-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.354 3.146a.5.5 0 010 .708L6.207 8l4.147 4.146a.5.5 0 01-.708.708l-4.5-4.5a.5.5 0 010-.708l4.5-4.5a.5.5 0 01.708 0z"/>
            </svg>
            一覧に戻る
          </Link>
          <div className="kura-email-tabs">
            <Link
              to="/kuracloud/email/invoice"
              className={`kura-email-tab ${emailType === 'invoice' ? 'active' : ''}`}
              onClick={() => setCurrentView('invoice')}
            >
              1通目：請求書リンク
            </Link>
            <Link
              to="/kuracloud/email/password"
              className={`kura-email-tab ${emailType === 'password' ? 'active' : ''}`}
              onClick={() => setCurrentView('password')}
            >
              2通目：パスワード通知
            </Link>
          </div>
        </div>
      </header>

      <main className="kura-email-main">
        <div className="kura-email-context">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#64748b">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 8.5a.75.75 0 01-1.5 0V7.25a.75.75 0 011.5 0V8.5zM8 4a2.25 2.25 0 00-2.25 2.25.75.75 0 001.5 0 .75.75 0 111.5 0c0 .41-.168.585-.547.883l-.14.109C7.578 7.636 7.25 8.082 7.25 9a.75.75 0 001.5 0c0-.41.168-.585.547-.883l.14-.109C9.922 7.614 10.25 7.168 10.25 6.25A2.25 2.25 0 008 4z"/>
          </svg>
          <span>
            {emailType === 'invoice'
              ? 'これは1通目のメール（請求書リンク通知）のサンプルです。受信者はこのメールのリンクから請求書ページにアクセスします。'
              : 'これは2通目のメール（パスワード通知）のサンプルです。請求書ページへのログインに必要なパスワードが記載されています。'}
          </span>
        </div>

        <div className="kura-email-envelope">
          {/* Email Header */}
          <div className="kura-email-meta">
            <div className="kura-email-meta-row">
              <span className="kura-email-meta-label">From:</span>
              <span className="kura-email-meta-value">KuraCloud &lt;noreply@kuracloud.jp&gt;</span>
            </div>
            <div className="kura-email-meta-row">
              <span className="kura-email-meta-label">To:</span>
              <span className="kura-email-meta-value">田中 太郎 &lt;{credentials.email}&gt;</span>
            </div>
            <div className="kura-email-meta-row">
              <span className="kura-email-meta-label">Date:</span>
              <span className="kura-email-meta-value">2026年3月15日 10:{emailType === 'invoice' ? '00' : '01'}</span>
            </div>
            <div className="kura-email-meta-row">
              <span className="kura-email-meta-label">Subject:</span>
              <span className="kura-email-meta-value kura-email-subject">
                {emailType === 'invoice'
                  ? '【KuraCloud】株式会社クラクラウドより請求書が届いています'
                  : '【KuraCloud】請求書閲覧用パスワードのお知らせ'}
              </span>
            </div>
          </div>

          {/* Email Body */}
          <div className="kura-email-body">
            {emailType === 'invoice' ? (
              <>
                <p className="kura-email-greeting">株式会社グリーンテック<br/>田中 太郎 様</p>
                <p>いつもお世話になっております。</p>
                <p>
                  株式会社クラクラウドより請求書が届いております。<br/>
                  下記のリンクより請求書をご確認ください。
                </p>

                <div className="kura-email-doc-card">
                  <div className="kura-email-doc-row">
                    <span className="kura-email-doc-label">書類</span>
                    <span>請求書</span>
                  </div>
                  <div className="kura-email-doc-row">
                    <span className="kura-email-doc-label">書類番号</span>
                    <span>KRC-2026-0134</span>
                  </div>
                  <div className="kura-email-doc-row">
                    <span className="kura-email-doc-label">送付元</span>
                    <span>株式会社クラクラウド</span>
                  </div>
                  <div className="kura-email-doc-row">
                    <span className="kura-email-doc-label">件名</span>
                    <span>2026年3月分 クラウドサービス利用料</span>
                  </div>
                </div>

                <div className="kura-email-cta">
                  <Link to="/kuracloud/invoice" className="kura-email-btn">
                    請求書を確認する
                  </Link>
                </div>

                <div className="kura-email-notice">
                  <strong>ご注意：</strong>請求書の閲覧にはパスワードが必要です。<br/>
                  パスワードは別途メールでお送りいたします。
                </div>

                <p className="kura-email-sign">
                  ─────────────────────<br/>
                  KuraCloud 請求書送付サービス<br/>
                  https://kuracloud.jp<br/>
                  ※ このメールはシステムより自動送信されています。
                </p>
              </>
            ) : (
              <>
                <p className="kura-email-greeting">株式会社グリーンテック<br/>田中 太郎 様</p>
                <p>
                  先ほどお送りした請求書（KRC-2026-0134）を閲覧するための<br/>
                  パスワードをお知らせいたします。
                </p>

                <div className="kura-email-password-box">
                  <div className="kura-email-password-label">ログイン情報</div>
                  <div className="kura-email-credential-row">
                    <span className="kura-email-credential-label">メールアドレス</span>
                    <span className="kura-email-credential-value">{credentials.email}</span>
                  </div>
                  <div className="kura-email-credential-row">
                    <span className="kura-email-credential-label">パスワード</span>
                    <code className="kura-email-password-code">{credentials.password}</code>
                  </div>
                </div>

                <div className="kura-email-notice">
                  <strong>セキュリティに関するお願い：</strong><br/>
                  ・パスワードは第三者に共有しないでください。<br/>
                  ・このメールは請求書の確認後、速やかに削除してください。<br/>
                  ・パスワードの有効期限はありません。
                </div>

                <div className="kura-email-cta">
                  <Link to="/kuracloud/invoice" className="kura-email-btn">
                    請求書ページを開く
                  </Link>
                </div>

                <p className="kura-email-sign">
                  ─────────────────────<br/>
                  KuraCloud 請求書送付サービス<br/>
                  https://kuracloud.jp<br/>
                  ※ このメールはシステムより自動送信されています。
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
