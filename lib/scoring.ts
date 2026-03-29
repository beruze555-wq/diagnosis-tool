import { ScenarioAnswer, Layer2Answers, Scores, Zone } from '@/types'

export function calculateOS(scenarioAnswers: ScenarioAnswer[]): number {
  const allAttributions = scenarioAnswers.flatMap((a) => a.attributions)
  const inverted = allAttributions.map((v) => 8 - v)
  const avg = inverted.reduce((sum, v) => sum + v, 0) / inverted.length
  return Math.round((avg * 100) / 7)
}

export function calculateAxisA(axisA: number[]): number {
  const reversedIdx = [2, 4, 7] // A3, A5, A8 (0-indexed)
  const adjusted = axisA.map((v, i) => (reversedIdx.includes(i) ? 6 - v : v))
  const sum = adjusted.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / 50)
}

export function calculateAxisB(axisB: number[]): number {
  const reversedIdx = [1, 3, 6, 8] // B2, B4, B7, B9 (0-indexed)
  const adjusted = axisB.map((v, i) => (reversedIdx.includes(i) ? 6 - v : v))
  const sum = adjusted.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / 50)
}

export function calculateAxisC(axisC: number[]): number {
  const reversedIdx = [4] // C5 (0-indexed)
  const adjusted = axisC.map((v, i) => (reversedIdx.includes(i) ? 6 - v : v))
  const sum = adjusted.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / 50)
}

export function determineZone(OS: number, A: number, B: number, C: number): Zone {
  if (OS < 35) return 'Red'
  const countBelow40 = [A, B, C].filter((v) => v < 40).length
  if (countBelow40 >= 2) return 'Red'
  if (A >= 60 && B >= 60 && C >= 60) return 'Green'
  return 'Yellow'
}

export function calculateScores(
  scenarioAnswers: ScenarioAnswer[],
  layer2Answers?: Layer2Answers
): Scores {
  const OS = calculateOS(scenarioAnswers)

  if (OS < 35 || !layer2Answers) {
    return { OS, A: 0, B: 0, C: 0, zone: 'Red' }
  }

  const A = calculateAxisA(layer2Answers.axisA)
  const B = calculateAxisB(layer2Answers.axisB)
  const C = calculateAxisC(layer2Answers.axisC)
  const zone = determineZone(OS, A, B, C)

  return { OS, A, B, C, zone }
}

export function getOSDescription(score: number): string {
  if (score >= 80) return '逆境を"一時的な出来事"として捉える力が非常に強い。立ち直りが早く、失敗を引きずりにくいタイプです。'
  if (score >= 60) return '逆境への捉え方は比較的健全です。時に落ち込むことがあっても、自力で立て直せるレベルです。'
  if (score >= 35) return '逆境が起きたとき、やや悲観的に捉える傾向があります。周囲のサポートがあれば十分に力を発揮できます。'
  return '逆境を"自分のせいで、ずっと続く"と捉えやすい傾向があります。環境選びとメンタルケアが重要です。'
}

export function getAxisADescription(score: number): string {
  if (score >= 80) return '一度決めたらやり抜く力が極めて強い。長期間の努力が求められる仕事に高い適性があります。'
  if (score >= 60) return '粘り強さは十分にあります。目標が明確であれば、困難な局面も乗り越えられます。'
  if (score >= 40) return '粘り強さは平均的。興味や目的が薄れると継続が難しくなることがあります。'
  return '長期的な取り組みよりも、短期で成果が見える仕事の方が力を発揮しやすいタイプです。'
}

export function getAxisBDescription(score: number): string {
  if (score >= 80) return '感情の波が小さく、拒絶やストレスに対して非常にタフ。対人ストレスの高い業務への耐性があります。'
  if (score >= 60) return 'ストレスへの耐性は十分。感情的になることはあっても、コントロールできる範囲です。'
  if (score >= 40) return 'ストレスや批判にやや敏感。信頼できる上司やチームがいる環境で安定しやすいです。'
  return '感情の揺れが大きく、対人ストレスの影響を受けやすい。心理的安全性の高い環境が重要です。'
}

export function getAxisCDescription(score: number): string {
  if (score >= 80) return '競争心と上昇志向が非常に強い。成果報酬型の環境で最大限に力を発揮します。'
  if (score >= 60) return '達成意欲は高い水準。明確な目標と報酬があればモチベーションを維持できます。'
  if (score >= 40) return '達成動機は平均的。競争よりも協調やプロセスを重視する傾向があります。'
  return '競争環境よりも、安定した環境でじっくり取り組む方が力を発揮しやすいタイプです。'
}

export function getZoneComment(zone: Zone): string {
  if (zone === 'Green') return '高ストレス環境でも自走し、成果を出し続けられる可能性が高いです。営業・スタートアップなどの即戦力候補です。'
  if (zone === 'Yellow') return '基本的なポテンシャルはありますが、一部に課題があります。適切なオンボーディングとメンタリングで十分に活躍できます。'
  return '現時点では高ストレス環境との相性に課題がある可能性があります。本人の志向と環境のマッチングを慎重に検討してください。'
}
