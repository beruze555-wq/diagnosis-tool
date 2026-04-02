'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AFFILIATION_OPTIONS = [
  '大学1〜2年生',
  '大学3〜4年生',
  '大学院生',
  '長期インターン中',
  '就活中',
  '第二新卒（社会人1〜2年目）',
  '社会人3年目以上',
  'その他',
]

export default function StartPage() {
  const router = useRouter()
  const [age, setAge] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [honesty, setHonesty] = useState<string | null>(null)
  const [errors, setErrors] = useState({ age: '', affiliation: '' })
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(new URLSearchParams(window.location.search).get('dev') === 'true')
  }, [])

  const canStart = !!age && !!affiliation && !!honesty

  const handleStart = () => {
    const newErrors = { age: '', affiliation: '' }
    const ageNum = parseInt(age)
    if (!age || isNaN(ageNum) || ageNum < 15 || ageNum > 80) {
      newErrors.age = '15〜80の範囲で入力してください'
    }
    if (!affiliation) {
      newErrors.affiliation = '所属を選択してください'
    }
    setErrors(newErrors)
    if (newErrors.age || newErrors.affiliation) return

    sessionStorage.setItem('userInfo', JSON.stringify({ age: ageNum, affiliation }))
    router.push('/diagnosis')
  }

  const handleDevSkip = () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ age: 0, affiliation: 'dev' }))
    sessionStorage.setItem('scenarioAnswers', JSON.stringify([]))
    sessionStorage.setItem('devMode', 'true')
    sessionStorage.setItem(
      'devScores',
      JSON.stringify({ OS: 72, A: 68, B: 55, C: 81, zone: 'Yellow' })
    )
    sessionStorage.setItem(
      'layer2Answers',
      JSON.stringify({
        axisA: [2, 4, 2, 4, 2, 4, 4, 2, 4, 2],
        axisB: [3, 4, 3, 3, 4, 4, 3, 4, 3, 4],
        axisC: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2],
        axisD: [4, 4, 4, 2, 4, 2],
      })
    )
    router.push('/result')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">

        {/* Hero */}
        <div className="text-center space-y-4">
          <p className="text-xs text-gray-500 tracking-widest uppercase">MIRROR</p>
          <h1 className="text-3xl font-bold text-white">メンタルタイプ診断</h1>
          {/* 感情フック */}
          <div className="space-y-2">
            <p className="text-base text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">"自分のことは自分が一番分かっている"</span><br />
              ——本当にそうですか？
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              6つの場面への反応から、あなた自身も気づいていない<br />
              <span className="text-white">メンタルの"型"</span>・<span className="text-white">隠れた強み</span>・<span className="text-white">力を発揮できる環境</span>が見えてきます。
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/40 max-w-md mx-auto w-full space-y-4">

          {/* Trust badges */}
          <div className="flex justify-center gap-4 text-xs text-gray-500 pb-2">
            <span>📊 7つの学術理論</span>
            <span>⏱️ 約10分</span>
            <span>🔬 42問</span>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">年齢</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canStart && handleStart()}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="例：23"
              min={15}
              max={80}
            />
            {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
          </div>

          {/* Affiliation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">所属</label>
            <select
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>選択してください</option>
              {AFFILIATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.affiliation && <p className="text-red-400 text-xs mt-1">{errors.affiliation}</p>}
          </div>

          {/* Honesty priming */}
          <div>
            <p className="text-sm text-gray-300 mb-3">ありのままの自分で答えられそうですか？</p>
            <div className="space-y-2">
              {[
                { value: 'yes', label: 'はい、素直に答えます' },
                { value: 'try', label: 'たぶん大丈夫です' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setHonesty(value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors duration-150 ${
                    honesty === value
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full font-semibold py-4 rounded-xl transition-colors duration-200 text-lg ${
              canStart
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                : 'bg-blue-600 text-white opacity-50 cursor-not-allowed'
            }`}
          >
            診断を始める →
          </button>

          {isDev && (
            <button
              onClick={handleDevSkip}
              className="w-full bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 text-orange-400 font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
            >
              🛠 開発モード：結果画面にスキップ
            </button>
          )}
        </div>

        {/* Benefit rows */}
        <div className="max-w-md mx-auto w-full space-y-2 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <span>📝</span>
            <div>
              <span className="text-gray-300 font-medium">就活中の方</span>
              <span className="ml-2">— 面接で語れる"自分の特性データ"が手に入ります</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span>💼</span>
            <div>
              <span className="text-gray-300 font-medium">仕事を始める方</span>
              <span className="ml-2">— 自分に合う環境・合わない環境が事前に分かります</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">結果はあなた自身のために使われます。</p>
        </div>

      </div>
    </div>
  )
}
