'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PERSONALITY_TYPES, getEnvironmentFit, calculateOS, calculateAxisA, calculateAxisB, calculateAxisC, getPersonalityTypeKey } from '@/lib/scoring'
import type { ScenarioAnswer, Layer2Answers } from '@/types'
import TypeScatterMap from '@/components/TypeScatterMap'

function axisCodeFromKey(key: string): string {
  return `OS-${key[0]} / A-${key[1]} / B-${key[2]} / C-${key[3]}`
}

// Key format: OS[0] A[1] B[2] C[3]
// Quadrant is determined by A (key[1]) and B (key[2])
const QUADRANTS = [
  {
    id: 'challenger',
    label: '挑戦者ゾーン',
    subLabel: '感情の波を力に変え、困難に立ち向かう',
    position: 'A-H / B-L',
    bgClass: 'bg-amber-950/40 border-amber-700/50',
    headerColor: 'text-amber-400',
    dotColor: 'bg-amber-500',
    cardBorder: 'border-amber-700/40',
    chipBg: 'bg-amber-900/50 text-amber-300',
    // A=H (key[1]=H), B=L (key[2]=L) → top-left in map
    keys: ['HHLH', 'HHLL', 'LHLH', 'LHLL'],
  },
  {
    id: 'executor',
    label: '実行者ゾーン',
    subLabel: '安定 × 持続 — 多くの環境で力を発揮',
    position: 'A-H / B-H',
    bgClass: 'bg-blue-950/40 border-blue-700/50',
    headerColor: 'text-blue-400',
    dotColor: 'bg-blue-500',
    cardBorder: 'border-blue-700/40',
    chipBg: 'bg-blue-900/50 text-blue-300',
    // A=H (key[1]=H), B=H (key[2]=H) → top-right in map
    keys: ['HHHH', 'HHHL', 'LHHH', 'LHHL'],
  },
  {
    id: 'explorer',
    label: '模索者ゾーン',
    subLabel: '試行錯誤の中で、自分だけの道を見つける',
    position: 'A-L / B-L',
    bgClass: 'bg-rose-950/40 border-rose-700/50',
    headerColor: 'text-rose-400',
    dotColor: 'bg-rose-500',
    cardBorder: 'border-rose-700/40',
    chipBg: 'bg-rose-900/50 text-rose-300',
    // A=L (key[1]=L), B=L (key[2]=L) → bottom-left in map
    keys: ['HLLH', 'HLLL', 'LLLH', 'LLLL'],
  },
  {
    id: 'stable',
    label: '安定者ゾーン',
    subLabel: '心の安定を活かし、自分に合う場所で輝く',
    position: 'A-L / B-H',
    bgClass: 'bg-emerald-950/40 border-emerald-700/50',
    headerColor: 'text-emerald-400',
    dotColor: 'bg-emerald-500',
    cardBorder: 'border-emerald-700/40',
    chipBg: 'bg-emerald-900/50 text-emerald-300',
    // A=L (key[1]=L), B=H (key[2]=H) → bottom-right in map
    keys: ['HLHH', 'HLHL', 'LLHH', 'LLHL'],
  },
]

// Grid order: [top-left, top-right, bottom-left, bottom-right]
const MAP_GRID = [QUADRANTS[0], QUADRANTS[1], QUADRANTS[2], QUADRANTS[3]]

function parseLayer2Answers(raw: string): Layer2Answers | undefined {
  try {
    const parsed = JSON.parse(raw)
    if (!parsed) return undefined
    if (parsed.axisA && Array.isArray(parsed.axisA)) return parsed as Layer2Answers
    // Flat array format: [{id:"A1", axis:"A", value:4}, ...]
    if (Array.isArray(parsed)) {
      const result: Layer2Answers = { axisA: [], axisB: [], axisC: [], axisD: [] }
      for (const item of parsed as { id: string; axis: string; value: number }[]) {
        if (item.axis === 'A') result.axisA.push(item.value)
        else if (item.axis === 'B') result.axisB.push(item.value)
        else if (item.axis === 'C') result.axisC.push(item.value)
        else if (item.axis === 'D') result.axisD.push(item.value)
      }
      return result
    }
    return undefined
  } catch {
    return undefined
  }
}

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
      const layer2 = parseLayer2Answers(layer2Raw)
      if (!layer2) return
      const OS = calculateOS(scenarioAnswers)
      const A = calculateAxisA(layer2.axisA)
      const B = calculateAxisB(layer2.axisB)
      const C = calculateAxisC(layer2.axisC)
      setUserTypeKey(getPersonalityTypeKey(OS, A, B, C))
    } catch {
      // sessionStorage unavailable or parse error — no highlight
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 pb-20">

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur px-4 py-3 border-b border-gray-800">
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

        {/* ── PC: Scatter plot map (md以上) ── */}
        <div className="hidden md:block">
          <TypeScatterMap userTypeKey={userTypeKey} />
        </div>

        {/* ── Mobile: 4-quadrant card list (md未満) ── */}
        <div className="md:hidden">
          {/* B-axis label */}
          <div className="flex justify-between text-xs text-gray-500 mb-1 px-1">
            <span>← B LOW（感情の波）</span>
            <span>B HIGH（情緒安定）→</span>
          </div>

          {/* 2×2 grid of quadrant cards */}
          <div className="grid grid-cols-2 gap-2">
            {MAP_GRID.map((q) => (
              <div key={q.id} className={`rounded-xl p-3 border ${q.bgClass}`}>
                <p className={`text-xs font-bold leading-tight mb-2 ${q.headerColor}`}>{q.label}</p>
                {/* 2×2 chip grid */}
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
                        <span className="text-sm shrink-0">{type.icon}</span>
                        <span className="font-medium truncate">{type.name}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* A-axis annotation */}
          <p className="text-[10px] text-gray-600 mt-1 px-1">
            ↑ 上段：A HIGH（粘り強さ高）　下段：A LOW（柔軟探索）↓
          </p>
        </div>

        {/* ── マップの読み方（凡例 + 軸説明 統合） ── */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 max-w-3xl mx-auto mt-8">
          <h3 className="text-lg font-bold text-white mb-5">
            マップの読み方
          </h3>

          {/* 軸の説明 */}
          <div className="space-y-4 mb-6">
            <div>
              <span className="text-blue-400 font-semibold">
                横軸 → 情緒安定性（B）
              </span>
              <p className="text-gray-400 text-sm mt-1">
                右にいくほどストレス下でも冷静な判断を維持しやすく、左にいくほど感情の波が大きく、それを力に変える傾向があります。
              </p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">
                縦軸 ↑ 粘り強さ（A）
              </span>
              <p className="text-gray-400 text-sm mt-1">
                上にいくほど長期的にコミットし続ける力が強く、下にいくほど柔軟に方向転換しやすい傾向があります。
              </p>
            </div>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-gray-700/50 my-5"></div>

          {/* 4つのゾーン — 横に2列 */}
          <p className="text-gray-300 text-sm font-semibold mb-3">
            4つのゾーン
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 shrink-0"></div>
              <span className="text-gray-300 text-sm">
                実行者ゾーン（右上）<br/>
                <span className="text-gray-500">安定 × 持続</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0"></div>
              <span className="text-gray-300 text-sm">
                挑戦者ゾーン（左上）<br/>
                <span className="text-gray-500">感情を力に × 持続</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0"></div>
              <span className="text-gray-300 text-sm">
                安定者ゾーン（右下）<br/>
                <span className="text-gray-500">安定 × 柔軟探索</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 mt-1 shrink-0"></div>
              <span className="text-gray-300 text-sm">
                模索者ゾーン（左下）<br/>
                <span className="text-gray-500">試行錯誤 × 柔軟探索</span>
              </span>
            </div>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-gray-700/50 my-5"></div>

          {/* ノードの見方 — 横に2列 */}
          <p className="text-gray-300 text-sm font-semibold mb-3">
            ノードの見方
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">丸 = 楽観性 HIGH</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-xl bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">角丸 = 楽観性 LOW</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">大きい = 達成動機 HIGH</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-400 shrink-0"></div>
              <span className="text-gray-400 text-sm">小さい = 達成動機 LOW</span>
            </div>
          </div>

          {/* 学術的根拠 */}
          <p className="text-gray-500 text-xs italic mt-5">
            Barrick &amp; Mount (1991) のメタ分析で職務遂行との相関が最も高い2因子をマップの主軸としています。
          </p>
        </div>

        {/* ── 16 type cards grouped by quadrant ── */}
        <div className="space-y-8" id="personality-types">
          <h2 className="text-base font-bold text-white">16タイプ 詳細</h2>

          {QUADRANTS.map((q) => (
            <div key={q.id} className="space-y-3">
              {/* Quadrant heading */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${q.dotColor}`} />
                <h3 className={`text-sm font-bold ${q.headerColor}`}>{q.label}</h3>
                <span className="text-xs text-gray-600">{q.position}</span>
              </div>

              {/* Type cards */}
              {q.keys.map((key) => {
                const type = PERSONALITY_TYPES[key]
                const fit = getEnvironmentFit(key)
                if (!type) return null
                const isExpanded = expandedKey === key
                return (
                  <div
                    key={key}
                    className={`bg-gray-800/50 rounded-xl border ${q.cardBorder} overflow-hidden`}
                  >
                    <div className={`h-1 bg-gradient-to-r ${type.themeFrom} ${type.themeTo}`} />
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedKey(isExpanded ? null : key)}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-white">{type.name}</p>
                            <p className="text-xs text-gray-500">{axisCodeFromKey(key)}</p>
                          </div>
                        </div>
                        <span className="text-gray-600 text-xs mt-1 shrink-0">{isExpanded ? '▲' : '▼'}</span>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-3">

                          {/* Personality paragraphs */}
                          <div className="space-y-1.5">
                            {type.paragraphs.map((p, i) => (
                              <p key={i} className="text-xs text-gray-300 leading-relaxed">{p}</p>
                            ))}
                          </div>

                          {/* Environment fit */}
                          <div className="border-t border-gray-700/30 pt-3 space-y-2.5">
                            <div>
                              <p className="text-xs font-semibold text-orange-400 mb-1">⚡ 消耗しやすい環境</p>
                              <ul className="space-y-0.5">
                                {fit.drainEnvironments.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                                    <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-400 mb-1">🤝 マネジメントヒント</p>
                              <ul className="space-y-0.5">
                                {fit.managementTips.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                                    <span className="text-blue-500 shrink-0 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-emerald-400 mb-1">🌱 成長アクション</p>
                              <ul className="space-y-0.5">
                                {fit.growthActions.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                                    <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
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

        {/* ── Behavior tags (preserved for #behavior-tags anchor) ── */}
        <div id="behavior-tags">
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

        {/* ── CTA ── */}
        <div>
          <a
            href="/"
            className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-semibold text-sm text-center"
          >
            自分のタイプを診断する →
          </a>
        </div>

        {/* Bottom links */}
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
