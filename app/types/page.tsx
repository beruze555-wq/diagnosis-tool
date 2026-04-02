'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PERSONALITY_TYPES, TAG_LABELS } from '@/lib/scoring'

const TYPE_KEYS = [
  'HHHH', 'HHHL', 'HHLH', 'HHLL',
  'HLHH', 'HLHL', 'HLLH', 'HLLL',
  'LHHH', 'LHHL', 'LHLH', 'LHLL',
  'LLHH', 'LLHL', 'LLLH', 'LLLL',
]

function axisCodeFromKey(key: string): string {
  return `OS-${key[0]} / A-${key[1]} / B-${key[2]} / C-${key[3]}`
}

const ZONE_CATEGORIES = [
  {
    color: 'green',
    label: 'Green ゾーン',
    bgClass: 'bg-green-500/10 border-green-700/30',
    badgeClass: 'bg-green-500 text-white',
    items: [
      { id: 'G1', name: '全面突破型', desc: '全軸バランス型。どんな環境でも安定したパフォーマンス。' },
      { id: 'G2', name: '楽観突出型', desc: '帰属スタイルが突出して高い。挑戦的環境での立て直しが早い。' },
      { id: 'G3', name: '高達成動機型', desc: '達成意欲が極めて高い。挑戦的課題で最高の力を発揮。' },
      { id: 'G4', name: '高安定・高持続型', desc: '粘り強さまたは情緒安定性が突出。チームのアンカー的存在。' },
    ],
  },
  {
    color: 'yellow',
    label: 'Yellow ゾーン',
    bgClass: 'bg-yellow-500/10 border-yellow-700/30',
    badgeClass: 'bg-yellow-500 text-black',
    items: [
      { id: 'Y1', name: '帰属揺らぎ型', desc: '帰属スタイルが境界域。環境と介入で楽観方向に伸びしろ大。' },
      { id: 'Y2', name: '持続力伸びしろ型', desc: '意欲・安定は十分だが長期持続力に課題。メンタリング有効。' },
      { id: 'Y3', name: '感情波型', desc: '粘り・意欲は高いが情緒の揺れがある。感情制御スキルで改善。' },
      { id: 'Y4', name: '挑戦意欲伸びしろ型', desc: '粘り・安定は十分だが挑戦意欲が控えめ。段階的目標設定が有効。' },
      { id: 'Y5', name: '境界域複合型', desc: '複数の軸が境界域。全体的な底上げが可能な状態。' },
    ],
  },
  {
    color: 'red',
    label: 'Red ゾーン',
    bgClass: 'bg-red-500/10 border-red-700/30',
    badgeClass: 'bg-red-500 text-white',
    items: [
      { id: 'R1', name: '帰属課題型', desc: '帰属スタイルが悲観側。思考習慣の変容で改善可能。' },
      { id: 'R2', name: '持続・安定課題型', desc: '粘り・情緒の両方に課題。心理的安全性の確保が最優先。' },
      { id: 'R3', name: '二軸課題型', desc: '2軸に伸びしろ。段階的負荷設計と伴走者の存在が鍵。' },
      { id: 'R4', name: '複合課題型', desc: '3軸すべてに伸びしろ。適切な環境で大きく変化する可能性。' },
    ],
  },
]

export default function TypesPage() {
  const router = useRouter()
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur px-4 py-3 border-b border-gray-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 tracking-wide">MIRROR</p>
            <h1 className="text-lg font-bold text-white">16のメンタルタイプ</h1>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600"
          >
            ← 戻る
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-8">

        {/* Type grid */}
        <div>
          <p className="text-xs text-gray-500 mb-4">
            OS（帰属スタイル）×A（粘り強さ）×B（情緒安定性）×C（達成動機）の4軸 各H/Lで16タイプ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TYPE_KEYS.map((key) => {
              const type = PERSONALITY_TYPES[key]
              if (!type) return null
              const isExpanded = expandedKey === key
              return (
                <div
                  key={key}
                  className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden cursor-pointer hover:border-gray-600/70 transition-colors"
                  onClick={() => setExpandedKey(isExpanded ? null : key)}
                >
                  <div className={`h-1 bg-gradient-to-r ${type.themeFrom} ${type.themeTo}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{type.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{axisCodeFromKey(key)}</p>
                        </div>
                      </div>
                      <span className="text-gray-600 text-xs mt-1 shrink-0">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-2">
                        {type.paragraphs.map((p, i) => (
                          <p key={i} className="text-xs text-gray-300 leading-relaxed">{p}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tag labels section */}
        <div>
          <h2 className="text-base font-bold text-white mb-2">行動傾向タグ</h2>
          <p className="text-xs text-gray-500 mb-4">
            SJT（状況判断テスト）のシナリオ回答から算出される8つの行動傾向タグです。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'proactive', label: '主体的行動', desc: '自ら率先して動き、指示を待たずに行動を起こす傾向。問題を見つけたら自分から解決に動き出します。リーダーシップの土台となる行動特性です。' },
              { key: 'feedback-seeking', label: 'フィードバック志向', desc: '周囲からの意見や評価を積極的に求め、自分の改善に活かす傾向。成長スピードが速く、環境変化への適応力が高いです。' },
              { key: 'team-oriented', label: 'チーム志向', desc: '個人の成果よりもチーム全体の成功を重視する傾向。協力関係の構築が得意で、メンバー間の橋渡し役になりやすいです。' },
              { key: 'analytical', label: '分析的思考', desc: '感情や直感より、データや論理に基づいて判断する傾向。複雑な問題を構造的に整理し、合理的な解決策を導き出します。' },
              { key: 'emotion-regulation', label: '感情制御', desc: 'ストレスやプレッシャーの中でも冷静さを保てる傾向。感情に振り回されず、安定したパフォーマンスを維持できます。' },
              { key: 'help-seeking', label: '援助要請', desc: '困ったときに一人で抱え込まず、適切に助けを求められる傾向。これは弱さではなく、問題解決の効率を高める合理的な行動です。' },
              { key: 'avoidant', label: '慎重判断', desc: '行動する前にリスクや状況をしっかり見極める傾向。拙速な判断を避け、確実性を重視します。丁寧で堅実なアプローチが持ち味です。' },
              { key: 'rigid', label: '一貫追求', desc: '一度決めた方針を粘り強く貫く傾向。周囲の意見に流されず、自分の判断軸を持っています。信念の強さが行動の安定性につながります。' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <p className="text-lg font-semibold text-white">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{key}</p>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zone categories section */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">ゾーン判定カテゴリ</h2>
          <p className="text-xs text-gray-500">
            OS・A・B・Cのスコアパターンから13のゾーンに分類されます。
          </p>
          {ZONE_CATEGORIES.map((cat) => (
            <div key={cat.color} className={`rounded-2xl p-5 border ${cat.bgClass}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.badgeClass}`}>
                  {cat.label}
                </span>
              </div>
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <span className="text-xs font-mono text-gray-400 w-8 shrink-0 mt-0.5">[{item.id}]</span>
                    <div>
                      <span className="text-sm font-medium text-white">{item.name}</span>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back to result */}
        <button
          onClick={() => router.back()}
          className="w-full py-3 rounded-xl border border-gray-600 text-gray-400 hover:bg-gray-800 transition-colors text-sm"
        >
          診断結果に戻る
        </button>
      </div>
    </div>
  )
}
