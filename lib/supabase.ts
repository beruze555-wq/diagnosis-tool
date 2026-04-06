import { createClient } from '@supabase/supabase-js'
import { ScenarioAnswer } from '@/types'
import { DeepAnalysis, RiskIndicators } from '@/lib/scoring'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function saveDiagnosisResult(data: {
  age: number
  affiliation: string
  scenarioAnswers: ScenarioAnswer[]
  layer2Answers?: number[]
  osScore: number
  seScore: number
  peScore: number
  esScore: number
  ciScore?: number
  amScore?: number
  typeCode: string
  deepAnalysis?: DeepAnalysis
  riskIndicators?: RiskIndicators
}) {
  if (!supabase) return

  const { error } = await supabase.from('diagnosis_results').insert([
    {
      age: data.age,
      affiliation: data.affiliation,
      layer1_answers: data.scenarioAnswers,
      layer2_answers: data.layer2Answers ?? null,
      os_score: data.osScore,
      se_score: data.seScore,
      pe_score: data.peScore,
      es_score: data.esScore,
      ci_score: data.ciScore ?? null,
      am_score: data.amScore ?? null,
      type_code: data.typeCode,
      deep_analysis: data.deepAnalysis ?? null,
      hardwork_resilience: data.riskIndicators?.hardworkResilience ?? null,
      adversity_processing: data.riskIndicators?.adversityProcessing ?? null,
      overall_persistence: data.riskIndicators?.overallPersistence ?? null,
      adversity_risk: data.riskIndicators?.adversityRisk ?? null,
      adversity_risk_note: data.riskIndicators?.adversityRiskNote ?? null,
    },
  ])

  if (error) {
    console.error('Supabase save error:', error)
    throw error
  }
}
