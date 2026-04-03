'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { scenarios } from '@/lib/scenarios'
import { layer2Sections } from '@/lib/layer2Questions'
import { calculateOS } from '@/lib/scoring'
import { ScenarioAnswer, Layer2Answers } from '@/types'

const TOTAL_STEPS = 12 // 6 scenarios + 6 layer2 pages

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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
  leftLabel,
  rightLabel,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  leftLabel?: string
  rightLabel?: string
}) {
  return (
    <div>
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
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-gray-500 px-0.5 mt-1">
          {leftLabel && <span>← {leftLabel}</span>}
          {rightLabel && <span>{rightLabel} →</span>}
        </div>
      )}
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

// Per-scenario 7-item shuffle type (4 SJT + 3 attribution)
type ShuffledItem =
  | { type: 'sjt'; originalIdx: number }
  | { type: 'attribution'; qIdx: number }

// Flat layer2 question item with axis + position index
interface FlatL2Item {
  axis: 'A' | 'B' | 'C' | 'D'
  idx: number
  id: string
  text: string
  reversed: boolean
}

// Find the first page (0-5) in the given order that has unanswered questions
function findFirstIncompletePage(items: FlatL2Item[], answers: Layer2Answers): number {
  for (let page = 0; page < 6; page++) {
    const pageItems = items.slice(page * 6, (page + 1) * 6)
    const complete = pageItems.every(
      (item) => answers[`axis${item.axis}` as keyof Layer2Answers][item.idx] > 0
    )
    if (!complete) return page
  }
  return 5
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
    axisD: Array(6).fill(0),
  })
  const [layer2Page, setLayer2Page] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isDev, setIsDev] = useState(false)

  // Per-scenario: 7 items (4 SJT + 3 attribution) in random order, fixed at mount
  const [shuffledItems7] = useState<ShuffledItem[][]>(() =>
    scenarios.map(() => {
      const items: ShuffledItem[] = [
        { type: 'sjt', originalIdx: 0 },
        { type: 'sjt', originalIdx: 1 },
        { type: 'sjt', originalIdx: 2 },
        { type: 'sjt', originalIdx: 3 },
        { type: 'attribution', qIdx: 0 },
        { type: 'attribution', qIdx: 1 },
        { type: 'attribution', qIdx: 2 },
      ]
      return shuffleArray(items)
    })
  )

  // One-time randomized flat Layer2 question list (all 4 sections, 36 items total)
  const [randomizedLayer2] = useState<FlatL2Item[]>(() => {
    const all: FlatL2Item[] = layer2Sections.flatMap((s) =>
      s.questions.map((q, idx) => ({
        axis: s.axis as 'A' | 'B' | 'C' | 'D',
        idx,
        id: q.id,
        text: q.text,
        reversed: q.reversed,
      }))
    )
    return shuffleArray(all)
  })

  // Initialize: redirect if no userInfo, otherwise restore any saved progress
  useEffect(() => {
    if (!sessionStorage.getItem('userInfo')) {
      router.replace('/')
      return
    }

    const savedScenarioAnswers = sessionStorage.getItem('scenarioAnswers')
    const savedLayer2Answers = sessionStorage.getItem('layer2Answers')
    setIsDev(new URLSearchParams(window.location.search).get('dev') === 'true')

    const savedPhase = sessionStorage.getItem('diagnosisPhase')

    if (savedScenarioAnswers && savedLayer2Answers) {
      // PART2 途中 or PART2開始直後 — answers by axis/idx so order-independent
      const restoredL2 = JSON.parse(savedLayer2Answers) as Layer2Answers
      const firstPage = findFirstIncompletePage(randomizedLayer2, restoredL2)
      setScenarioAnswers(JSON.parse(savedScenarioAnswers))
      setLayer2Answers(restoredL2)
      setLayer2Page(firstPage)
      setPhase('layer2')
    } else if (savedScenarioAnswers) {
      const restored: ScenarioAnswer[] = JSON.parse(savedScenarioAnswers)
      if (restored.length === scenarios.length && savedPhase !== 'layer1') {
        // PART1完了済み・PART2未着手
        setScenarioAnswers(restored)
        setPhase('layer2')
      } else if (restored.length > 0 && restored.length < scenarios.length) {
        // PART1 途中
        setScenarioAnswers(restored)
        setScenarioIndex(restored.length)
      }
    }
  }, [router, randomizedLayer2])

  const isCurrentScenarioComplete =
    currentAnswer.sjtRatings.every((v) => v > 0) &&
    currentAnswer.attributions.every((v) => v > 0)

  const isLayer2Complete =
    layer2Answers.axisA.every((v) => v > 0) &&
    layer2Answers.axisB.every((v) => v > 0) &&
    layer2Answers.axisC.every((v) => v > 0) &&
    layer2Answers.axisD.every((v) => v > 0)

  // Current page items (6 per page)
  const currentPageItems = useMemo(
    () => randomizedLayer2.slice(layer2Page * 6, (layer2Page + 1) * 6),
    [randomizedLayer2, layer2Page]
  )

  const isCurrentPageComplete = currentPageItems.every((item) => {
    const key = `axis${item.axis}` as keyof Layer2Answers
    return layer2Answers[key][item.idx] > 0
  })

  const transition = useCallback((cb: () => void) => {
    setVisible(false)
    setTimeout(() => {
      cb()
      window.scrollTo(0, 0)
      setVisible(true)
    }, 250)
  }, [])

  const handleBack = () => {
    if (phase === 'layer2') {
      if (layer2Page > 0) {
        transition(() => setLayer2Page((p) => p - 1))
      }
      // layer2Page === 0: PART1には戻れない
    } else if (scenarioIndex > 0) {
      const prevAnswer = scenarioAnswers[scenarioIndex - 1]
      const prevAnswers = scenarioAnswers.slice(0, -1)
      transition(() => {
        setCurrentAnswer(prevAnswer)
        setScenarioAnswers(prevAnswers)
        setScenarioIndex((i) => i - 1)
      })
    }
  }

  const handleNext = () => {
    if (!isCurrentScenarioComplete) return
    const newAnswers = [...scenarioAnswers, currentAnswer]

    if (scenarioIndex < scenarios.length - 1) {
      // Save partial PART1 progress for resume
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      sessionStorage.setItem('diagnosisPhase', 'layer1')
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
        sessionStorage.removeItem('diagnosisPhase')
        router.push('/result')
      } else {
        sessionStorage.removeItem('layer2Skipped')
        sessionStorage.setItem('diagnosisPhase', 'layer2')
        transition(() => {
          setScenarioAnswers(newAnswers)
          setPhase('layer2')
        })
      }
    }
  }

  const handleLayer2Next = () => {
    if (!isCurrentPageComplete) return
    if (layer2Page < 5) {
      transition(() => {
        setLayer2Page((p) => p + 1)
      })
    } else {
      // All 6 pages done
      if (!isLayer2Complete) return
      sessionStorage.removeItem('layer2Skipped')
      sessionStorage.removeItem('diagnosisPhase')
      sessionStorage.setItem('layer2Answers', JSON.stringify(layer2Answers))
      router.push('/result')
    }
  }

  // Store rating at the original option index (not display index)
  const setSJTRating = (originalIdx: number, value: number) => {
    setCurrentAnswer((prev) => {
      const ratings = [...prev.sjtRatings]
      ratings[originalIdx] = value
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

  const setLayer2Answer = (axis: 'A' | 'B' | 'C' | 'D', idx: number, value: number) => {
    setLayer2Answers((prev) => {
      const key = `axis${axis}` as keyof Layer2Answers
      const arr = [...prev[key]]
      arr[idx] = value
      const next = { ...prev, [key]: arr }
      // Save partial PART2 progress for resume
      sessionStorage.setItem('layer2Answers', JSON.stringify(next))
      sessionStorage.setItem('diagnosisPhase', 'layer2')
      return next
    })
  }

  // DEV ONLY: skip current scenario page (fill blanks with defaults and advance)
  const handleDevSkipLayer1 = () => {
    const filledAnswer: ScenarioAnswer = {
      sjtRatings: currentAnswer.sjtRatings.map((v) => (v === 0 ? 3 : v)),
      attributions: currentAnswer.attributions.map((v) => (v === 0 ? 4 : v)),
    }
    const newAnswers = [...scenarioAnswers, filledAnswer]

    if (scenarioIndex < scenarios.length - 1) {
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      sessionStorage.setItem('diagnosisPhase', 'layer1')
      transition(() => {
        setScenarioAnswers(newAnswers)
        setScenarioIndex((i) => i + 1)
        setCurrentAnswer({ sjtRatings: [0, 0, 0, 0], attributions: [0, 0, 0] })
      })
    } else {
      const OS = calculateOS(newAnswers)
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      if (OS < 35) {
        sessionStorage.setItem('layer2Skipped', 'true')
        sessionStorage.removeItem('diagnosisPhase')
        router.push('/result')
      } else {
        sessionStorage.removeItem('layer2Skipped')
        sessionStorage.setItem('diagnosisPhase', 'layer2')
        transition(() => {
          setScenarioAnswers(newAnswers)
          setPhase('layer2')
        })
      }
    }
  }

  // DEV ONLY: skip current layer2 page (fill all unset items with 3 and advance)
  const handleDevSkipLayer2 = () => {
    const filled: Layer2Answers = {
      axisA: layer2Answers.axisA.map((v) => (v === 0 ? 3 : v)),
      axisB: layer2Answers.axisB.map((v) => (v === 0 ? 3 : v)),
      axisC: layer2Answers.axisC.map((v) => (v === 0 ? 3 : v)),
      axisD: layer2Answers.axisD.map((v) => (v === 0 ? 3 : v)),
    }
    setLayer2Answers(filled)
    sessionStorage.setItem('layer2Answers', JSON.stringify(filled))
    if (layer2Page < 5) {
      transition(() => setLayer2Page((p) => p + 1))
    } else {
      sessionStorage.removeItem('layer2Skipped')
      sessionStorage.removeItem('diagnosisPhase')
      router.push('/result')
    }
  }

  // Progress: 1 unit per page (scenario pages + layer2 pages = 12 total)
  const currentProgress =
    phase === 'layer1' ? scenarioIndex + 1 : scenarios.length + layer2Page + 1

  const scenario = scenarios[scenarioIndex]

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Progress */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-4">
            <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">MIRROR</span>
            <div className="h-px w-12 mx-auto mt-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>
              {phase === 'layer1'
                ? `シナリオ ${scenarioIndex + 1} / ${scenarios.length}`
                : `パート2  ${layer2Page + 1} / 6 ページ`}
            </span>
            <span>{Math.round((currentProgress / TOTAL_STEPS) * 100)}%</span>
          </div>
          <ProgressBar current={currentProgress} total={TOTAL_STEPS} />
          {isDev && (
            <button
              onClick={handleBack}
              disabled={
                (phase === 'layer1' && scenarioIndex === 0) ||
                (phase === 'layer2' && layer2Page === 0)
              }
              className="mt-2 text-xs text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← 前のページに戻る
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div
          className={`transition-all duration-250 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* PART1 — 1シナリオ1ページ（SJT4択＋帰属3問を7項目シャッフル表示） */}
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

              {/* 7 shuffled items: 4 SJT (1-5) + 3 attribution (1-7) */}
              <div className="bg-gray-800 rounded-2xl p-5 space-y-5">
                <p className="text-sm font-semibold text-gray-200">
                  この状況についての質問です。直感で答えてください。
                </p>
                {shuffledItems7[scenarioIndex].map((item) => {
                  if (item.type === 'sjt') {
                    const opt = scenario.sjtOptions[item.originalIdx]
                    return (
                      <div key={`sjt-${item.originalIdx}`} className="space-y-2">
                        <p className="text-sm text-gray-300">{opt.text}</p>
                        <LikertRow5
                          label={opt.label}
                          value={currentAnswer.sjtRatings[item.originalIdx]}
                          onChange={(v) => setSJTRating(item.originalIdx, v)}
                          leftLabel="まったくしない"
                          rightLabel="必ずする"
                        />
                      </div>
                    )
                  } else {
                    const attr = scenario.attributions[item.qIdx]
                    return (
                      <div key={`attr-${item.qIdx}`} className="space-y-2">
                        <p className="text-sm text-gray-300">{attr.question}</p>
                        <LikertRow7
                          leftLabel={attr.leftLabel}
                          rightLabel={attr.rightLabel}
                          value={currentAnswer.attributions[item.qIdx]}
                          onChange={(v) => setAttribution(item.qIdx, v)}
                        />
                      </div>
                    )
                  }
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={!isCurrentScenarioComplete}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isCurrentScenarioComplete
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {scenarioIndex < scenarios.length - 1 ? '次のシナリオへ →' : 'パート1完了 →'}
              </button>
            </div>
          )}

          {/* DEV ONLY: fixed skip button — removed at production build */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={phase === 'layer1' ? handleDevSkipLayer1 : handleDevSkipLayer2}
              className="fixed bottom-6 right-4 z-50 bg-gray-900/80 hover:bg-gray-800/90 border border-gray-600/60 text-gray-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-lg backdrop-blur transition-colors duration-150 shadow-lg"
            >
              ⏭ DEV SKIP
            </button>
          )}

          {phase === 'layer2' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">パート2：あなた自身について</h2>
                <p className="text-gray-400 text-sm">
                  各文章について、自分にどの程度当てはまるかを評価してください
                </p>
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                  <span>1 = まったく当てはまらない</span>
                  <span>5 = 非常に当てはまる</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{layer2Page + 1} / 6 ページ</p>
              </div>

              {/* Current page questions (6 per page) */}
              <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
                {currentPageItems.map((item, displayIdx) => {
                  const key = `axis${item.axis}` as keyof Layer2Answers
                  return (
                    <div key={item.id} className="space-y-2">
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-600 mr-1.5 text-xs">{layer2Page * 6 + displayIdx + 1}.</span>
                        {item.text}
                      </p>
                      <LikertRow5
                        label={item.id}
                        value={layer2Answers[key][item.idx]}
                        onChange={(v) => setLayer2Answer(item.axis, item.idx, v)}
                      />
                    </div>
                  )
                })}
              </div>

              <button
                onClick={handleLayer2Next}
                disabled={!isCurrentPageComplete}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isCurrentPageComplete
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {layer2Page < 5 ? '次へ →' : '結果を見る →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
