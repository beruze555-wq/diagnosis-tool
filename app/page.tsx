'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReferencesMarquee from '@/components/ReferencesMarquee'

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
  { name: "不屈の実行者", icon: "💪", themeFrom: "from-yellow-500/20", themeTo: "to-orange-500/20" },
  { name: "情熱の突破者", icon: "🔥", themeFrom: "from-red-500/20", themeTo: "to-orange-500/20" },
  { name: "冷静な自信家", icon: "🎯", themeFrom: "from-blue-500/20", themeTo: "to-indigo-500/20" },
  { name: "実力ある不安定型", icon: "⚡", themeFrom: "from-amber-400/20", themeTo: "to-yellow-600/20" },
  { name: "慎重な楽観主義者", icon: "🌤️", themeFrom: "from-cyan-400/20", themeTo: "to-blue-500/20" },
  { name: "直感の挑戦者", icon: "🚀", themeFrom: "from-rose-500/20", themeTo: "to-red-600/20" },
  { name: "潜在力の守備型", icon: "🛡️", themeFrom: "from-stone-400/20", themeTo: "to-gray-600/20" },
  { name: "自信だけが頼り型", icon: "💡", themeFrom: "from-amber-500/20", themeTo: "to-orange-600/20" },
  { name: "堅実な努力家", icon: "💎", themeFrom: "from-emerald-500/20", themeTo: "to-teal-600/20" },
  { name: "努力する繊細型", icon: "🌸", themeFrom: "from-pink-400/20", themeTo: "to-rose-500/20" },
  { name: "安定した慎重派", icon: "🏔️", themeFrom: "from-slate-400/20", themeTo: "to-gray-500/20" },
  { name: "孤軍奮闘型", icon: "🌋", themeFrom: "from-orange-600/20", themeTo: "to-red-700/20" },
  { name: "楽観的な安定型", icon: "🌊", themeFrom: "from-cyan-400/20", themeTo: "to-blue-400/20" },
  { name: "楽観的だが不安定型", icon: "🌿", themeFrom: "from-lime-400/20", themeTo: "to-green-500/20" },
  { name: "静かな耐久型", icon: "🐢", themeFrom: "from-green-600/20", themeTo: "to-emerald-800/20" },
  { name: "発展途上型", icon: "🧭", themeFrom: "from-slate-400/20", themeTo: "to-gray-500/20" },
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

    // 前回セッションの診断データをクリアしてから開始
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('scenarioAnswers')
    sessionStorage.removeItem('layer2Answers')
    sessionStorage.removeItem('layer2Skipped')
    sessionStorage.removeItem('diagnosisPhase')
    sessionStorage.removeItem('attributionAnswers')
    sessionStorage.setItem('userInfo', JSON.stringify({ age: ageNum, affiliation }))
    router.push(isDev ? '/diagnosis?dev=true' : '/diagnosis')
  }

  const handleMoritaData = () => {
    sessionStorage.removeItem('devMode')
    sessionStorage.removeItem('devScores')
    sessionStorage.removeItem('layer2Skipped')
    sessionStorage.removeItem('diagnosisPhase')
    sessionStorage.setItem('userInfo', JSON.stringify({ age: 21, affiliation: '大学3〜4年生' }))
    sessionStorage.setItem('scenarioAnswers', JSON.stringify([
      // 旧実データの帰属値（悲観的傾向あり）→ OS低め
      { scenarioId: 1, attributions: [7, 7, 7] },
      { scenarioId: 2, attributions: [7, 3, 5] },
      { scenarioId: 3, attributions: [4, 7, 7] },
      { scenarioId: 4, attributions: [7, 6, 1] },
      { scenarioId: 5, attributions: [6, 7, 6] },
      { scenarioId: 6, attributions: [7, 7, 7] },
    ]))
    sessionStorage.setItem('layer2Answers', JSON.stringify([
      // SE(8): 旧データに未存在のため維持
      4, 5, 5, 4, 4, 4, 4, 5,
      // PE(5): 旧A2,A4,A6,A7,A9
      5, 5, 4, 5, 5,
      // CI(5): 旧A1,A3,A5,A8,A10
      4, 5, 4, 5, 4,
      // ES(10): 旧B1-B10
      1, 5, 1, 4, 4, 5, 1, 5, 2, 4,
      // AM(6): 旧D1-D6
      5, 5, 3, 1, 5, 2,
    ]))
    router.push('/result')
  }

  const handleDevSkip = () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ age: 0, affiliation: 'dev' }))
    sessionStorage.setItem('scenarioAnswers', JSON.stringify([]))
    sessionStorage.setItem('devMode', 'true')
    sessionStorage.setItem(
      'devScores',
      JSON.stringify({ OS: 72, SE: 68, PE: 55, ES: 81 })
    )
    sessionStorage.setItem(
      'layer2Answers',
      JSON.stringify(Array(34).fill(3))
    )
    router.push('/result')
  }

  return (
    <div className="min-h-screen bg-gray-900">

      {/* セクション1: ヒーロー */}
      <section className="text-center pt-12 pb-4">
        <p className="text-sm tracking-widest text-gray-500 uppercase mb-2">MIRROR</p>
        <h1 className="text-3xl font-bold mb-3">メンタルタイプ診断</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
          6つの場面を通じて、あなたのメンタルの&quot;型&quot;と、<br/>力を発揮できる環境がわかります
        </p>
        <p className="text-gray-600 text-xs mt-2">所要時間：約10〜15分</p>
      </section>

      {/* セクション2: この診断について */}
      <section className="max-w-lg mx-auto px-4 pb-6">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">この診断について</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            この診断は、あなたが本当に力を発揮できる環境や、隠れた強みを見つけるためのものです。
          </p>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            「良い回答」や「正解」はありません。感じたままに答えるほど、あなたに合った結果が出ます。
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-medium">就活中の方へ</span>　自分のメンタルの型を知ることは、面接やES作成に直結します。
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-medium">インターン・仕事を始める方へ</span>　「向いている環境」と「消耗する環境」を事前に知ることで、ミスマッチを防げます。
            </p>
          </div>
        </div>
      </section>

      {/* セクション3: フォームカード */}
      <section className="max-w-lg mx-auto px-4 pb-6">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">

          {/* 年齢 */}
          <label className="block text-sm text-gray-400 mb-1">年齢</label>
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

          {/* 所属 */}
          <label className="block text-sm text-gray-400 mb-1 mt-4">所属</label>
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

          {/* プライミング */}
          <p className="text-sm text-gray-400 mt-4 mb-2">ありのままの自分で答えられそうですか？</p>
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

          {/* 診断開始ボタン */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full font-semibold py-4 rounded-xl transition-colors duration-200 text-lg mt-4 ${
              canStart
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                : 'bg-blue-600 text-white opacity-50 cursor-not-allowed'
            }`}
          >
            診断を始める →
          </button>
        </div>
      </section>

      {/* セクション4: フッター */}
      <p className="text-center text-xs text-gray-600 mt-2 mb-3">結果はあなた自身のために使われます。</p>

      {/* 参考文献マーキー */}
      <ReferencesMarquee />
      <div className="text-center mb-8">
        <a href="/about" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          この診断の学術的背景について →
        </a>
      </div>

      {/* セクション5: 開発モード（URLクエリ ?dev=true が必要） */}
      {isDev && (
        <div className="max-w-lg mx-auto px-4 pb-4">
          <button
            onClick={handleDevSkip}
            className="w-full bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 text-orange-400 font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
          >
            🛠 開発モード：結果画面にスキップ
          </button>
        </div>
      )}

      {/* セクション6: 森田データ自動入力（?dev=true のとき表示） */}
      {isDev && (
        <div className="max-w-lg mx-auto px-4 pb-8">
          <button
            onClick={handleMoritaData}
            className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/50 text-emerald-400 font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
          >
            🔧 DEV: 自動入力で結果へ
          </button>
        </div>
      )}

    </div>
  )
}
