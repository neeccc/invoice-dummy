const sender = {
  name: '株式会社クラクラウド',
  zipCode: '〒150-0002',
  address: '東京都渋谷区渋谷2-15-1',
  building: '渋谷クロスタワー 18F',
  tel: '03-5468-7890',
  fax: '03-5468-7891',
  registrationNumber: 'T1234509876543',
  sealText: 'クラ\nクラウド',
}

const recipient = {
  name: '株式会社グリーンテック',
  department: '経理部',
  address: '〒460-0008',
  addressLine1: '愛知県名古屋市中区栄3-5-12',
  addressLine2: 'サカエタワー 10F',
}

const bankInfo = {
  bankName: 'みずほ銀行',
  branchName: '渋谷支店',
  accountType: '普通',
  accountNumber: '3456789',
  accountHolder: 'カ）クラクラウド',
}

const items = [
  { name: 'クラウドERPライセンス（月額）', quantity: 1, unit: '式', unitPrice: 350000, taxRate: 10 },
  { name: 'データ移行サポート', quantity: 1, unit: '式', unitPrice: 180000, taxRate: 10 },
  { name: 'API連携カスタマイズ', quantity: 2, unit: '件', unitPrice: 95000, taxRate: 10 },
  { name: 'オンライン研修（チーム向け）', quantity: 3, unit: '回', unitPrice: 45000, taxRate: 10 },
  { name: 'テクニカルサポート（月額）', quantity: 1, unit: 'ヶ月', unitPrice: 25000, taxRate: 10 },
]

export const documents = {
  invoice: {
    type: 'invoice',
    title: '請求書',
    docNumber: 'KRC-2026-0134',
    issueDate: '2026年3月15日',
    dueDate: '2026年4月15日',
    totalLabel: 'ご請求金額',
    dateLabels: { issue: '発行日', due: 'お支払期限' },
    subject: '2026年3月分 クラウドサービス利用料',
    recipient,
    sender,
    items,
    bankInfo,
    notes: 'お振込手数料はお客様のご負担でお願いいたします。\nご不明な点がございましたら、担当者までお問い合わせください。',
    showBank: true,
    showTaxBreakdown: true,
  },
}

export const credentials = {
  email: 'tanaka@greentech.co.jp',
  password: 'Krc2026#inv',
}
