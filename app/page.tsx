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

const PERSONALITY_TYPES_PREVIEW = [
  { name: "突破者型", icon: "⚡", themeFrom: "from-yellow-500/20", themeTo: "to-orange-500/20" },
  { name: "安定遂行型", icon: "🛡️", themeFrom: "from-blue-400/20", themeTo: "to-blue-600/20" },
  { name: "情熱猪突型", icon: "🔥", themeFrom: "from-red-500/20", themeTo: "to-orange-500/20" },
  { name: "楽観持久型", icon: "🌊", themeFrom: "from-cyan-400/20", themeTo: "to-blue-500/20" },
  { name: "戦略挑戦型", icon: "🎯", themeFrom: "from-purple-500/20", themeTo: "to-pink-500/20" },
  { name: "慎重楽観型", icon: "🌤️", themeFrom: "from-amber-300/20", themeTo: "to-yellow-500/20" },
  { name: "直感突撃型", icon: "🚀", themeFrom: "from-rose-500/20", themeTo: "to-red-600/20" },
  { name: "楽天自由型", icon: "🎈", themeFrom: "from-pink-300/20", themeTo: "to-rose-400/20" },
  { name: "堅実努力型", icon: "💎", themeFrom: "from-emerald-500/20", themeTo: "to-teal-600/20" },
  { name: "忍耐守備型", icon: "🏔️", themeFrom: "from-stone-400/20", themeTo: "to-gray-600/20" },
  { name: "闘志内燃型", icon: "🌋", themeFrom: "from-orange-600/20", themeTo: "to-red-700/20" },
  { name: "寡黙継続型", icon: "🐢", themeFrom: "from-green-600/20", themeTo: "to-emerald-800/20" },
  { name: "冷静分析型", icon: "🔬", themeFrom: "from-indigo-400/20", themeTo: "to-violet-600/20" },
  { name: "受容安定型", icon: "🌿", themeFrom: "from-lime-400/20", themeTo: "to-green-500/20" },
  { name: "野心原石型", icon: "💡", themeFrom: "from-amber-500/20", themeTo: "to-orange-600/20" },
  { name: "模索探求型", icon: "🧭", themeFrom: "from-slate-400/20", themeTo: "to-gray-500/20" },
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">

        {/* Hero */}
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500 tracking-widest uppercase">MIRROR</p>
          <h1 className="text-2xl font-bold text-white">メンタルタイプ診断</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            6つの場面を通じて、あなたのメンタルの<span className="text-white">"型"</span>と、力を発揮できる環境がわかります
          </p>
        </div>

        {/* この診断について */}
        <div className="bg-gray-800/40 rounded-2xl p-5 border border-gray-700/40 space-y-2.5 text-sm text-gray-400 leading-relaxed">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">この診断について</p>
          <p>この診断は、あなたが本当に力を発揮できる環境や、隠れた強みを見つけるためのものです。</p>
          <p>「良い回答」や「正解」はありません。感じたままに答えるほど、あなたに合った結果が出ます。</p>
          <p><span className="text-gray-300 font-medium">就活中の方</span>　自分のメンタルの型を知ることは、面接やES作成に直結します。</p>
          <p><span className="text-gray-300 font-medium">インターン・仕事を始める方</span>　「向いている環境」と「消耗する環境」を事前に知ることで、ミスマッチを防げます。</p>
        </div>

        {/* Form card */}
        <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/40 space-y-4">

          {/* Trust badges */}
          <div className="flex justify-center gap-4 text-xs text-gray-500 pb-2">
            <span>📊 7つの学術理論</span>
            <span>⏱️ 所要時間：約10〜15分</span>
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

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">結果はあなた自身のために使われます。</p>
        </div>

      </div>
    </div>
  )
}
