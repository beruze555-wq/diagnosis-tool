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
  getAxisADescription,
  getAxisBDescription,
  getAxisCDescription,
  getPersonalityType,
  getSJTBehaviorTendency,
  calculateDeepAnalysis,
  getZonePattern,
  getLearningAgilityDescription,
  getSelfEfficacyDescription,
  getAutonomousMotivationDescription,
  getCrisisResponseDescription,
  getTeamContributionDescription,
  getAntifragilityDescription,
  DeepAnalysis,
  ZonePattern,
} from '@/lib/scoring'
import { saveDiagnosisResult } from '@/lib/supabase'
import { ScenarioAnswer, Layer2Answers, Scores } from '@/types'
import { scenarios } from '@/lib/scenarios'
import { layer2Sections } from '@/lib/layer2Questions'

const ZONE_STROKE: Record<'green' | 'yellow' | 'red', string> = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
}

// ─── Shared color progress bar ────────────────────────────────────────────────

function ColorProgressBar({ score }: { score: number }) {
  return (
    <div className="mt-2 mb-1">
      <div className="relative h-3 rounded-full overflow-hidden flex">
        <div className="h-full bg-red-500/50" style={{ width: '39%' }} />
        <div className="h-full bg-yellow-500/50" style={{ width: '20%' }} />
        <div className="h-full bg-blue-500/50" style={{ width: '20%' }} />
        <div className="h-full bg-green-500/50" style={{ width: '21%' }} />
        <div
          className="absolute top-0 h-3 w-1 bg-white rounded shadow-lg"
          style={{ left: `calc(${score}% - 2px)` }}
        />
      </div>
      <div className="flex text-xs mt-0.5">
        <span className="text-red-400" style={{ width: '39%', textAlign: 'center' }}>0–39</span>
        <span className="text-yellow-400" style={{ width: '20%', textAlign: 'center' }}>40–59</span>
        <span className="text-blue-400" style={{ width: '20%', textAlign: 'center' }}>60–79</span>
        <span className="text-green-400" style={{ width: '21%', textAlign: 'center' }}>80–100</span>
      </div>
    </div>
  )
}

// ─── Axis score section ───────────────────────────────────────────────────────

function ScoreSection({
  label,
  score,
  paragraphs,
  skipped,
}: {
  label: string
  score: number
  paragraphs: string[]
  skipped?: boolean
}) {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-200">{label}</span>
        <span className="text-xl font-bold text-white">
          {skipped ? '—' : score}
          {!skipped && <span className="text-xs text-gray-400 font-normal"> / 100</span>}
        </span>
      </div>
      {!skipped && <ColorProgressBar score={score} />}
      {!skipped
        ? paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-gray-300 leading-relaxed">{p}</p>
          ))
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
        <span className="text-base font-bold text-white">
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
  layer2Answers?: Layer2Answers
  scores: Scores
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const allData = {
    scores: { OS: scores.OS, 粘り強さ: scores.A, 情緒安定性: scores.B, 達成動機: scores.C, zone: scores.zone },
    layer1: scenarioAnswers.map((ans, i) => ({
      scenarioId: i + 1,
      title: scenarios[i]?.title ?? `シナリオ${i + 1}`,
      sjtRatings: scenarios[i]?.sjtOptions.map((opt, j) => ({
        label: opt.label,
        text: opt.text,
        tags: opt.tags,
        rating: ans.sjtRatings[j],
      })) ?? ans.sjtRatings,
      attributions: ans.attributions,
    })),
    layer2: layer2Sections.flatMap((s) =>
      s.questions.map((q, idx) => ({
        id: q.id,
        axis: s.axis,
        text: q.text,
        source: q.source,
        value: layer2Answers
          ? (layer2Answers[`axis${s.axis}` as keyof Layer2Answers][idx] ?? 0)
          : 0,
      }))
    ),
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
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'OS（帰属）', val: scores.OS },
                { label: '粘り強さ', val: scores.A },
                { label: '情緒安定性', val: scores.B },
                { label: '達成動機', val: scores.C },
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
                    <p className="text-gray-500">SJT (A/B/C/D)：{ans.sjtRatings.join(' / ')}</p>
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
                {layer2Sections.flatMap((s) =>
                  s.questions.map((q, idx) => {
                    const val = layer2Answers[`axis${s.axis}` as keyof Layer2Answers][idx]
                    return (
                      <div key={q.id} className="flex items-start gap-2 text-xs bg-gray-900 rounded p-2">
                        <span className="text-blue-400 font-mono w-6 shrink-0">{q.id}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-400 leading-relaxed">{q.text}</p>
                          <p className="text-gray-600 mt-0.5">{q.source}</p>
                        </div>
                        <span className="text-white font-bold shrink-0">{val}</span>
                      </div>
                    )
                  })
                )}
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ResultPage() {
  const router = useRouter()
  const [scores, setScores] = useState<Scores | null>(null)
  const [personalityType, setPersonalityType] = useState<{
    name: string
    icon: string
    bandClass: string
    paragraphs: string[]
  } | null>(null)
  const [behaviorTendency, setBehaviorTendency] = useState<{
    tag1: string
    tag2: string
    description: string
  } | null>(null)
  const [deepAnalysis, setDeepAnalysis] = useState<DeepAnalysis | null>(null)
  const [zonePattern, setZonePattern] = useState<ZonePattern | null>(null)
  const [layer2Skipped, setLayer2Skipped] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [rawAnswers, setRawAnswers] = useState<{
    scenarioAnswers: ScenarioAnswer[]
    layer2Answers?: Layer2Answers
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
      const devScores = JSON.parse(devScoresRaw) as Scores
      const devLayer2Raw = sessionStorage.getItem('layer2Answers')
      const devLayer2: Layer2Answers | undefined = devLayer2Raw ? JSON.parse(devLayer2Raw) : undefined
      setScores(devScores)
      setZonePattern(getZonePattern(devScores.OS, devScores.A, devScores.B, devScores.C))
      setPersonalityType(getPersonalityType(devScores.OS, devScores.A, devScores.B, devScores.C))
      setBehaviorTendency({ tag1: '行動変容', tag2: 'フィードバック志向', description: '（開発モード：ダミーデータ）' })
      if (devLayer2) {
        setDeepAnalysis(calculateDeepAnalysis([], devLayer2))
      } else {
        setDeepAnalysis({ learningAgility: 70, selfEfficacy: 65, autonomousMotivation: 75, crisisResponse: 60, teamContribution: 72, antifragility: 68 })
      }
      setRawAnswers({ scenarioAnswers: [], layer2Answers: devLayer2 })
      setSaved(true)
      return
    }

    const userInfo = JSON.parse(userInfoRaw)
    const scenarioAnswers: ScenarioAnswer[] = JSON.parse(scenarioAnswersRaw)
    const skipped = sessionStorage.getItem('layer2Skipped') === 'true'
    const layer2Raw = sessionStorage.getItem('layer2Answers')
    const layer2Answers: Layer2Answers | undefined = layer2Raw ? JSON.parse(layer2Raw) : undefined

    setLayer2Skipped(skipped)
    setRawAnswers({ scenarioAnswers, layer2Answers })

    const calculated = calculateScores(scenarioAnswers, layer2Answers)
    setScores(calculated)
    setBehaviorTendency(getSJTBehaviorTendency(scenarioAnswers))

    let pType = { name: '—', icon: '', bandClass: '', paragraphs: [] as string[] }
    let da: DeepAnalysis | null = null
    let zp: ZonePattern

    if (!skipped && layer2Answers) {
      pType = getPersonalityType(calculated.OS, calculated.A, calculated.B, calculated.C)
      da = calculateDeepAnalysis(scenarioAnswers, layer2Answers)
      zp = getZonePattern(calculated.OS, calculated.A, calculated.B, calculated.C)
    } else {
      zp = getZonePattern(calculated.OS, 0, 0, 0)
    }

    setPersonalityType(pType)
    setDeepAnalysis(da)
    setZonePattern(zp)

    saveDiagnosisResult({
      age: userInfo.age,
      affiliation: userInfo.affiliation,
      scenarioAnswers,
      layer2Answers,
      osScore: calculated.OS,
      axisA: calculated.A,
      axisB: calculated.B,
      axisC: calculated.C,
      zone: calculated.zone,
      zoneId: zp.zoneId,
      personalityType: pType.name,
      deepAnalysis: da ?? undefined,
    })
      .then(() => setSaved(true))
      .catch(() => setSaveError(true))
  }, [router])

  if (!scores || !behaviorTendency || !rawAnswers || !zonePattern) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">結果を計算中...</div>
      </div>
    )
  }

  const zoneStroke = ZONE_STROKE[zonePattern.zoneColor]
  const zoneBandClass =
    zonePattern.zoneColor === 'green'
      ? 'bg-green-500'
      : zonePattern.zoneColor === 'yellow'
      ? 'bg-yellow-500'
      : 'bg-red-500'

  const chartData = [
    { axis: 'OS（帰属）', value: scores.OS },
    { axis: '粘り強さ', value: scores.A },
    { axis: '情緒安定性', value: scores.B },
    { axis: '達成動機', value: scores.C },
  ]

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-6 fade-in">

        <div className="text-center">
          <p className="text-sm text-gray-500 tracking-wide mb-1">MIRROR</p>
          <h1 className="text-2xl font-bold text-white">あなたの診断結果</h1>
        </div>

        {/* ① Personality type */}
        {personalityType && personalityType.name !== '—' && personalityType.paragraphs.length > 0 && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
            <div className={`h-2 ${personalityType.bandClass}`} />
            <div className="p-6 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">パーソナリティタイプ</p>
              <h2 className="text-xl font-bold text-white">
                {personalityType.icon} {personalityType.name}
              </h2>
              {personalityType.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-gray-300 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* ② Radar chart */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Radar
                name="score"
                dataKey="value"
                stroke={zoneStroke}
                fill={zoneStroke}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ③ SJT behavior tendency */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-2">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">行動傾向</p>
          <p className="text-sm font-semibold text-white">
            {behaviorTendency.tag1} × {behaviorTendency.tag2}型
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">{behaviorTendency.description}</p>
        </div>

        {/* ④ Zone pattern */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
          <div className={`h-2 ${zoneBandClass}`} />
          <div className="p-6 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ゾーンパターン</p>
            <h3 className="text-lg font-bold text-white">
              {zonePattern.zoneIcon} [{zonePattern.zoneId}] {zonePattern.zoneName}
            </h3>
            {zonePattern.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
        </div>

        {/* ⑤ Axis scores */}
        <div className="space-y-4">
          <ScoreSection label="OS（帰属スタイル）" score={scores.OS} paragraphs={getOSDescription(scores.OS)} />
          <ScoreSection label="粘り強さ（Grit）" score={scores.A} paragraphs={getAxisADescription(scores.A)} skipped={layer2Skipped} />
          <ScoreSection label="情緒安定性" score={scores.B} paragraphs={getAxisBDescription(scores.B)} skipped={layer2Skipped} />
          <ScoreSection label="達成動機" score={scores.C} paragraphs={getAxisCDescription(scores.C)} skipped={layer2Skipped} />
        </div>

        {/* ⑥ Deep analysis */}
        {deepAnalysis && (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">深層分析</h2>
              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">リサーチベース</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              SJTと自己評価の回答パターンから算出した6つの追加指標です。
            </p>
            <DeepMetricCard
              label="学習敏捷性（Learning Agility）"
              score={deepAnalysis.learningAgility}
              description={getLearningAgilityDescription(deepAnalysis.learningAgility)}
            />
            <DeepMetricCard
              label="自己効力感（Self-Efficacy）"
              score={deepAnalysis.selfEfficacy}
              description={getSelfEfficacyDescription(deepAnalysis.selfEfficacy)}
            />
            <DeepMetricCard
              label="自律的動機（Autonomous Motivation）"
              score={deepAnalysis.autonomousMotivation}
              description={getAutonomousMotivationDescription(deepAnalysis.autonomousMotivation)}
            />
            <DeepMetricCard
              label="危機対応力（Crisis Response）"
              score={deepAnalysis.crisisResponse}
              description={getCrisisResponseDescription(deepAnalysis.crisisResponse)}
            />
            <DeepMetricCard
              label="チーム貢献力（Team Contribution）"
              score={deepAnalysis.teamContribution}
              description={getTeamContributionDescription(deepAnalysis.teamContribution)}
            />
            <DeepMetricCard
              label="折れない度（Anti-Fragility）"
              score={deepAnalysis.antifragility}
              description={getAntifragilityDescription(deepAnalysis.antifragility)}
            />
          </div>
        )}

        {/* ⑦ Answer viewer */}
        <AnswerViewer
          scenarioAnswers={rawAnswers.scenarioAnswers}
          layer2Answers={rawAnswers.layer2Answers}
          scores={scores}
        />

        {/* Save status */}
        <div className="text-center text-xs">
          {saved && <span className="text-green-500">✓ 回答が保存されました</span>}
          {saveError && <span className="text-yellow-500">⚠ 保存に失敗しました（結果は変わりません）</span>}
        </div>

        {/* Restart */}
        <button
          onClick={() => { sessionStorage.clear(); router.push('/') }}
          className="w-full py-3 rounded-xl border border-gray-600 text-gray-400 hover:bg-gray-800 transition-colors text-sm"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  )
}
