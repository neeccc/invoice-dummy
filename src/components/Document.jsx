function formatNumber(num) {
  return num.toLocaleString('ja-JP')
}

function formatCurrency(num) {
  return '¥' + formatNumber(num)
}

function calcTotals(rawItems) {
  const items = rawItems.map((item) => ({
    ...item,
    amount: item.quantity * item.unitPrice,
  }))
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxGroups = items.reduce((groups, item) => {
    const rate = item.taxRate
    if (!groups[rate]) groups[rate] = { subtotal: 0, tax: 0 }
    groups[rate].subtotal += item.amount
    groups[rate].tax += Math.floor(item.amount * (rate / 100))
    return groups
  }, {})
  const totalTax = Object.values(taxGroups).reduce((sum, g) => sum + g.tax, 0)
  return { items, subtotal, taxGroups, totalTax, total: subtotal + totalTax }
}

export default function Document({ data }) {
  const { items, subtotal, taxGroups, total } = calcTotals(data.items)
  const dueDate = data.dueDate || data.validUntil || data.deliveryDate

  return (
    <div className="invoice">
      <h1 className="invoice-title">{data.title}</h1>

      <div className="invoice-top">
        <div className="invoice-recipient">
          <div className="recipient-name">
            {data.recipient.name}
            <span className="honorific">御中</span>
          </div>
          <div className="recipient-address">
            {data.recipient.department && (
              <>{data.recipient.department}<br /></>
            )}
            {data.recipient.address}<br />
            {data.recipient.addressLine1}<br />
            {data.recipient.addressLine2}
          </div>
        </div>
        <div className="invoice-meta">
          <p className="invoice-number">No. {data.docNumber}</p>
          <p className="invoice-date">{data.dateLabels.issue}: {data.issueDate}</p>
          {dueDate && data.dateLabels.due && (
            <p className="invoice-date">{data.dateLabels.due}: {dueDate}</p>
          )}
        </div>
      </div>

      <div className="invoice-sender-block">
        <div className="invoice-sender">
          <div className="sender-name">{data.sender.name}</div>
          <div>
            {data.sender.zipCode}<br />
            {data.sender.address}<br />
            {data.sender.building}
          </div>
          <div>TEL: {data.sender.tel} / FAX: {data.sender.fax}</div>
          <div className="sender-registration">
            登録番号: {data.sender.registrationNumber}
          </div>
          <div className="invoice-seal">
            {data.sender.sealText.split('\n').map((line, i) => (
              <span className="seal-line" key={i}>{line}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="invoice-subject">件名: {data.subject}</p>
      <div className="invoice-total-box">
        <span className="total-label">{data.totalLabel}</span>
        <span className="total-amount">
          <span className="total-currency">¥</span>
          {formatNumber(total)}
        </span>
      </div>

      {data.showPaymentMethod && (
        <p className="invoice-payment-method">
          お支払方法: {data.paymentMethod}
        </p>
      )}

      <table className="invoice-table">
        <thead>
          <tr>
            <th>品名</th>
            <th className="text-center">数量</th>
            <th className="text-center">単位</th>
            <th className="text-right">単価</th>
            <th className="text-right">金額</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>
                {item.name}
                <span className="tax-mark">※</span>
              </td>
              <td className="text-center">{formatNumber(item.quantity)}</td>
              <td className="text-center">{item.unit}</td>
              <td className="text-right">{formatNumber(item.unitPrice)}</td>
              <td className="text-right">{formatNumber(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-summary">
        <table className="invoice-summary-table">
          <tbody>
            <tr>
              <td>小計</td>
              <td>{formatCurrency(subtotal)}</td>
            </tr>
            {Object.entries(taxGroups).map(([rate, group]) => (
              <tr key={rate}>
                <td>消費税（{rate}%）</td>
                <td>{formatCurrency(group.tax)}</td>
              </tr>
            ))}
            <tr className="summary-total">
              <td>合計</td>
              <td>{formatCurrency(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {data.showTaxBreakdown && (
        <div className="invoice-tax-breakdown">
          <h4>※ 税率別内訳</h4>
          <table className="tax-breakdown-table">
            <thead>
              <tr>
                <th>税率</th>
                <th>対象額</th>
                <th>消費税額</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(taxGroups).map(([rate, group]) => (
                <tr key={rate}>
                  <td>{rate}%</td>
                  <td>{formatCurrency(group.subtotal)}</td>
                  <td>{formatCurrency(group.tax)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={`invoice-bottom ${!data.showBank ? 'single-col' : ''}`}>
        {data.showBank && data.bankInfo && (
          <div className="invoice-section">
            <h4>振込先</h4>
            <div className="bank-info">
              <span>銀行名</span>{data.bankInfo.bankName}<br />
              <span>支店名</span>{data.bankInfo.branchName}<br />
              <span>口座種別</span>{data.bankInfo.accountType}<br />
              <span>口座番号</span>{data.bankInfo.accountNumber}<br />
              <span>口座名義</span>{data.bankInfo.accountHolder}
            </div>
          </div>
        )}
        <div className="invoice-section">
          <h4>備考</h4>
          {data.notes.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
