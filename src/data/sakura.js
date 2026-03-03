const sender = {
  name: '株式会社サクラファイナンス',
  zipCode: '〒530-0001',
  address: '大阪府大阪市北区梅田3-3-3',
  building: 'グランフロント大阪 22F',
  tel: '06-9876-5432',
  fax: '06-9876-5433',
  registrationNumber: 'T9876543210987',
  sealText: 'サクラ\nファイナンス',
}

const recipient = {
  name: '合同会社ブルーオーシャン',
  department: '総務部',
  address: '〒812-0011',
  addressLine1: '福岡県福岡市博多区博多駅前4-4-4',
  addressLine2: 'キャナルシティ博多 8F',
}

const bankInfo = {
  bankName: '三井住友銀行',
  branchName: '梅田支店',
  accountType: '普通',
  accountNumber: '7654321',
  accountHolder: 'カ）サクラファイナンス',
}

const items = [
  { name: '経営コンサルティング（月次）', quantity: 1, unit: '式', unitPrice: 400000, taxRate: 10 },
  { name: '財務分析レポート作成', quantity: 2, unit: '件', unitPrice: 120000, taxRate: 10 },
  { name: 'クラウド会計導入支援', quantity: 1, unit: '式', unitPrice: 250000, taxRate: 10 },
  { name: '税務相談（スポット）', quantity: 3, unit: '回', unitPrice: 35000, taxRate: 10 },
  { name: '経費精算システム利用料', quantity: 1, unit: 'ヶ月', unitPrice: 15000, taxRate: 10 },
]

export const documents = {
  invoice: {
    type: 'invoice',
    title: '請求書',
    docNumber: 'SKR-2026-0087',
    issueDate: '2026年3月1日',
    dueDate: '2026年3月31日',
    totalLabel: 'ご請求金額',
    dateLabels: { issue: '発行日', due: 'お支払期限' },
    subject: '2026年2月分 コンサルティング費用',
    recipient,
    sender,
    items,
    bankInfo,
    notes: 'お振込手数料はお客様のご負担でお願いいたします。\nお支払期日までにお振込をお願いいたします。',
    showBank: true,
    showTaxBreakdown: true,
  },
}
