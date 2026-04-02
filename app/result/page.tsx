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
  getZoneComment,
  getPersonalityType,
  getSJTBehaviorTendency,
} from '@/lib/scoring'
import { saveDiagnosisResult } from '@/lib/supabase'
import { ScenarioAnswer, Layer2Answers, Scores, Zone } from '@/types'

const ZONE_COLOR: Record<Zone, string> = {
  Green: '#22c55e',
  Yellow: '#eab308',
  Red: '#ef4444',
}

const ZONE_LABEL: Record<Zone, string> = {
  Green: 'Green ✓',
  Yellow: 'Yellow △',
  Red: 'Red ✕',
}

const ZONE_BG: Record<Zone, string> = {
  Green: 'bg-green-500/20 text-green-400 border-green-500/40',
  Yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  Red: 'bg-red-500/20 text-red-400 border-red-500/40',
}

// Color progress bar with zone bands (0-39=red, 40-59=yellow, 60-79=blue, 80-100=green)
function ColorProgressBar({ score }: { score: number }) {
  return (
    <div className="mt-2 mb-1">
      <div className="relative h-3 rounded-full overflow-hidden flex">
        <div className="h-full bg-red-500/50" style={{ width: '39%' }} />
        <div className="h-full bg-yellow-500/50" style={{ width: '20%' }} />
        <div className="h-full bg-blue-500/50" style={{ width: '20%' }} />
        <div className="h-full bg-green-500/50" style={{ width: '21%' }} />
        {/* Score marker */}
        <div
          className="absolute top-0 h-3 w-1 bg-white rounded shadow-lg"
          style={{ left: `calc(${score}% - 2px)` }}
        />
      </div>
      <div className="flex text-xs mt-1" style={{ color: 'transparent' }}>
        <span className="text-red-400" style={{ width: '39%', textAlign: 'center' }}>0–39</span>
        <span className="text-yellow-400" style={{ width: '20%', textAlign: 'center' }}>40–59</span>
        <span className="text-blue-400" style={{ width: '20%', textAlign: 'center' }}>60–79</span>
        <span className="text-green-400" style={{ width: '21%', textAlign: 'center' }}>80–100</span>
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
    <div className="bg-gray-800 rounded-xl p-5 space-y-3">
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
            <p key={i} className="text-sm text-gray-300 leading-relaxed">
              {p}
            </p>
          ))
        : <p className="text-sm text-gray-500">未評価（パート1の結果によりスキップ）</p>
      }
    </div>
  )
}

export default function ResultPage() {
  const router = useRouter()
  const [scores, setScores] = useState<Scores | null>(null)
  const [personalityType, setPersonalityType] = useState<{ name: string; description: string } | null>(null)
  const [behaviorTendency, setBehaviorTendency] = useState<{ tag1: string; tag2: string; description: string } | null>(null)
  const [layer2Skipped, setLayer2Skipped] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    const userInfoRaw = sessionStorage.getItem('userInfo')
    const scenarioAnswersRaw = sessionStorage.getItem('scenarioAnswers')

    if (!userInfoRaw || !scenarioAnswersRaw) {
      router.replace('/')
      return
    }

    const userInfo = JSON.parse(userInfoRaw)
    const scenarioAnswers: ScenarioAnswer[] = JSON.parse(scenarioAnswersRaw)
    const skipped = sessionStorage.getItem('layer2Skipped') === 'true'
    const layer2Raw = sessionStorage.getItem('layer2Answers')
    const layer2Answers: Layer2Answers | undefined = layer2Raw ? JSON.parse(layer2Raw) : undefined

    setLayer2Skipped(skipped)

    const calculated = calculateScores(scenarioAnswers, layer2Answers)
    setScores(calculated)

    // SJT behavior tendency (always available)
    setBehaviorTendency(getSJTBehaviorTendency(scenarioAnswers))

    // Personality type (only if layer2 was answered)
    let pType = { name: '—', description: '' }
    if (!skipped && layer2Answers) {
      pType = getPersonalityType(calculated.OS, calculated.A, calculated.B, calculated.C)
    }
    setPersonalityType(pType)

    // Save to Supabase
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
      personalityType: pType.name,
    })
      .then(() => setSaved(true))
      .catch(() => setSaveError(true))
  }, [router])

  if (!scores || !behaviorTendency) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">結果を計算中...</div>
      </div>
    )
  }

  const zoneColor = ZONE_COLOR[scores.zone]

  const chartData = [
    { axis: 'OS（帰属）', value: scores.OS },
    { axis: '粘り強さ', value: scores.A },
    { axis: '鈍感力', value: scores.B },
    { axis: '達成動機', value: scores.C },
  ]

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-6 fade-in">

        {/* Zone badge */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">診断結果</h1>
          <div
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 text-2xl font-bold ${ZONE_BG[scores.zone]}`}
          >
            {ZONE_LABEL[scores.zone]}
          </div>
          <p className="text-gray-400 text-sm mt-4 leading-relaxed px-4">
            {getZoneComment(scores.zone)}
          </p>
        </div>

        {/* Personality type */}
        {personalityType && personalityType.name !== '—' && (
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/40 rounded-2xl p-5">
            <p className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">パーソナリティタイプ</p>
            <h2 className="text-xl font-bold text-white mb-2">{personalityType.name}</h2>
            <p className="text-sm text-gray-300 leading-relaxed">{personalityType.description}</p>
          </div>
        )}

        {/* Radar chart */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Radar
                name="score"
                dataKey="value"
                stroke={zoneColor}
                fill={zoneColor}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* SJT behavior tendency */}
        <div className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">行動傾向</p>
          <p className="text-sm font-semibold text-white mb-2">
            💡{behaviorTendency.tag1} × {behaviorTendency.tag2}型
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">{behaviorTendency.description}</p>
        </div>

        {/* Score sections */}
        <div className="space-y-4">
          <ScoreSection
            label="OS（帰属スタイル）"
            score={scores.OS}
            paragraphs={getOSDescription(scores.OS)}
          />
          <ScoreSection
            label="粘り強さ"
            score={scores.A}
            paragraphs={getAxisADescription(scores.A)}
            skipped={layer2Skipped}
          />
          <ScoreSection
            label="鈍感力（情緒安定性）"
            score={scores.B}
            paragraphs={getAxisBDescription(scores.B)}
            skipped={layer2Skipped}
          />
          <ScoreSection
            label="達成動機"
            score={scores.C}
            paragraphs={getAxisCDescription(scores.C)}
            skipped={layer2Skipped}
          />
        </div>

        {/* Save status */}
        <div className="text-center text-xs">
          {saved && <span className="text-green-500">✓ 回答が保存されました</span>}
          {saveError && <span className="text-yellow-500">⚠ 保存に失敗しました（結果は変わりません）</span>}
        </div>

        {/* Restart */}
        <button
          onClick={() => {
            sessionStorage.clear()
            router.push('/')
          }}
          className="w-full py-3 rounded-xl border border-gray-600 text-gray-400 hover:bg-gray-800 transition-colors text-sm"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  )
}
