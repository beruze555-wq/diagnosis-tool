'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import {
  calculateScores,
  getOSDescription,
  getSEDescription,
  getPEDescription,
  getESDescription,
  getCIDescription,
  getAMDescription,
  getPersonalityTypeKey,
  getZoneName,
  PERSONALITY_TYPES,
  computeRiskIndicators,
  calculateDeepAnalysis,
  getEnvironmentFit,
  EnvironmentFit,
} from '@/lib/scoring'
import { saveDiagnosisResult } from '@/lib/supabase'
import ReferencesMarquee from '@/components/ReferencesMarquee'
import { ScenarioAnswer, DeepAnalysis } from '@/types'
import { scenarios } from '@/lib/scenarios'
import { layer2Questions } from '@/lib/layer2Questions'
import ChainFlow from './ChainFlow'
import ShareCard from './ShareCard'

// ─── Color helpers ─────────────────────────────────────────────────────────────

function scoreSegment(score: number): 'red' | 'yellow' | 'blue' | 'green' {
  if (score >= 80) return 'green'
  if (score >= 60) return 'blue'
  if (score >= 40) return 'yellow'
  return 'red'
}

function scoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-blue-400'
  if (score >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

// ─── Shared color progress bar ────────────────────────────────────────────────

function ColorProgressBar({ score }: { score: number }) {
  const seg = scoreSegment(score)
  const segments = [
    { key: 'red',    bg: seg === 'red'    ? 'bg-red-500'    : 'bg-red-500/30',    width: '40%', label: '0-39',   left: '20%', labelColor: seg === 'red'    ? 'text-red-400'    : 'text-gray-600' },
    { key: 'yellow', bg: seg === 'yellow' ? 'bg-yellow-500' : 'bg-yellow-500/30', width: '20%', label: '40-59',  left: '50%', labelColor: seg === 'yellow' ? 'text-yellow-400' : 'text-gray-600' },
    { key: 'blue',   bg: seg === 'blue'   ? 'bg-blue-500'   : 'bg-blue-500/30',   width: '20%', label: '60-79',  left: '70%', labelColor: seg === 'blue'   ? 'text-blue-400'   : 'text-gray-600' },
    { key: 'green',  bg: seg === 'green'  ? 'bg-green-500'  : 'bg-green-500/30',  width: '20%', label: '80-100', left: '90%', labelColor: seg === 'green'  ? 'text-green-400'  : 'text-gray-600' },
  ]
  return (
    <div className="mt-2 mb-1">
      <div className="relative flex items-center" style={{ height: '20px' }}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 rounded-full overflow-hidden flex">
          {segments.map(s => (
            <div key={s.key} className={s.bg} style={{ width: s.width }} />
          ))}
        </div>
        <div
          className="absolute w-0.5 h-5 bg-white rounded-full shadow-md"
          style={{ left: `${score}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="relative mt-1" style={{ height: '16px' }}>
        {segments.map(s => (
          <span
            key={s.key}
            className={`absolute text-xs ${s.labelColor}`}
            style={{ left: s.left, transform: 'translateX(-50%)' }}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Axis score section ───────────────────────────────────────────────────────

function ScoreSection({
  label,
  score,
  description,
  skipped,
}: {
  label: string
  score: number
  description: string
  skipped?: boolean
}) {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-200">{label}</span>
        <span className={`text-xl font-bold ${skipped ? 'text-white' : scoreTextColor(score)}`}>
          {skipped ? '—' : score}
          {!skipped && <span className="text-xs text-gray-400 font-normal"> / 100</span>}
        </span>
      </div>
      {!skipped && <ColorProgressBar score={score} />}
      {!skipped
        ? <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
        : <p className="text-sm text-gray-500">未評価（パート1の結果によりスキップ）</p>
      }
    </div>
  )
}

// ─── Deep analysis metric card ────────────────────────────────────────────────

function DeepMetricCard({
  label,
  score,
  description,
}: {
  label: string
  score: number
  description: string
}) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className={`text-base font-bold ${scoreTextColor(score)}`}>
          {score}
          <span className="text-xs text-gray-400 font-normal"> / 100</span>
        </span>
      </div>
      <ColorProgressBar score={score} />
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Answer data viewer ───────────────────────────────────────────────────────

function AnswerViewer({
  scenarioAnswers,
  layer2Answers,
  scores,
}: {
  scenarioAnswers: ScenarioAnswer[]
  layer2Answers?: number[]
  scores: { OS: number; SE: number; PE: number; ES: number; CI: number; AM: number }
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const allData = {
    scores: { SE: scores.SE, PE: scores.PE, OS: scores.OS, ES: scores.ES, CI: scores.CI, AM: scores.AM },
    layer1: scenarioAnswers.map((ans, i) => ({
      scenarioId: i + 1,
      title: scenarios[i]?.title ?? `シナリオ${i + 1}`,
      attributions: ans.attributions,
    })),
    layer2: layer2Answers
      ? layer2Questions.map((q, idx) => ({
          id: q.id,
          text: q.text,
          source: q.source,
          value: layer2Answers[idx] ?? 0,
        }))
      : [],
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(allData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/80 transition-colors text-left flex justify-between items-center"
      >
        <span>回答データを表示</span>
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="border-t border-gray-700 p-6 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">スコア</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {[
                { label: 'SE', val: scores.SE },
                { label: 'PE', val: scores.PE },
                { label: 'OS', val: scores.OS },
                { label: 'ES', val: scores.ES },
                { label: 'CI', val: scores.CI },
                { label: 'AM', val: scores.AM },
              ].map(({ label, val }) => (
                <div key={label} className="bg-gray-900 rounded-lg p-2.5 flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
          {scenarioAnswers.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Part 1 回答</h3>
              <div className="space-y-2">
                {scenarioAnswers.map((ans, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-3 text-xs space-y-1">
                    <p className="font-semibold text-gray-200">シナリオ{i + 1}：{scenarios[i]?.title}</p>
                    <p className="text-gray-500">帰属評定 (Q1/Q2/Q3)：{ans.attributions.join(' / ')}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-600">Layer1データなし（開発モード）</p>
          )}
          {layer2Answers ? (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Part 2 回答</h3>
              <div className="space-y-1">
                {layer2Questions.map((q, idx) => (
                  <div key={q.id} className="flex items-start gap-2 text-xs bg-gray-900 rounded p-2">
                    <span className="text-blue-400 font-mono w-8 shrink-0">{q.id}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 leading-relaxed">{q.text}</p>
                      <p className="text-gray-600 mt-0.5">{q.source}</p>
                    </div>
                    <span className="text-white font-bold shrink-0">{layer2Answers[idx] ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-600">Layer2データなし（スキップまたは開発モード）</p>
          )}
          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? '✓ コピーしました' : 'JSONをコピー'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Scenario Accordion ───────────────────────────────────────────────────────

function ScenarioAccordion({ scenarios: sc }: { scenarios: { startup: string; teamLead: string; longProject: string } }) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const items = [
    { key: 'startup',     icon: '🚀', label: 'スタートアップ初期', sub: '資金が底をつきかけた時',      content: sc.startup },
    { key: 'teamLead',    icon: '👥', label: 'チームリーダー',      sub: 'メンバーが次々と辞めていく時', content: sc.teamLead },
    { key: 'longProject', icon: '📊', label: '長期プロジェクト',    sub: '成果が見えない半年間',        content: sc.longProject },
  ]
  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
      <div className="p-6 pb-3">
        <h2 className="text-base font-bold text-white">あなたが直面する3つの場面</h2>
        <p className="text-xs text-gray-500 mt-1">タップして展開</p>
      </div>
      <div className="divide-y divide-gray-700/50">
        {items.map(item => (
          <div key={item.key}>
            <button
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/80 transition-colors"
              onClick={() => setOpenKey(openKey === item.key ? null : item.key)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
              </div>
              <span className="text-gray-600 text-xs shrink-0">{openKey === item.key ? '▲' : '▼'}</span>
            </button>
            {openKey === item.key && (
              <div className="px-6 pb-5">
                <p className="text-sm text-gray-300 leading-relaxed">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Scores = { SE: number; PE: number; OS: number; ES: number; CI: number; AM: number }

export default function ResultPage() {
  const router = useRouter()
  const [scores, setScores] = useState<Scores | null>(null)
  const [personalityType, setPersonalityType] = useState<typeof PERSONALITY_TYPES[string] | null>(null)
  const [typeKey, setTypeKey] = useState<string>('LLLL')
  const [deepAnalysis, setDeepAnalysis] = useState<DeepAnalysis | null>(null)
  const [environmentFit, setEnvironmentFit] = useState<EnvironmentFit | null>(null)
  const [layer2Skipped, setLayer2Skipped] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [rawAnswers, setRawAnswers] = useState<{
    scenarioAnswers: ScenarioAnswer[]
    layer2Answers?: number[]
  } | null>(null)

  useEffect(() => {
    const userInfoRaw = sessionStorage.getItem('userInfo')
    const scenarioAnswersRaw = sessionStorage.getItem('scenarioAnswers')

    if (!userInfoRaw || !scenarioAnswersRaw) {
      router.replace('/')
      return
    }

    // Dev mode
    const devMode = sessionStorage.getItem('devMode') === 'true'
    const devScoresRaw = sessionStorage.getItem('devScores')
    if (devMode && devScoresRaw) {
      const devScores = JSON.parse(devScoresRaw) as { OS: number; SE: number; PE: number; ES: number }
      const devLayer2Raw = sessionStorage.getItem('layer2Answers')
      // SE×8, PE×5, CI×5, ES×10, AM×6
      const DEV_LAYER2 = [4,5,5,4,4,4,4,5, 5,5,4,5,5, 4,5,4,5,4, 1,5,1,4,4,5,1,5,2,4, 5,5,3,1,5,2]
      const devLayer2: number[] = devLayer2Raw
        ? JSON.parse(devLayer2Raw)
        : DEV_LAYER2

      const fullScores: Scores = {
        OS: devScores.OS ?? 29,
        SE: devScores.SE ?? 88,
        PE: devScores.PE ?? 96,
        ES: devScores.ES ?? 88,
        CI: 32,
        AM: 57,
      }
      const key = getPersonalityTypeKey(fullScores.SE, fullScores.PE, fullScores.OS, fullScores.ES)
      setScores(fullScores)
      setTypeKey(key)
      setPersonalityType(PERSONALITY_TYPES[key] ?? PERSONALITY_TYPES.LLLL)
      setEnvironmentFit(getEnvironmentFit(key))
      setDeepAnalysis(calculateDeepAnalysis(devLayer2))
      const devScenarioAnswers: ScenarioAnswer[] = [
        { scenarioId: 1, attributions: [7, 7, 7] },
        { scenarioId: 2, attributions: [7, 3, 5] },
        { scenarioId: 3, attributions: [4, 7, 7] },
        { scenarioId: 4, attributions: [7, 6, 1] },
        { scenarioId: 5, attributions: [6, 7, 6] },
        { scenarioId: 6, attributions: [7, 7, 7] },
      ]
      setRawAnswers({ scenarioAnswers: devScenarioAnswers, layer2Answers: devLayer2 })
      setSaved(true)
      return
    }

    const userInfo = JSON.parse(userInfoRaw)
    const scenarioAnswers: ScenarioAnswer[] = JSON.parse(scenarioAnswersRaw)
    const layer2Raw = sessionStorage.getItem('layer2Answers')
    const skipped = sessionStorage.getItem('layer2Skipped') === 'true' && !layer2Raw

    let layer2Answers: number[] | undefined
    if (layer2Raw) {
      const parsed = JSON.parse(layer2Raw)
      if (Array.isArray(parsed) && typeof parsed[0] === 'number') {
        layer2Answers = parsed
      }
    }

    setLayer2Skipped(skipped)
    setRawAnswers({ scenarioAnswers, layer2Answers })

    const calculated = calculateScores(scenarioAnswers, layer2Answers ?? [])
    setScores(calculated)

    const key = getPersonalityTypeKey(calculated.SE, calculated.PE, calculated.OS, calculated.ES)
    setTypeKey(key)
    setPersonalityType(PERSONALITY_TYPES[key] ?? PERSONALITY_TYPES.LLLL)
    setEnvironmentFit(getEnvironmentFit(key))

    const da = (!skipped && layer2Answers) ? calculateDeepAnalysis(layer2Answers) : null
    setDeepAnalysis(da)

    const riskIndicators = computeRiskIndicators(calculated.SE, calculated.PE, calculated.OS, calculated.ES)
    const pt = PERSONALITY_TYPES[key] ?? PERSONALITY_TYPES.LLLL

    // 同一セッションで既に保存済みなら再保存しない（ページリロード対策）
    if (sessionStorage.getItem('resultSaved') === 'true') {
      setSaved(true)
      return
    }

    saveDiagnosisResult({
      age: userInfo.age,
      affiliation: userInfo.affiliation,
      scenarioAnswers,
      layer2Answers,
      osScore: calculated.OS,
      seScore: calculated.SE,
      peScore: calculated.PE,
      esScore: calculated.ES,
      typeCode: key,
      zoneName: getZoneName(key),
      personalityTypeName: pt.name,
      deepAnalysis: da ?? undefined,
      adversityRiskNote: riskIndicators.adversityRiskNote,
    })
      .then(() => { sessionStorage.setItem('resultSaved', 'true'); setSaved(true) })
      .catch((err) => { console.error('診断結果の保存に失敗しました:', err); setSaveError(true) })
  }, [router])

  if (!scores || !rawAnswers || !environmentFit || !personalityType) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">結果を計算中...</div>
      </div>
    )
  }

  const chartData = [
    { axis: '自己効力感', value: scores.SE },
    { axis: '持続的努力', value: scores.PE },
    { axis: '逆境解釈力', value: scores.OS },
    { axis: '情緒安定性', value: scores.ES },
  ]

  const axisCode = `SE:${scores.SE >= 60 ? 'H' : 'L'} / PE:${scores.PE >= 60 ? 'H' : 'L'} / OS:${scores.OS >= 60 ? 'H' : 'L'} / ES:${scores.ES >= 60 ? 'H' : 'L'}`

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-6 fade-in">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm text-gray-500 tracking-wide mb-1">MIRROR</p>
          <h1 className="text-2xl font-bold text-white">あなたの診断結果</h1>
        </div>

        {/* 第1層: タイプアイデンティティ */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="p-6 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">パーソナリティタイプ</p>
            <div>
              <h2 className="text-4xl font-bold text-white">{personalityType.name}</h2>
              <p className="text-sm text-gray-300 mt-1.5 italic">{personalityType.tagline}</p>
              <p className="text-xs text-gray-500 mt-0.5">{personalityType.subtitle}</p>
              <p className="text-xs text-gray-600 mt-0.5">{axisCode}</p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{personalityType.story}</p>
            <div className="space-y-3 pt-1">
              <div>
                <p className="text-xs font-medium text-emerald-400 mb-1">✦ 強み</p>
                <ul className="space-y-1">
                  {personalityType.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-orange-400 mb-1">⚠ 盲点</p>
                <ul className="space-y-1">
                  {personalityType.blindSpots.map((b, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-orange-400 shrink-0 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-red-400 mb-1">逆境時の行動パターン</p>
                <p className="text-sm text-gray-300 leading-relaxed">{personalityType.underPressure}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-400 mb-1">成長のヒント</p>
                <p className="text-sm text-gray-300 leading-relaxed">{personalityType.growthTip}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/types')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
            >
              全タイプ一覧を見る →
            </button>
          </div>
        </div>

        {/* ShareCard */}
        <ShareCard
          typeName={personalityType.name}
          tagline={personalityType.tagline}
          scores={{ SE: scores.SE, PE: scores.PE, OS: scores.OS, ES: scores.ES }}
        />

        {/* セクション見出し: 詳細分析 */}
        <div className="text-center pt-6 pb-2 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            <span className="text-xs text-gray-500 tracking-widest uppercase">Detailed Analysis</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>
          <h2 className="text-lg font-bold text-white">科学的根拠に基づいた詳しい分析</h2>
          <p className="text-xs text-gray-500">あなたの回答データから導き出された、各指標の詳細レポート</p>
        </div>

        {/* 第2層: スコア分析 */}
        <ChainFlow os={scores.OS} es={scores.ES} se={scores.SE} pe={scores.PE} />

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData} margin={{ top: 28, right: 28, bottom: 28, left: 28 }}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="axis"
                tick={(props: any) => {
                  const { x, y, payload } = props
                  const ta = props.textAnchor as 'start' | 'middle' | 'end' | 'inherit' | undefined
                  const item = chartData.find(d => d.axis === payload.value)
                  const score = item?.value ?? 0
                  return (
                    <g>
                      <text x={x} y={y - 5} textAnchor={ta} fill="#9ca3af" fontSize={10}>
                        {payload.value}
                      </text>
                      <text x={x} y={y + 11} textAnchor={ta} fill="#60a5fa" fontSize={14} fontWeight="bold">
                        {score}
                      </text>
                    </g>
                  )
                }}
              />
              <Radar
                name="score"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <ScoreSection
            label="自己効力感（Self-Efficacy）"
            score={scores.SE}
            description={getSEDescription(scores.SE)}
            skipped={layer2Skipped}
          />
          <ScoreSection
            label="持続的努力（Perseverance of Effort）"
            score={scores.PE}
            description={getPEDescription(scores.PE)}
            skipped={layer2Skipped}
          />
          <ScoreSection
            label="逆境解釈力（Explanatory Style）"
            score={scores.OS}
            description={getOSDescription(scores.OS)}
          />
          <ScoreSection
            label="情緒安定性（Emotional Stability）"
            score={scores.ES}
            description={getESDescription(scores.ES)}
            skipped={layer2Skipped}
          />
        </div>

        {deepAnalysis && (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">補助指標</h2>
              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">リサーチベース</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              自己評価の回答パターンから算出した補助的な心理指標です。
            </p>
            <DeepMetricCard
              label="自律的動機づけ（Autonomous Motivation）"
              description={getAMDescription(deepAnalysis.autonomousMotivation)}
              score={deepAnalysis.autonomousMotivation}
            />
            <DeepMetricCard
              label="興味の一貫性（Consistency of Interests）"
              description={getCIDescription(deepAnalysis.consistencyOfInterest)}
              score={deepAnalysis.consistencyOfInterest}
            />
          </div>
        )}

        {/* 第3層: 状況シミュレーション */}
        <ScenarioAccordion scenarios={personalityType.scenarios} />

        {/* 第4層: 環境適性 */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
          <div className="h-2 bg-blue-500" />
          <div className="p-6 space-y-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">あなたに合う環境</p>

            <div>
              <p className="text-sm font-semibold text-emerald-400 mb-2">✨ 力を発揮できる環境</p>
              <ul className="space-y-1">
                {environmentFit.idealEnvironment.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 leading-relaxed flex gap-2">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-orange-400 mb-2">⚡ エネルギーを消耗しやすい環境</p>
              <ul className="space-y-1">
                {environmentFit.stressors.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 leading-relaxed flex gap-2">
                    <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-400 mb-2">🌱 成長のためのアクション</p>
              <ul className="space-y-1">
                {environmentFit.copingStrategies.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 leading-relaxed flex gap-2">
                    <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 回答データ */}
        <AnswerViewer
          scenarioAnswers={rawAnswers.scenarioAnswers}
          layer2Answers={rawAnswers.layer2Answers}
          scores={scores}
        />

        {/* Save status */}
        <div className="text-center text-xs">
          {saved && <span className="text-green-500">✓ 回答が保存されました</span>}
          {saveError && <span className="text-xs text-red-400">診断結果の保存に失敗しました。結果は画面上で確認できます。</span>}
        </div>

        {/* Restart */}
        <button
          onClick={() => { sessionStorage.clear(); router.push('/') }}
          className="w-full py-3 rounded-xl border border-gray-600 text-gray-400 hover:bg-gray-800 transition-colors text-sm"
        >
          もう一度診断する
        </button>

        {/* 参考文献マーキー */}
        <ReferencesMarquee />

        <div className="text-center pb-4">
          <a href="/about" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            この診断の学術的背景について
          </a>
        </div>
      </div>
    </div>
  )
}
