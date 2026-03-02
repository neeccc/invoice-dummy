const sender = {
  name: '株式会社Hajimari',
  zipCode: '〒150-0043',
  address: '東京都渋谷区道玄坂1-16-6',
  building: '二葉ビル 5F',
  tel: '03-5784-6380',
  fax: '03-5784-6381',
  registrationNumber: 'T9011001130641',
  sealText: 'Hajimari',
}

const recipient = {
  name: '株式会社サンプル商事',
  department: '情報システム部',
  address: '〒100-0001',
  addressLine1: '東京都千代田区千代田1-1-1',
  addressLine2: 'サンプルビル 5F',
}

const items = [
  { name: 'ITプロパートナーズ 業務委託費（1月分）', quantity: 1, unit: '式', unitPrice: 600000, taxRate: 10 },
  { name: 'プロジェクトマネジメント支援', quantity: 20, unit: '時間', unitPrice: 8000, taxRate: 10 },
  { name: 'システム設計・レビュー', quantity: 15, unit: '時間', unitPrice: 7500, taxRate: 10 },
]

export const invoiceDoc = {
  type: 'invoice',
  title: '請求書',
  docNumber: 'HJ-INV-2026-0101',
  issueDate: '2026年1月31日',
  dueDate: '2026年2月28日',
  totalLabel: 'ご請求金額',
  dateLabels: { issue: '発行日', due: 'お支払期限' },
  subject: '2026年1月分 業務委託費用',
  recipient,
  sender,
  items,
  bankInfo: {
    bankName: '三菱UFJ銀行',
    branchName: '渋谷支店',
    accountType: '普通',
    accountNumber: '7654321',
    accountHolder: 'カ）ハジマリ',
  },
  notes: 'お振込手数料はお客様のご負担でお願いいたします。\nお支払期日までにお振込をお願いいたします。',
  showBank: true,
  showTaxBreakdown: true,
}

export const reportData = {
  title: '作業報告書',
  docNumber: 'HJ-RPT-2026-0101',
  period: '2026年1月1日 〜 2026年1月31日',
  issueDate: '2026年1月31日',
  worker: '山田 太郎',
  project: 'Webシステムリニューアルプロジェクト',
  client: recipient.name,
  sender,
  entries: [
    { date: '1/6', description: '要件ヒアリング・議事録作成', hours: 8 },
    { date: '1/7', description: 'システム設計書作成', hours: 8 },
    { date: '1/8', description: 'API設計・レビュー', hours: 7.5 },
    { date: '1/9', description: 'フロントエンド実装（認証画面）', hours: 8 },
    { date: '1/10', description: 'フロントエンド実装（ダッシュボード）', hours: 8 },
    { date: '1/14', description: 'バックエンドAPI実装', hours: 8 },
    { date: '1/15', description: 'バックエンドAPI実装・テスト', hours: 8 },
    { date: '1/16', description: 'コードレビュー・修正対応', hours: 7 },
    { date: '1/17', description: 'インフラ構築・デプロイ設定', hours: 8 },
    { date: '1/20', description: '結合テスト・バグ修正', hours: 8 },
    { date: '1/21', description: 'パフォーマンス改善', hours: 6 },
    { date: '1/22', description: 'ドキュメント整備', hours: 5 },
    { date: '1/23', description: '進捗報告・MTG', hours: 4 },
    { date: '1/24', description: 'リリース準備・最終確認', hours: 8 },
  ],
}

export const expenseData = {
  title: '経費精算書',
  docNumber: 'HJ-EXP-2026-0101',
  period: '2026年1月',
  issueDate: '2026年1月31日',
  worker: '山田 太郎',
  client: recipient.name,
  sender,
  entries: [
    { date: '1/6', description: '交通費（渋谷〜大手町 往復）', category: '交通費', amount: 480 },
    { date: '1/9', description: '交通費（渋谷〜品川 往復）', category: '交通費', amount: 380 },
    { date: '1/14', description: 'クライアントMTG 昼食代', category: '会議費', amount: 1500 },
    { date: '1/17', description: '交通費（渋谷〜新宿 往復）', category: '交通費', amount: 340 },
    { date: '1/20', description: 'クラウドサービス利用料', category: '通信費', amount: 3200 },
    { date: '1/23', description: '交通費（渋谷〜大手町 往復）', category: '交通費', amount: 480 },
  ],
}

export const downloads = [
  {
    billingPeriod: '2026年01月',
    dueDate: '2026/02/28',
    items: [
      { key: 'invoice', label: '請求書' },
      { key: 'report', label: '作業報告書 / 添付ファイル' },
      { key: 'expense', label: '経費' },
    ],
  },
]
