'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { scenarios } from '@/lib/scenarios'
import { layer2Sections } from '@/lib/layer2Questions'
import { calculateOS } from '@/lib/scoring'
import { ScenarioAnswer, Layer2Answers } from '@/types'

const TOTAL_STEPS = 7 // 6 scenarios + 1 layer2

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div
        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function LikertRow5({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            value === n
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

function LikertRow7({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              value === n
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 px-0.5">
        <span>← {leftLabel}</span>
        <span>{rightLabel} →</span>
      </div>
    </div>
  )
}

export default function DiagnosisPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'layer1' | 'layer2'>('layer1')
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [scenarioAnswers, setScenarioAnswers] = useState<ScenarioAnswer[]>([])
  const [currentAnswer, setCurrentAnswer] = useState<ScenarioAnswer>({
    sjtRatings: [0, 0, 0, 0],
    attributions: [0, 0, 0],
  })
  const [layer2Answers, setLayer2Answers] = useState<Layer2Answers>({
    axisA: Array(10).fill(0),
    axisB: Array(10).fill(0),
    axisC: Array(10).fill(0),
  })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!sessionStorage.getItem('userInfo')) {
      router.replace('/')
    }
  }, [router])

  const isLayer1Complete =
    currentAnswer.sjtRatings.every((v) => v > 0) &&
    currentAnswer.attributions.every((v) => v > 0)

  const isLayer2Complete =
    layer2Answers.axisA.every((v) => v > 0) &&
    layer2Answers.axisB.every((v) => v > 0) &&
    layer2Answers.axisC.every((v) => v > 0)

  const transition = useCallback((cb: () => void) => {
    setVisible(false)
    setTimeout(() => {
      cb()
      setVisible(true)
    }, 250)
  }, [])

  const handleNextScenario = () => {
    if (!isLayer1Complete) return
    const newAnswers = [...scenarioAnswers, currentAnswer]

    if (scenarioIndex < scenarios.length - 1) {
      transition(() => {
        setScenarioAnswers(newAnswers)
        setScenarioIndex((i) => i + 1)
        setCurrentAnswer({ sjtRatings: [0, 0, 0, 0], attributions: [0, 0, 0] })
      })
    } else {
      // Last scenario done — evaluate OS
      const OS = calculateOS(newAnswers)
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      if (OS < 35) {
        sessionStorage.setItem('layer2Skipped', 'true')
        router.push('/result')
      } else {
        transition(() => {
          setScenarioAnswers(newAnswers)
          setPhase('layer2')
        })
      }
    }
  }

  const handleSubmitLayer2 = () => {
    if (!isLayer2Complete) return
    sessionStorage.setItem('layer2Answers', JSON.stringify(layer2Answers))
    router.push('/result')
  }

  const setSJTRating = (optionIdx: number, value: number) => {
    setCurrentAnswer((prev) => {
      const ratings = [...prev.sjtRatings]
      ratings[optionIdx] = value
      return { ...prev, sjtRatings: ratings }
    })
  }

  const setAttribution = (qIdx: number, value: number) => {
    setCurrentAnswer((prev) => {
      const attrs = [...prev.attributions]
      attrs[qIdx] = value
      return { ...prev, attributions: attrs }
    })
  }

  const setLayer2Answer = (axis: 'A' | 'B' | 'C', idx: number, value: number) => {
    setLayer2Answers((prev) => {
      const key = `axis${axis}` as 'axisA' | 'axisB' | 'axisC'
      const arr = [...prev[key]]
      arr[idx] = value
      return { ...prev, [key]: arr }
    })
  }

  const currentProgress =
    phase === 'layer1' ? scenarioIndex : scenarios.length

  const scenario = scenarios[scenarioIndex]

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Progress */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>
              {phase === 'layer1'
                ? `シナリオ ${scenarioIndex + 1} / ${scenarios.length}`
                : 'パート2'}
            </span>
            <span>{Math.round((currentProgress / TOTAL_STEPS) * 100)}%</span>
          </div>
          <ProgressBar current={currentProgress} total={TOTAL_STEPS} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div
          className={`transition-all duration-250 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {phase === 'layer1' && (
            <div className="space-y-6">
              {/* Scenario card */}
              <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    シナリオ {scenario.id}
                  </span>
                  <h2 className="text-base font-bold text-gray-900">{scenario.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                  {scenario.description}
                </p>
              </div>

              {/* SJT section */}
              <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-gray-200">
                  あなたならどうしますか？各選択肢を評価してください
                </p>
                <div className="flex justify-between text-xs text-gray-500 px-0.5">
                  <span>← まったくしない</span>
                  <span>必ずする →</span>
                </div>
                {scenario.sjtOptions.map((opt, i) => (
                  <div key={opt.label} className="space-y-2">
                    <p className="text-sm text-gray-300">
                      <span className="font-bold text-blue-400 mr-1.5">{opt.label}.</span>
                      {opt.text}
                    </p>
                    <LikertRow5
                      label={opt.label}
                      value={currentAnswer.sjtRatings[i]}
                      onChange={(v) => setSJTRating(i, v)}
                    />
                  </div>
                ))}
              </div>

              {/* Attribution section */}
              <div className="bg-gray-800 rounded-2xl p-5 space-y-5">
                <p className="text-sm font-semibold text-gray-200">この出来事についての印象を教えてください</p>
                {scenario.attributions.map((attr, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-sm text-gray-300">{attr.question}</p>
                    <LikertRow7
                      leftLabel={attr.leftLabel}
                      rightLabel={attr.rightLabel}
                      value={currentAnswer.attributions[i]}
                      onChange={(v) => setAttribution(i, v)}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextScenario}
                disabled={!isLayer1Complete}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isLayer1Complete
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {scenarioIndex < scenarios.length - 1 ? '次のシナリオへ →' : 'パート1完了 →'}
              </button>
            </div>
          )}

          {phase === 'layer2' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">パート2：自己評価</h2>
                <p className="text-gray-400 text-sm">
                  各文章について、自分にどの程度当てはまるかを評価してください。
                </p>
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                  <span>1 = まったく当てはまらない</span>
                  <span>5 = 非常に当てはまる</span>
                </div>
              </div>

              {layer2Sections.map((section) => (
                <div key={section.axis} className="bg-gray-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-base font-bold text-white border-b border-gray-700 pb-3">
                    {section.title}
                  </h3>
                  {section.questions.map((q, idx) => {
                    const axisKey = `axis${section.axis}` as 'axisA' | 'axisB' | 'axisC'
                    return (
                      <div key={q.id} className="space-y-2">
                        <p className="text-sm text-gray-300">
                          <span className="text-gray-500 mr-1.5 text-xs">{q.id}</span>
                          {q.text}
                          {q.reversed && (
                            <span className="ml-1 text-xs text-gray-500">*</span>
                          )}
                        </p>
                        <LikertRow5
                          label={q.id}
                          value={layer2Answers[axisKey][idx]}
                          onChange={(v) => setLayer2Answer(section.axis, idx, v)}
                        />
                      </div>
                    )
                  })}
                </div>
              ))}

              <button
                onClick={handleSubmitLayer2}
                disabled={!isLayer2Complete}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isLayer2Complete
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                結果を見る →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
