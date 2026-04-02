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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">

        {/* 1. Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide text-white">MIRROR</h1>
          <p className="text-xl text-gray-300 mt-1">メンタルタイプ診断</p>
          <p className="text-sm text-gray-400 mt-3">
            6つの場面を通じて、あなたのメンタルの"型"と、力を発揮できる環境がわかります
          </p>
          <p className="text-xs text-gray-500 mt-1">所要時間：約10〜15分</p>
        </div>

        {/* 2. About card */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/40 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <p className="text-lg font-semibold text-white">この診断について</p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">この診断には正解も不正解もありません。直感で、ありのまま答えてください。</p>
          <p className="text-sm text-gray-300 leading-relaxed">正直に答えるほど、あなたの「本当の強み」「思考のクセ」「合う環境」が正確に見えてきます。良く見せようとするほど、結果はぼやけます。</p>
          <div className="bg-gray-700/30 rounded-lg p-3 border-l-2 border-blue-500">
            <p className="text-blue-400 font-semibold text-sm">📝 就活中の方へ</p>
            <p className="text-gray-300 text-sm mt-1">自己分析が一気に深まります。面接で「自分はこういう人間です」と語れるデータが手に入ります。</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 border-l-2 border-green-500">
            <p className="text-green-400 font-semibold text-sm">💼 インターン・仕事を始める方へ</p>
            <p className="text-gray-300 text-sm mt-1">入ってから「合わなかった」を防げます。自分に合う環境・合わない環境が、始める前に分かります。</p>
          </div>
        </div>

        {/* 3–4. Input fields */}
        <div className="bg-gray-800 rounded-2xl p-8 space-y-6">
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

          {/* 5. Honesty priming */}
          <div>
            <p className="text-sm font-medium text-gray-400 mb-2">回答前の確認</p>
            <p className="text-sm text-gray-300 mb-3">
              この診断で、自分を良く見せようとせず、ありのままの自分で答えようと思いますか？
            </p>
            <div className="space-y-2">
              {[
                { value: 'yes', label: 'はい、ありのままで答えます' },
                { value: 'try', label: 'できるだけそうします' },
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

          {/* 6. Start button */}
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

        {/* 7. Footer note */}
        <p className="text-xs text-gray-500 text-center">結果はあなた自身のために使われます。</p>
      </div>
    </div>
  )
}
