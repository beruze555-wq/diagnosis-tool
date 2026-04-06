import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iautegywqqxkcerymulq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdXRlZ3l3cXF4a2NlcnltdWxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3MjQ1MCwiZXhwIjoyMDkwMzQ4NDUwfQ.OPfTxhtoJmwwPYtEyqm2ecJPGGk92aBh3uy_v0gO2pw'
)

const layer1Answers = [
  { scenarioId: 1, title: '30件全滅の1日',       attributions: [5, 3, 6] },
  { scenarioId: 2, title: '企画全面却下',          attributions: [6, 2, 6] },
  { scenarioId: 3, title: '試合で決定的ミス',      attributions: [5, 3, 6] },
  { scenarioId: 4, title: '信頼していた仲間の離脱', attributions: [2, 5, 5] },
  { scenarioId: 5, title: '3ヶ月の努力が白紙',    attributions: [4, 2, 6] },
  { scenarioId: 6, title: '自分だけ置いていかれる', attributions: [7, 1, 5] },
]

// layer2 の value を順番通りに並べた配列 (SE×8, PE×5, CI×5, ES×10, AM×6 = 34)
const layer2Answers = [
  4, 4, 3, 2, 4, 2, 3, 4, // SE1-8
  3, 2, 3, 4, 2,           // PE1-5
  2, 4, 3, 2, 3,           // CI1-5
  3, 2, 2, 4, 3, 2, 2, 3, 2, 4, // ES1-10
  4, 3, 4, 4, 3, 2,        // AM1-6
]

// 実テーブルのカラム:
// id, created_at, age, affiliation, layer1_answers, layer2_answers,
// os_score, axis_a_score, axis_b_score, axis_c_score,
// zone, personality_type, deep_analysis, zone_id,
// hardwork_resilience, commit_sustainability,
// adversity_risk, adversity_risk_note

const payload = {
  age: 21,
  affiliation: '大学3〜4年生',
  layer1_answers: layer1Answers,
  layer2_answers: layer2Answers,
  os_score: 52,
  axis_a_score: 65,  // SE（自己効力感）
  axis_b_score: 56,  // PE（持続的努力）
  axis_c_score: 62,  // ES（情緒安定性）
  zone: '安定者ゾーン',        // PE-L / ES-H → 安定者ゾーン
  zone_id: 'HLLH',
  personality_type: '潜在力の守備型',
  deep_analysis: { autonomousMotivation: 67, consistencyOfInterest: 64 },
  hardwork_resilience: 60.5,    // (SE+PE)/2 = (65+56)/2
  commit_sustainability: 57.0,  // (OS+ES)/2 = (52+62)/2
  adversity_risk: 43.0,         // 100 - commit_sustainability = 100 - 57
  adversity_risk_note:
    '基盤は整っていますが、特定の状況下では消耗しやすい面があります。メンターや定期フィードバックで安定的に力を発揮できます。',
}

const { data, error } = await supabase.from('diagnosis_results').insert([payload]).select()

if (error) {
  console.error('❌ 保存失敗:', JSON.stringify(error, null, 2))
  process.exit(1)
}

console.log('✅ 保存成功:', JSON.stringify(data, null, 2))
