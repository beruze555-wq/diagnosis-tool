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
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg">
          <h2 className="text-base font-bold text-white mb-4">行動傾向タグ</h2>
          <p className="text-xs text-gray-500 mb-4">
            SJT（状況判断テスト）のシナリオ回答から算出される8つの行動傾向タグです。
          </p>
          <div className="space-y-2">
            {Object.entries(TAG_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs font-mono bg-gray-700 text-blue-300 px-2 py-1 rounded w-36 shrink-0">{key}</span>
                <span className="text-sm text-gray-300">{label}</span>
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
