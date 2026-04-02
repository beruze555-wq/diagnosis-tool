@AGENTS.md

# diagnosis-tool

## プロジェクト名
メンタル診断ツール（仮称）

## 一言説明
SJT（状況判断テスト）と帰属スタイル診断を組み合わせたメンタルヘルス診断Webアプリ。

## 技術スタック
- Next.js 16.2.1（App Router）
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase（結果保存）
- Recharts（スコア可視化）

## ディレクトリ構成
```
diagnosis-tool/
├── app/
│   ├── page.tsx          # スタート画面（年齢・所属入力）
│   ├── diagnosis/page.tsx # シナリオ診断画面
│   └── result/page.tsx   # 結果表示画面
├── lib/
│   ├── scenarios.ts      # シナリオデータ定義
│   ├── layer2Questions.ts # 第2層質問
│   ├── scoring.ts        # スコア計算ロジック
│   └── supabase.ts       # Supabase クライアント
└── public/
```

## 現在の状態
- 動いている: 診断フロー（スタート→診断→結果）、スコア計算、Supabase保存
- まだ: 本番デプロイ未確認、認証なし、管理画面なし
