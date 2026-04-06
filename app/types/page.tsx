'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PERSONALITY_TYPES, getEnvironmentFit, getPersonalityTypeKey, calculateScores } from '@/lib/scoring'
import type { ScenarioAnswer } from '@/types'
import TypeScatterMap from '@/components/TypeScatterMap'

function axisCodeFromKey(key: string): string {
  return `SE:${key[0]} / PE:${key[1]} / OS:${key[2]} / ES:${key[3]}`
}

// Quadrant is determined by PE (key[1]) and ES (key[3])
// Display order: ビジネス適性順 (Barrick & Mount 1991)
const QUADRANTS = [
  {
    id: 'executor',
    label: '実行者ゾーン',
    subLabel: '持続 × 安定 — 多くの環境で力を発揮',
    position: 'PE-H / ES-H',
    bgClass: 'bg-blue-950/40 border-blue-700/50',
    headerColor: 'text-blue-400',
    dotColor: 'bg-blue-500',
    cardBorder: 'border-blue-700/40',
    chipBg: 'bg-blue-900/50 text-blue-300',
    keys: ['HHHH', 'HHLH', 'LHHH', 'LHLH'],
  },
  {
    id: 'challenger',
    label: '挑戦者ゾーン',
    subLabel: '感情の波を力に変え、困難に立ち向かう',
    position: 'PE-H / ES-L',
    bgClass: 'bg-amber-950/40 border-amber-700/50',
    headerColor: 'text-amber-400',
    dotColor: 'bg-amber-500',
    cardBorder: 'border-amber-700/40',
    chipBg: 'bg-amber-900/50 text-amber-300',
    keys: ['HHHL', 'HHLL', 'LHHL', 'LHLL'],
  },
  {
    id: 'stable',
    label: '安定者ゾーン',
    subLabel: '心の安定を活かし、自分に合う場所で輝く',
    position: 'PE-L / ES-H',
    bgClass: 'bg-emerald-950/40 border-emerald-700/50',
    headerColor: 'text-emerald-400',
    dotColor: 'bg-emerald-500',
    cardBorder: 'border-emerald-700/40',
    chipBg: 'bg-emerald-900/50 text-emerald-300',
    keys: ['HLHH', 'HLLH', 'LLHH', 'LLLH'],
  },
  {
    id: 'explorer',
    label: '模索者ゾーン',
    subLabel: '試行錯誤の中で、自分だけの道を見つける',
    position: 'PE-L / ES-L',
    bgClass: 'bg-rose-950/40 border-rose-700/50',
    headerColor: 'text-rose-400',
    dotColor: 'bg-rose-500',
    cardBorder: 'border-rose-700/40',
    chipBg: 'bg-rose-900/50 text-rose-300',
    keys: ['HLHL', 'HLLL', 'LLHL', 'LLLL'],
  },
]

// Map grid order: [top-left, top-right, bottom-left, bottom-right]
const MAP_GRID = [
  QUADRANTS.find(q => q.id === 'challenger')!,  // top-left  (PE-H/ES-L)
  QUADRANTS.find(q => q.id === 'executor')!,    // top-right (PE-H/ES-H)
  QUADRANTS.find(q => q.id === 'explorer')!,    // bottom-left (PE-L/ES-L)
  QUADRANTS.find(q => q.id === 'stable')!,      // bottom-right (PE-L/ES-H)
]

export default function TypesPage() {
  const router = useRouter()
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [userTypeKey, setUserTypeKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    try {
      const scenarioRaw = sessionStorage.getItem('scenarioAnswers')
      const layer2Raw = sessionStorage.getItem('layer2Answers')
      if (!scenarioRaw || !layer2Raw) return
      const scenarioAnswers: ScenarioAnswer[] = JSON.parse(scenarioRaw)
      const parsedL2 = JSON.parse(layer2Raw)
      if (!Array.isArray(parsedL2) || typeof parsedL2[0] !== 'number') return
      const scores = calculateScores(scenarioAnswers, parsedL2)
      setUserTypeKey(getPersonalityTypeKey(scores.SE, scores.PE, scores.OS, scores.ES))
    } catch {
      // sessionStorage unavailable or parse error — no highlight
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 pb-20">

      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur px-4 py-3 border-b border-gray-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 tracking-wide">MIRROR</p>
            <h1 className="text-lg font-bold text-white">16タイプ マップ</h1>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600"
          >
            ← 戻る
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-10">

        {/* Page title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white">MIRROR 16タイプ マップ</h2>
          <p className="text-sm text-gray-400">メンタル構造の4象限と16の個性</p>
        </div>

        {/* PC: Scatter plot map */}
        <div className="hidden md:block">
          <TypeScatterMap userTypeKey={userTypeKey} />
        </div>

        {/* Mobile: 4-quadrant card list */}
        <div className="md:hidden">
          <div className="flex justify-between text-xs text-gray-500 mb-1 px-1">
            <span>← ES LOW（感情の波）</span>
            <span>ES HIGH（情緒安定）→</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MAP_GRID.map((q) => (
              <div key={q.id} className={`rounded-xl p-3 border ${q.bgClass}`}>
                <p className={`text-xs font-bold leading-tight mb-2 ${q.headerColor}`}>{q.label}</p>
                <div className="grid grid-cols-2 gap-1">
                  {q.keys.map((key) => {
                    const type = PERSONALITY_TYPES[key]
                    if (!type) return null
                    const isUser = key === userTypeKey
                    return (
                      <a
                        key={key}
                        href="#personality-types"
                        onClick={() => setExpandedKey(key)}
                        className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] leading-tight ${q.chipBg} ${isUser ? 'ring-1 ring-white' : ''}`}
                      >
                        <span className="font-medium truncate">{type.name}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-1 px-1">
            ↑ 上段：PE HIGH（持続的努力高）　下段：PE LOW（低持久）↓
          </p>
        </div>

        {/* マップの読み方 */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 max-w-3xl mx-auto mt-8">
          <h3 className="text-lg font-bold text-white mb-5">マップの読み方</h3>

          <div className="space-y-4 mb-6">
            <div>
              <span className="text-blue-400 font-semibold">縦軸 ↑ 持続的努力（PE）</span>
              <p className="text-gray-400 text-sm mt-1">
                上にいくほど長期的にコミットし続ける力が強く、下にいくほど柔軟に方向転換しやすい傾向があります。
              </p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">横軸 → 情緒安定性（ES）</span>
              <p className="text-gray-400 text-sm mt-1">
                右にいくほどストレス下でも冷静な判断を維持しやすく、左にいくほど感情の波が大きく、それを力に変える傾向があります。
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700/50 my-5"></div>

          <p className="text-gray-300 text-sm font-semibold mb-3">ノードの見方</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">丸 = OS HIGH（楽観的）</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">角丸 = OS LOW（悲観的）</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">大きい = SE HIGH（自信あり）</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">小さい = SE LOW（自信低め）</span>
            </div>
          </div>

          <p className="text-gray-500 text-xs italic">
            Barrick &amp; Mount (1991) のメタ分析で職務遂行との相関が高い因子を主軸としています。
          </p>
        </div>

        {/* 16 type cards grouped by quadrant */}
        <div className="space-y-8" id="personality-types">
          <h2 className="text-base font-bold text-white">16タイプ 詳細</h2>

          {QUADRANTS.map((q) => (
            <div key={q.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${q.dotColor}`} />
                <h3 className={`text-sm font-bold ${q.headerColor}`}>{q.label}</h3>
                <span className="text-xs text-gray-600">{q.position}</span>
              </div>

              {q.keys.map((key) => {
                const type = PERSONALITY_TYPES[key]
                const fit = getEnvironmentFit(key)
                if (!type) return null
                const isExpanded = expandedKey === key
                const isUser = key === userTypeKey
                return (
                  <div
                    key={key}
                    className={`bg-gray-800/50 rounded-xl border ${q.cardBorder} overflow-hidden ${isUser ? 'ring-1 ring-white' : ''}`}
                  >
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedKey(isExpanded ? null : key)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">{type.name}</p>
                            {isUser && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">あなた</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{type.subtitle}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{axisCodeFromKey(key)}</p>
                        </div>
                        <span className="text-gray-600 text-xs mt-1 shrink-0">{isExpanded ? '▲' : '▼'}</span>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-3">
                          <p className="text-xs text-gray-300 leading-relaxed">{type.description}</p>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-emerald-400 mb-1">✦ 強み</p>
                              <ul className="space-y-0.5">
                                {type.strengths.map((s, si) => (
                                  <li key={si} className="text-xs text-gray-300 flex gap-1.5">
                                    <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-orange-400 mb-1">⚠ 盲点</p>
                              <ul className="space-y-0.5">
                                {type.blindSpots.map((b, bi) => (
                                  <li key={bi} className="text-xs text-gray-300 flex gap-1.5">
                                    <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-red-400 mb-1">逆境時の行動パターン</p>
                              <p className="text-xs text-gray-300 leading-relaxed">{type.underPressure}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-400 mb-1">成長のヒント</p>
                              <p className="text-xs text-gray-300 leading-relaxed">{type.growthTip}</p>
                            </div>
                          </div>

                          <div className="border-t border-gray-700/30 pt-3 space-y-2.5">
                            <div>
                              <p className="text-xs font-semibold text-emerald-400 mb-1">✨ 力を発揮できる環境</p>
                              <ul className="space-y-0.5">
                                {fit.idealEnvironment.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                                    <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-orange-400 mb-1">⚡ 消耗しやすい環境</p>
                              <ul className="space-y-0.5">
                                {fit.stressors.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                                    <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-400 mb-1">🌱 成長アクション</p>
                              <ul className="space-y-0.5">
                                {fit.copingStrategies.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                                    <span className="text-blue-500 shrink-0 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div>
          <a
            href="/"
            className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-semibold text-sm text-center"
          >
            自分のタイプを診断する →
          </a>
        </div>

        <div className="text-center space-y-3 pb-4">
          <a href="/about" className="text-xs text-gray-500 hover:text-gray-400 transition-colors block">
            この診断の学術的背景について
          </a>
          <button
            onClick={() => router.back()}
            className="text-xs text-gray-600 hover:text-gray-500 transition-colors"
          >
            ← 戻る
          </button>
        </div>

      </div>
    </div>
  )
}
