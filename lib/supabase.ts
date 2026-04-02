import { createClient } from '@supabase/supabase-js'
import { ScenarioAnswer, Layer2Answers } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveDiagnosisResult(data: {
  age: number
  affiliation: string
  scenarioAnswers: ScenarioAnswer[]
  layer2Answers?: Layer2Answers
  osScore: number
  axisA: number
  axisB: number
  axisC: number
  zone: string
  personalityType: string
}) {
  const { error } = await supabase.from('diagnosis_results').insert([
    {
      age: data.age,
      affiliation: data.affiliation,
      layer1_answers: data.scenarioAnswers,
      layer2_answers: data.layer2Answers ?? null,
      os_score: data.osScore,
      axis_a_score: data.axisA,
      axis_b_score: data.axisB,
      axis_c_score: data.axisC,
      zone: data.zone,
      personality_type: data.personalityType,
    },
  ])

  if (error) {
    console.error('Supabase save error:', error)
    throw error
  }
}
