import { createClient } from '@supabase/supabase-js'
import { ScenarioAnswer } from '@/types'
import { DeepAnalysis } from '@/lib/scoring'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// 実テーブルのカラム構成に合わせた型
export async function saveDiagnosisResult(data: {
  age: number
  affiliation: string
  scenarioAnswers: ScenarioAnswer[]
  layer2Answers?: number[]
  osScore: number
  seScore: number
  peScore: number
  esScore: number
  typeCode: string        // zone_id (例: HLLH)
  zoneName: string        // zone  (例: 安定者ゾーン)
  personalityTypeName: string // personality_type (例: 潜在力の守備型)
  deepAnalysis?: DeepAnalysis
  adversityRiskNote?: string
}) {
  const commitSustainability = (data.osScore + data.esScore) / 2

  const payload = {
    age: data.age,
    affiliation: data.affiliation,
    layer1_answers: data.scenarioAnswers,
    layer2_answers: data.layer2Answers ?? null,
    os_score: data.osScore,
    axis_a_score: data.seScore,   // SE
    axis_b_score: data.peScore,   // PE
    axis_c_score: data.esScore,   // ES
    zone: data.zoneName,
    zone_id: data.typeCode,
    personality_type: data.personalityTypeName,
    deep_analysis: data.deepAnalysis ?? null,
    hardwork_resilience: (data.seScore + data.peScore) / 2,
    commit_sustainability: commitSustainability,
    adversity_risk: 100 - commitSustainability,
    adversity_risk_note: data.adversityRiskNote ?? null,
  }

  const res = await fetch('/api/save-diagnosis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const message = errBody.error ?? `HTTP ${res.status}`
    console.error('[saveDiagnosisResult] error:', errBody)
    throw new Error(message)
  }
}
