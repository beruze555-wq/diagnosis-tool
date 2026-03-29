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
import { calculateScores, getOSDescription, getAxisADescription, getAxisBDescription, getAxisCDescription, getZoneComment } from '@/lib/scoring'
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

function ScoreCard({
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
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-300">{label}</span>
        <span className="text-lg font-bold text-white">
          {skipped ? '—' : `${score}`}
          {!skipped && <span className="text-xs text-gray-400 font-normal"> / 100</span>}
        </span>
      </div>
      {!skipped && (
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
      )}
      <p className="text-xs text-gray-400 leading-relaxed">{skipped ? '未評価（パート1の結果によりスキップ）' : description}</p>
    </div>
  )
}

export default function ResultPage() {
  const router = useRouter()
  const [scores, setScores] = useState<Scores | null>(null)
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
    })
      .then(() => setSaved(true))
      .catch(() => setSaveError(true))
  }, [router])

  if (!scores) {
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

        {/* Score cards */}
        <div className="space-y-3">
          <ScoreCard
            label="OS（帰属スタイル）"
            score={scores.OS}
            description={getOSDescription(scores.OS)}
          />
          <ScoreCard
            label="粘り強さ"
            score={scores.A}
            description={getAxisADescription(scores.A)}
            skipped={layer2Skipped}
          />
          <ScoreCard
            label="鈍感力（情緒安定性）"
            score={scores.B}
            description={getAxisBDescription(scores.B)}
            skipped={layer2Skipped}
          />
          <ScoreCard
            label="達成動機"
            score={scores.C}
            description={getAxisCDescription(scores.C)}
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
