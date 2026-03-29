'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StartPage() {
  const router = useRouter()
  const [age, setAge] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [errors, setErrors] = useState({ age: '', affiliation: '' })

  const handleStart = () => {
    const newErrors = { age: '', affiliation: '' }
    const ageNum = parseInt(age)
    if (!age || isNaN(ageNum) || ageNum < 15 || ageNum > 80) {
      newErrors.age = '15〜80の範囲で入力してください'
    }
    if (!affiliation.trim()) {
      newErrors.affiliation = '所属を入力してください'
    }
    setErrors(newErrors)
    if (newErrors.age || newErrors.affiliation) return

    sessionStorage.setItem('userInfo', JSON.stringify({ age: ageNum, affiliation: affiliation.trim() }))
    router.push('/diagnosis')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">採用心理診断</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            6つの実際の場面への反応から、あなたの思考パターンを分析します。<br />
            所要時間：約15〜20分
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">年齢</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="例：23"
              min={15}
              max={80}
            />
            {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              所属（大学名・学部、または会社名・部署）
            </label>
            <input
              type="text"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="例：〇〇大学 経済学部"
            />
            {errors.affiliation && <p className="text-red-400 text-xs mt-1">{errors.affiliation}</p>}
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 rounded-xl transition-colors duration-200 text-lg"
          >
            診断を始める →
          </button>
        </div>

        <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
          <p className="text-gray-400 text-xs text-center leading-relaxed">
            回答内容は採用評価の参考として使用されます。<br />
            正直にお答えいただくことで、より正確な結果が得られます。
          </p>
        </div>
      </div>
    </div>
  )
}
