'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { scenarios } from '@/lib/scenarios'
import { layer2Questions } from '@/lib/layer2Questions'

import { ScenarioAnswer } from '@/types'

const QUESTIONS_PER_PAGE = 6
const TOTAL_LAYER2_QUESTIONS = 34
const TOTAL_LAYER2_PAGES = Math.ceil(TOTAL_LAYER2_QUESTIONS / QUESTIONS_PER_PAGE) // 6
const TOTAL_STEPS = scenarios.length + TOTAL_LAYER2_PAGES // 12

function findFirstIncompletePage(answers: number[]): number {
  for (let page = 0; page < TOTAL_LAYER2_PAGES; page++) {
    const start = page * QUESTIONS_PER_PAGE
    const end = Math.min(start + QUESTIONS_PER_PAGE, TOTAL_LAYER2_QUESTIONS)
    for (let i = start; i < end; i++) {
      if ((answers[i] ?? 0) === 0) return page
    }
  }
  return TOTAL_LAYER2_PAGES - 1
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

export default function DiagnosisPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'layer1' | 'layer2'>('layer1')
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [scenarioAnswers, setScenarioAnswers] = useState<ScenarioAnswer[]>([])
  const [currentAnswer, setCurrentAnswer] = useState<ScenarioAnswer>({
    scenarioId: 1,
    attributions: [0, 0, 0],
  })
  const [layer2Answers, setLayer2Answers] = useState<number[]>(Array(TOTAL_LAYER2_QUESTIONS).fill(0))
  const [layer2Page, setLayer2Page] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isDev, setIsDev] = useState(false)

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
      const parsedL2 = JSON.parse(savedLayer2Answers)
      // Handle flat number[] format only
      if (Array.isArray(parsedL2) && typeof parsedL2[0] === 'number') {
        const firstPage = findFirstIncompletePage(parsedL2)
        setScenarioAnswers(JSON.parse(savedScenarioAnswers))
        setLayer2Answers(parsedL2)
        setLayer2Page(firstPage)
        setPhase('layer2')
      }
    } else if (savedScenarioAnswers) {
      const restored: ScenarioAnswer[] = JSON.parse(savedScenarioAnswers)
      if (restored.length === scenarios.length && savedPhase !== 'layer1') {
        setScenarioAnswers(restored)
        setPhase('layer2')
      } else if (restored.length > 0 && restored.length < scenarios.length) {
        setScenarioAnswers(restored)
        setScenarioIndex(restored.length)
        setCurrentAnswer({ scenarioId: restored.length + 1, attributions: [0, 0, 0] })
      }
    }
  }, [router])

  const isCurrentScenarioComplete = currentAnswer.attributions.every((v) => v > 0)

  // Current page questions
  const currentPageStartIdx = layer2Page * QUESTIONS_PER_PAGE
  const currentPageQuestions = useMemo(
    () => layer2Questions.slice(
      currentPageStartIdx,
      Math.min(currentPageStartIdx + QUESTIONS_PER_PAGE, TOTAL_LAYER2_QUESTIONS)
    ),
    [currentPageStartIdx]
  )

  const isCurrentPageComplete = currentPageQuestions.every(
    (_, i) => (layer2Answers[currentPageStartIdx + i] ?? 0) > 0
  )

  const isLayer2Complete = layer2Answers.every((v) => v > 0)

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
      } else {
        // layer2 最初のページ → layer1 最後のシナリオに戻る
        const prevAnswers = scenarioAnswers.slice(0, -1)
        const prevAnswer = scenarioAnswers[scenarioAnswers.length - 1]
        transition(() => {
          setCurrentAnswer(prevAnswer)
          setScenarioAnswers(prevAnswers)
          setScenarioIndex(scenarios.length - 1)
          setPhase('layer1')
        })
      }
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
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      sessionStorage.setItem('diagnosisPhase', 'layer1')
      transition(() => {
        setScenarioAnswers(newAnswers)
        setScenarioIndex((i) => i + 1)
        setCurrentAnswer({ scenarioId: scenarioIndex + 2, attributions: [0, 0, 0] })
      })
    } else {
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      sessionStorage.removeItem('layer2Skipped')
      sessionStorage.setItem('diagnosisPhase', 'layer2')
      transition(() => {
        setScenarioAnswers(newAnswers)
        setPhase('layer2')
      })
    }
  }

  const handleLayer2Next = () => {
    if (!isCurrentPageComplete) return
    if (layer2Page < TOTAL_LAYER2_PAGES - 1) {
      transition(() => setLayer2Page((p) => p + 1))
    } else {
      if (!isLayer2Complete) return
      sessionStorage.removeItem('layer2Skipped')
      sessionStorage.removeItem('diagnosisPhase')
      sessionStorage.setItem('layer2Answers', JSON.stringify(layer2Answers))
      router.push('/result')
    }
  }

  const setAttribution = (qIdx: number, value: number) => {
    setCurrentAnswer((prev) => {
      const attrs = [...prev.attributions]
      attrs[qIdx] = value
      return { ...prev, attributions: attrs }
    })
  }

  const setLayer2Answer = (globalIdx: number, value: number) => {
    setLayer2Answers((prev) => {
      const next = [...prev]
      next[globalIdx] = value
      sessionStorage.setItem('layer2Answers', JSON.stringify(next))
      sessionStorage.setItem('diagnosisPhase', 'layer2')
      return next
    })
  }

  // DEV ONLY: skip current scenario page
  const handleDevSkipLayer1 = () => {
    const filledAnswer: ScenarioAnswer = {
      scenarioId: scenarioIndex + 1,
      attributions: currentAnswer.attributions.map((v) => (v === 0 ? 4 : v)),
    }
    const newAnswers = [...scenarioAnswers, filledAnswer]

    if (scenarioIndex < scenarios.length - 1) {
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      sessionStorage.setItem('diagnosisPhase', 'layer1')
      transition(() => {
        setScenarioAnswers(newAnswers)
        setScenarioIndex((i) => i + 1)
        setCurrentAnswer({ scenarioId: scenarioIndex + 2, attributions: [0, 0, 0] })
      })
    } else {
      sessionStorage.setItem('scenarioAnswers', JSON.stringify(newAnswers))
      sessionStorage.removeItem('layer2Skipped')
      sessionStorage.setItem('diagnosisPhase', 'layer2')
      transition(() => {
        setScenarioAnswers(newAnswers)
        setPhase('layer2')
      })
    }
  }

  // DEV ONLY: skip current layer2 page
  const handleDevSkipLayer2 = () => {
    const filled = layer2Answers.map((v) => (v === 0 ? 3 : v))
    setLayer2Answers(filled)
    sessionStorage.setItem('layer2Answers', JSON.stringify(filled))
    if (layer2Page < TOTAL_LAYER2_PAGES - 1) {
      transition(() => setLayer2Page((p) => p + 1))
    } else {
      sessionStorage.removeItem('layer2Skipped')
      sessionStorage.removeItem('diagnosisPhase')
      router.push('/result')
    }
  }

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
                : `パート2  ${layer2Page + 1} / ${TOTAL_LAYER2_PAGES} ページ`}
            </span>
            <span>{Math.round((currentProgress / TOTAL_STEPS) * 100)}%</span>
          </div>
          <ProgressBar current={currentProgress} total={TOTAL_STEPS} />
          <button
            onClick={handleBack}
            disabled={phase === 'layer1' && scenarioIndex === 0}
            className="mt-2 text-xs text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← 前の質問に戻る
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div
          className={`transition-all duration-250 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* PART1 — 1シナリオ1ページ（帰属3問） */}
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

              {/* 帰属3問 */}
              <div className="bg-gray-800 rounded-2xl p-5 space-y-5">
                <p className="text-sm text-gray-400">この出来事が起きた原因を1つ思い浮かべてください。</p>
                {scenario.attributions.map((attr, qIdx) => (
                  <div key={qIdx} className="space-y-2">
                    <p className="text-sm text-gray-300">{attr.question}</p>
                    <LikertRow7
                      leftLabel={attr.leftLabel}
                      rightLabel={attr.rightLabel}
                      value={currentAnswer.attributions[qIdx]}
                      onChange={(v) => setAttribution(qIdx, v)}
                    />
                  </div>
                ))}
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

          {/* DEV ONLY: fixed skip button */}
          {isDev && (
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
                <p className="text-xs text-gray-600 mt-1">{layer2Page + 1} / {TOTAL_LAYER2_PAGES} ページ</p>
              </div>

              <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
                {currentPageQuestions.map((q, displayIdx) => {
                  const globalIdx = currentPageStartIdx + displayIdx
                  return (
                    <div key={q.id} className="space-y-2">
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-600 mr-1.5 text-xs">{globalIdx + 1}.</span>
                        {q.text}
                      </p>
                      <LikertRow5
                        label={q.id}
                        value={layer2Answers[globalIdx] ?? 0}
                        onChange={(v) => setLayer2Answer(globalIdx, v)}
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
                {layer2Page < TOTAL_LAYER2_PAGES - 1 ? '次へ →' : '結果を見る →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
