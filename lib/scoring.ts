import { ScenarioAnswer, DeepAnalysis } from '@/types'

export type { DeepAnalysis }

// ================================================================
// Tier 1: メインスコア計算
// ================================================================

/**
 * OS: 逆境解釈力 (Explanatory Style / ASQ)
 * 6シナリオ × 3帰属次元、等重み平均
 * 根拠: Sweeney et al. 1986 メタ分析で3次元の効果量がほぼ同等
 */
export function calculateOS(scenarioAnswers: ScenarioAnswer[]): number {
  let total = 0
  let count = 0
  for (const ans of scenarioAnswers) {
    for (const attr of ans.attributions) {
      total += 8 - attr // 7段階を反転（高い=楽観的）
      count++
    }
  }
  if (count === 0) return 0
  return Math.round((total / count) * 100 / 7)
}

/**
 * SE: 自己効力感 (NGSE, Chen et al. 2001)
 * 8項目、5段階、全てreversed=false
 * 根拠: Stajkovic & Luthans 1998 メタ分析 r=.38
 */
export function calculateSE(seAnswers: number[]): number {
  if (seAnswers.length === 0) return 0
  const sum = seAnswers.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / (seAnswers.length * 5))
}

/**
 * PE: 持続的努力 (Grit-S PE, Duckworth & Quinn 2009)
 * 5項目、5段階、全てreversed=false
 * 根拠: Credé et al. 2017 メタ分析 ρ≈.28
 */
export function calculatePE(peAnswers: number[]): number {
  if (peAnswers.length === 0) return 0
  const sum = peAnswers.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / 25)
}

/**
 * ES: 情緒安定性 (BFI-2-J Neuroticism reversed)
 * 10項目、5段階、reversed混在
 * 根拠: Eschleman et al. 2010 メタ分析 r=.35（逆境下）
 */
export function calculateES(esAnswers: number[], reversedFlags: boolean[]): number {
  if (esAnswers.length === 0) return 0
  let sum = 0
  esAnswers.forEach((val, i) => {
    sum += reversedFlags[i] ? (6 - val) : val
  })
  return Math.round((sum * 100) / (esAnswers.length * 5))
}

// ================================================================
// Tier 2: 補助指標
// ================================================================

/**
 * CI: 興味の一貫性 (Grit-S CI)
 * 5項目、5段階、全てreversed=true
 */
export function calculateCI(ciAnswers: number[]): number {
  if (ciAnswers.length === 0) return 0
  const sum = ciAnswers.reduce((a, b) => a + (6 - b), 0)
  return Math.round((sum * 100) / 25)
}

/**
 * AM: 自律的動機づけ (SDT/BPNS)
 * 6項目、5段階（AM2のみreversed=true）
 */
export function calculateAM(amAnswers: number[]): number {
  if (amAnswers.length === 0) return 0
  // AM2 (index 1) は reversed=true
  const adjusted = amAnswers.map((v, i) => i === 1 ? (6 - v) : v)
  const sum = adjusted.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / (amAnswers.length * 5))
}

// ================================================================
// 統合スコア計算
// ================================================================

export function calculateScores(
  scenarioAnswers: ScenarioAnswer[],
  layer2Answers: number[]
): { SE: number; PE: number; OS: number; ES: number; CI: number; AM: number } {
  const OS = calculateOS(scenarioAnswers)

  if (layer2Answers.length === 0) {
    return { SE: 0, PE: 0, OS, ES: 0, CI: 0, AM: 0 }
  }

  // 配列インデックス:
  // SE: 0-7 (8問)
  // PE: 8-12 (5問)
  // CI: 13-17 (5問)
  // ES: 18-27 (10問)
  // AM: 28-33 (6問)
  const seAnswers = layer2Answers.slice(0, 8)
  const peAnswers = layer2Answers.slice(8, 13)
  const ciAnswers = layer2Answers.slice(13, 18)
  const esAnswers = layer2Answers.slice(18, 28)
  const amAnswers = layer2Answers.slice(28, 34)

  // ES reversed flags: ES1,ES3,ES4,ES7,ES9 が reversed=true
  const esReversed = [true, false, true, true, false, false, true, false, true, false]

  return {
    SE: calculateSE(seAnswers),
    PE: calculatePE(peAnswers),
    OS,
    ES: calculateES(esAnswers, esReversed),
    CI: calculateCI(ciAnswers),
    AM: calculateAM(amAnswers),
  }
}

// ================================================================
// Description関数（全て string を返す）
// ================================================================

export function getSEDescription(score: number): string {
  if (score >= 80) return '非常に高い自己効力感を持っています。困難な課題に直面しても「自分ならできる」という強い信念があります。Stajkovic & Luthans (1998) のメタ分析（114研究、N=21,616）では、自己効力感とパフォーマンスの相関はr=.38と報告されており、個人特性の中で最も強力な予測因子の一つです。この強みを活かし、挑戦的な目標を設定することで更に成長できます。'
  if (score >= 60) return '平均的〜やや高い自己効力感です。多くの場面で自分の能力を信じて行動できますが、未経験の領域や大きな困難に直面すると不安が生じることがあります。成功体験を意識的に振り返ることで、自己効力感はさらに高められます。'
  if (score >= 40) return 'やや低い自己効力感です。自分の能力に対する確信が持ちにくく、困難な課題を避ける傾向があるかもしれません。Bandura (1997) によれば、自己効力感は「達成体験」で最も効果的に高まります。確実にできる小さな目標を設定し、成功の積み重ねから始めてください。'
  return '自己効力感が低い状態です。しかしこれは固定的な性格ではなく、経験によって変化します。まずは確実に達成できる目標を1つ設定し、達成したら自分を認めてください。その繰り返しが自己効力感の基盤になります。'
}

export function getPEDescription(score: number): string {
  if (score >= 80) return '極めて高い持続的努力の傾向を持っています。困難に直面しても諦めず、最後まで粘り強く取り組むことができます。Credé et al. (2017) のメタ分析（88サンプル、N=66,807）では、Gritの中でもこの「持続的努力（PE）」がパフォーマンスを予測する主要因子であることが示されています。'
  if (score >= 60) return '平均的〜やや高い持続力です。多くの場面で粘り強く取り組めますが、長期間の困難が続くと意欲が低下することがあります。中間目標を設定して達成感を得ることで、持続力を維持しやすくなります。'
  if (score >= 40) return '持続的努力がやや低い状態です。始めることはできても、困難に直面すると別のことに移りやすい傾向があるかもしれません。「まず5分だけ」ルールや、進捗の可視化が効果的です。'
  return '持続的努力が低い状態です。困難に直面すると早期に中断する傾向があります。行動を「始める」ハードルを極限まで下げること（例：机に座るだけ）が改善の第一歩です。'
}

export function getOSDescription(score: number): string {
  if (score >= 80) return '非常に楽観的な帰属スタイルを持っています。逆境を「一時的で、この場面に限ったこと」と解釈する傾向があり、困難からの回復が早いです。Seligman & Schulman (1986) の保険営業研究では、楽観的帰属スタイルを持つ人は悲観的な人に比べて離職率が半分でした。（本スコアは内的・安定性・全般性の3次元を等重みで合算。Sweeney et al., 1986 のメタ分析で3次元の効果量がほぼ同等であることに基づく）'
  if (score >= 60) return 'やや楽観的な帰属スタイルです。多くの場面で逆境を一時的なものと捉えられますが、特定の状況では悲観的になることがあります。Peterson et al. (1982) のASQ研究では、このレンジは現実的楽観主義として最も適応的とされています。'
  if (score >= 40) return 'やや悲観的な帰属スタイルです。逆境を「自分のせいで、ずっと続く、全てに影響する」と解釈しやすい傾向があります。出来事の原因を「一時的・限定的・外的」に意識的に再解釈する訓練（Seligman, 1991）が有効です。'
  return '悲観的な帰属スタイルです。逆境に対して内的・安定的・全般的に帰属する傾向が強く、学習性無力感に陥りやすい状態です。Abramson et al. (1978) の理論では、この帰属パターンは変更可能な思考習慣とされており、認知行動療法的なアプローチ（帰属再訓練）の活用を検討してください。'
}

export function getESDescription(score: number): string {
  if (score >= 80) return '非常に高い情緒安定性を持っています。Costa & McCrae (1992) のBig Five研究では、情緒安定性はほぼ全ての職種でパフォーマンスと正の相関を持つ数少ない特性として確認されています。プレッシャー下でも冷静さを保ち、感情に流されない判断ができる力は、特に高ストレス環境での大きなアドバンテージです。Luthans et al. (2007) のPsyCap研究でも、高い情緒安定性はチームの「アンカー」として機能することが示されています。'
  if (score >= 60) return '十分な情緒安定性の基盤があります。日常的なストレスに対してバランスよく対処できる状態です。Gross (1998) の感情制御研究によれば、このレンジは適応的な範囲にあります。強いプレッシャー場面での感情制御をさらに磨くことで、より高いパフォーマンスが期待できます。'
  if (score >= 40) return '情緒安定性にまだ伸びしろがあります。ストレス下での感情の揺れが、パフォーマンスに影響しやすい状態です。Gross (1998) の感情制御研究では、認知的再評価（Cognitive Reappraisal）のトレーニングが長期的に効果的であることが示されています。マインドフルネス実践が3ヶ月で有意な効果を示すことも報告されています (Gross & John, 2003)。'
  return '現時点では感情の揺れが大きく、ストレス下でのパフォーマンスへの影響が出やすい傾向です。Costa & McCrae (1992) の研究では、この状態は適切なサポートがある環境で改善できることが示されています。信頼できるメンターや相談相手を確保し、感情面のサポート体制を整えることが最優先です。心理的安全性の高い環境を選ぶことが、能力を発揮するための前提条件になります。'
}

export function getCIDescription(score: number): string {
  if (score >= 70) return '興味や関心が長期間一貫しています。一つの分野に深くコミットする力があります。Jachimowicz et al. (2018) は、興味の一貫性が情熱と結びついた場合にパフォーマンスを予測することを示しました。'
  if (score >= 40) return '興味の一貫性は中程度です。ある程度は一つのことに集中できますが、新しいことに目移りすることもあります。方向性が定まれば持続力に転換できます。'
  return '興味や関心が変わりやすい傾向があります。これ自体は悪いことではなく、探索期には自然なことです (Duckworth & Quinn, 2009)。ただし、一つの分野で成果を出すには意識的な集中が必要になります。'
}

export function getAMDescription(score: number): string {
  if (score >= 80) return '非常に高い自律的動機づけを持っています。自分の意志で行動を選択し、内発的な理由で物事に取り組めています。SDTのメタ分析（k=192, N=93,552）では、自律的動機づけが仕事のエンゲージメント・パフォーマンス・ウェルビーイングと正の関連を持つことが確認されています。'
  if (score >= 60) return '平均的〜やや高い自律的動機づけです。多くの場面で自分の選択として行動できていますが、外的なプレッシャーに左右される場面もあります。'
  if (score >= 40) return 'やや低い自律的動機づけです。「やらされている」感覚が強いかもしれません。自分の価値観と行動を結びつける意味づけが鍵です。'
  return '自律的動機づけが低い状態です。外的な報酬や義務感で動いている傾向が強く、困難時に粘る力が出にくい状態です。「なぜこれをやるのか」を自分の言葉で再定義することから始めてください。'
}

// ================================================================
// タイプ判定（SE-PE-OS-ES）
// ================================================================

// TODO: N≥50でSE/PE/OS/ESの中央値・四分位を確認し、閾値(現在60)を中央値ベースに切り替え検討
const TYPE_THRESHOLD = 60

export function getPersonalityTypeKey(SE: number, PE: number, OS: number, ES: number): string {
  return (SE >= TYPE_THRESHOLD ? 'H' : 'L') +
    (PE >= TYPE_THRESHOLD ? 'H' : 'L') +
    (OS >= TYPE_THRESHOLD ? 'H' : 'L') +
    (ES >= TYPE_THRESHOLD ? 'H' : 'L')
}

export function determineType(se: number, pe: number, os: number, es: number): string {
  return getPersonalityTypeKey(se, pe, os, es)
}

// ================================================================
// 16タイプ定義
// 軸順: SE(自己効力感) - PE(持続努力) - OS(逆境解釈) - ES(情緒安定)
// ================================================================

export const PERSONALITY_TYPES: Record<string, {
  name: string
  subtitle: string
  description: string
  strengths: string
  weaknesses: string
  advice: string
}> = {
  HHHH: {
    name: '不屈の実行者',
    subtitle: '全資源充実型',
    description: '自分を信じ、粘り強く努力を続け、逆境を成長機会と解釈し、感情も安定しています。困難な状況でも最も高いパフォーマンスを維持できるプロファイルです。',
    strengths: '全ての心理的資源が高水準。逆境を恐れず挑戦し、長期間のハードワークにも耐えられる',
    weaknesses: '過信による準備不足や、他者の弱さへの共感不足が生じうる',
    advice: 'セルフモニタリングと他者視点の取り込みを意識し、チーム全体の底上げに力を使うとリーダーシップがさらに強化されます',
  },
  HHHL: {
    name: '情熱の突破者',
    subtitle: '高能力・感情変動型',
    description: '自己効力感・努力持続力・逆境解釈力が高い一方、感情の波が大きいタイプです。感情をエネルギーに変えられれば非常に強いが、消耗も激しい。',
    strengths: '高い自信と行動力、前向きな逆境解釈。短期集中で大きな成果を出せる',
    weaknesses: 'ストレス下で感情が乱れやすく、パフォーマンスにムラが出る',
    advice: '感情のセルフモニタリング習慣（日記、マインドフルネス）が最優先の改善策です',
  },
  HHLH: {
    name: '冷静な自信家',
    subtitle: '実力型・解釈課題あり',
    description: '自信があり努力もし感情も安定しているが、逆境を悲観的に解釈する傾向があります。実力はあるのに「もうダメだ」と思いやすい。',
    strengths: '高い基礎能力と安定感。冷静に行動でき、周囲の信頼も厚い',
    weaknesses: '逆境時に内的・安定的に帰属し、必要以上に自分を責める',
    advice: '帰属再訓練：困難の原因を「一時的で、この場面に限ったこと」と意識的に捉え直す習慣をつけてください',
  },
  HHLL: {
    name: '実力ある不安定型',
    subtitle: '高能力・逆境脆弱型',
    description: '自信と努力はあるが、逆境の解釈が悲観的で感情も不安定。平時は優秀だが、困難時に崩れるリスクがある。',
    strengths: '潜在能力は高い。自己効力感と粘りという2大資源を持っている',
    weaknesses: '逆境で解釈と感情の両面から崩れ、パフォーマンスが急落する',
    advice: '認知行動療法的アプローチ（思考記録、認知再構成）が最も効果的です',
  },
  HLHH: {
    name: '慎重な楽観主義者',
    subtitle: '安定型・行動課題あり',
    description: '自信はあり逆境解釈も前向きで安定しているが、努力の持続にムラがある。始めるのは得意だが長続きしにくい。',
    strengths: '精神的な安定感と前向きさ。環境適応力が高い',
    weaknesses: '長期的な努力の継続が課題。途中で興味が移りやすい',
    advice: '小さなマイルストーン設定と進捗の可視化、習慣化の仕組みづくりが効果的です',
  },
  HLHL: {
    name: '直感の挑戦者',
    subtitle: '高自信・低持久型',
    description: '自信があり楽観的だが、努力持続と感情安定の両方が弱い。瞬発力は高いが持久力に欠ける。',
    strengths: '高い自信と楽観性。新しいことへの挑戦意欲',
    weaknesses: '感情の波と行動の断続。プロジェクトの完遂が課題',
    advice: 'ルーティン化と仕組み化。意志力に頼らず「自動的に続く」環境を設計してください',
  },
  HLLH: {
    name: '潜在力の守備型',
    subtitle: '自信あり・行動停滞型',
    description: '自信はあるが努力が続かず逆境解釈も悲観的。感情は安定しているため崩れはしないが、前に進みにくい。',
    strengths: '感情的な安定と基礎的な自信。土台は固い',
    weaknesses: '行動と解釈の両面で停滞しやすい',
    advice: '「まず5分だけ」の即行動ルールと、原因の外在化訓練を並行で実施してください',
  },
  HLLL: {
    name: '自信だけが頼り型',
    subtitle: '高SE・他軸低型',
    description: '自己効力感だけが高く、他の3軸が低い。「自分ならできる」とは思うが、行動・解釈・感情がついてこない。',
    strengths: '「できる」という信念がある。回復の最も重要な起点',
    weaknesses: '自信以外の支えが弱い。行動が伴わず自信が空回りするリスク',
    advice: 'SEの高さを活かし、まず小さな行動を1つ完遂。成功体験でPEを育てることを最優先に',
  },
  LHHH: {
    name: '堅実な努力家',
    subtitle: '低自信・高行動型',
    description: '努力・楽観・安定は高いが自信が低い。やるべきことはやれるのに「自分はまだまだ」と過小評価する。',
    strengths: '粘り強く、安定して、前向き。行動面では非常にバランスが良い',
    weaknesses: '自己効力感の低さが挑戦の幅を狭め、実力以下の目標を選びがち',
    advice: '成功体験の記録が最重要。過去の達成リストを作り、週1回振り返る習慣を',
  },
  LHHL: {
    name: '努力する繊細型',
    subtitle: '高粘り・感情変動型',
    description: '粘りと楽観はあるが、自信が低く感情が不安定。頑張れるが、感情の消耗で燃え尽きやすい。',
    strengths: '行動力と前向きな逆境解釈。困難でも動き続けられる',
    weaknesses: '感情の波と低い自己評価が、努力の質を下げ燃え尽きリスクを高める',
    advice: 'セルフコンパッション。「頑張っている自分」を認め、休息を戦略的に取る習慣を',
  },
  LHLH: {
    name: '安定した慎重派',
    subtitle: '低自信・悲観的安定型',
    description: '努力と安定はあるが、自信と楽観性が低い。堅実だが、逆境で動きが止まりやすい。',
    strengths: '粘りと感情の安定。地道に積み上げる力がある',
    weaknesses: '悲観的解釈と低い自信が相互に強化し、萎縮しやすい',
    advice: '帰属再訓練 + 段階的な難易度上昇で自信を構築。両面からのアプローチが必要',
  },
  LHLL: {
    name: '孤軍奮闘型',
    subtitle: '高PE・他軸脆弱型',
    description: '努力だけが高く、自信・楽観・安定が低い。歯を食いしばって頑張るが、内面は消耗しきっている。',
    strengths: '持続的努力の素養がある。諦めない力は最大の資産',
    weaknesses: 'メンタル面の全てが脆い。バーンアウトリスクが最も高いプロファイル',
    advice: '最優先はES（感情安定）の改善。マインドフルネス、信頼できる人への相談、睡眠の確保から',
  },
  LLHH: {
    name: '楽観的な安定型',
    subtitle: '高解釈・低行動型',
    description: '逆境解釈と感情は良好だが、自信と努力の持続が低い。精神的には健全だが行動が伴わない。',
    strengths: '精神的に健全。ストレスに強い認知と感情の基盤がある',
    weaknesses: '行動が伴わず、知識やポテンシャルが活かしきれない',
    advice: '行動目標の具体化。「何を、いつ、どこで」のif-then計画を設定してください',
  },
  LLHL: {
    name: '楽観的だが不安定型',
    subtitle: '前向き・基盤脆弱型',
    description: '逆境を前向きに捉えるが、自信・努力・感情安定が低い。気持ちは前向きだが実行と安定が追いつかない。',
    strengths: '楽観的な解釈力は回復の起点になる',
    weaknesses: '行動・自信・感情の3面が弱く、楽観さだけでは持続できない',
    advice: 'OSの高さを活かし、まず感情安定→自信→行動の順で段階的に改善を',
  },
  LLLH: {
    name: '静かな耐久型',
    subtitle: '高安定・低活動型',
    description: '感情だけが安定している。自信・努力・楽観が低いが、感情的に崩れにくい。',
    strengths: '感情の安定は大きな資産。パニックにならず冷静でいられる',
    weaknesses: '自信・行動・解釈の全てが低く、動き出すきっかけが見つかりにくい',
    advice: 'ESの安定を土台に、まずSE（自己効力感）を小さな成功で育てることから',
  },
  LLLL: {
    name: '発展途上型',
    subtitle: '全面成長機会型',
    description: '全ての軸が現時点で低い状態です。ただしこれは「今の状態」を示すスナップショットであり、固定的な性格ではありません。',
    strengths: '伸びしろが全方向にある。どの軸を1つ改善しても大きな効果が出る',
    weaknesses: '複数の面で困難を抱えやすく、何から手をつけるか迷いやすい',
    advice: 'まずES（感情安定）を最優先に。次にSE（自信）。一度に全部ではなく、1軸ずつ取り組んでください',
  },
}

// ================================================================
// 環境フィットプロファイル
// 軸順: SE-PE-OS-ES
// ================================================================

export interface EnvironmentFit {
  idealEnvironment: string[]
  stressors: string[]
  copingStrategies: string[]
}

export const ENVIRONMENT_FIT: Record<string, EnvironmentFit> = {
  HHHH: {
    idealEnvironment: ['高い裁量と挑戦がある環境', '成果主義で自律性が尊重される組織', 'スタートアップや新規事業部門'],
    stressors: ['裁量がなくマイクロマネジメントされる環境', '成長機会がない停滞した組織'],
    copingStrategies: ['定期的な自己振り返りで過信を防ぐ', 'メンターからの率直なフィードバックを求める', '他者視点を意識的に取り込む1on1を実践する'],
  },
  HHHL: {
    idealEnvironment: ['短期集中型のプロジェクト', '成果が明確に見える仕事', '情熱を発揮できるクリエイティブな職場'],
    stressors: ['長期間の単調な作業', '感情を抑圧される環境', '人間関係の摩擦が多い職場'],
    copingStrategies: ['感情日記で自己モニタリング', '定期的な運動やマインドフルネス', '信頼できる人への定期的な相談'],
  },
  HHLH: {
    idealEnvironment: ['安定した組織で専門性を深められる環境', '明確なキャリアパスがある職場', 'チームワーク重視の文化'],
    stressors: ['突発的なトラブルが多い環境', '失敗が厳しく罰される文化', '先行きが不透明な状況'],
    copingStrategies: ['失敗を「一時的・限定的」と再解釈する習慣', '成功事例の記録と振り返り', 'Seligmanの帰属再訓練を実践する'],
  },
  HHLL: {
    idealEnvironment: ['メンターが手厚くサポートしてくれる環境', '心理的安全性の高いチーム', '段階的な成長が認められる組織'],
    stressors: ['孤立しやすい環境', '急激な変化やプレッシャーが多い職場'],
    copingStrategies: ['認知行動療法的なセルフワーク', '信頼できるメンターとの定期面談', '睡眠・運動の基盤整備'],
  },
  HLHH: {
    idealEnvironment: ['多様な経験ができるジョブローテーション', '短期サイクルで成果が出るプロジェクト', '自律性が高い環境'],
    stressors: ['長期間同じ作業を続ける環境', '細かい進捗管理をされる職場'],
    copingStrategies: ['タスクを小さく分解して達成感を頻繁に得る', '習慣化ツール（トラッカーアプリ等）の活用', '3ヶ月間1テーマ集中する実験を定期的に行う'],
  },
  HLHL: {
    idealEnvironment: ['変化が多く刺激的な環境', '短期成果が求められるポジション'],
    stressors: ['長期計画が必要な仕事', '感情的なプレッシャーが多い職場'],
    copingStrategies: ['ルーティンの仕組み化', '感情安定のためのマインドフルネス習慣'],
  },
  HLLH: {
    idealEnvironment: ['安定した環境で少しずつ挑戦を増やせる職場', 'サポート体制が整った組織'],
    stressors: ['急激な変化', '高い期待をかけられる環境'],
    copingStrategies: ['「まず5分」の即行動ルール', '帰属再訓練で原因の外在化'],
  },
  HLLL: {
    idealEnvironment: ['手厚いサポートとフィードバックがある環境', '小さな成功を積める段階的な業務'],
    stressors: ['孤立', '高いプレッシャー', '急激な変化'],
    copingStrategies: ['SEの高さを活かし小さな行動目標を完遂する', 'カウンセリングやコーチングの活用'],
  },
  LHHH: {
    idealEnvironment: ['努力を正当に評価してくれる組織', '仲間と支え合えるチーム環境', 'フィードバックが豊富な職場'],
    stressors: ['成果のみで評価される環境', '自己アピールが必要な場面が多い職場'],
    copingStrategies: ['成功体験の記録と週1回の振り返り', '信頼できる人からの肯定的フィードバックを意識的に受け取る'],
  },
  LHHL: {
    idealEnvironment: ['温かい人間関係がある職場', '努力のプロセスを認める文化'],
    stressors: ['競争的な環境', '感情を表出しにくい職場'],
    copingStrategies: ['セルフコンパッション', '戦略的な休息', '信頼できる人への定期相談'],
  },
  LHLH: {
    idealEnvironment: ['段階的にスキルアップできる環境', '安定した上司のもとでの業務'],
    stressors: ['高い不確実性', '失敗が許されない環境'],
    copingStrategies: ['帰属再訓練', '段階的目標設定による自信構築'],
  },
  LHLL: {
    idealEnvironment: ['心理的安全性が非常に高い環境', 'メンタルヘルスサポートが充実した組織'],
    stressors: ['あらゆるプレッシャー', '孤立'],
    copingStrategies: ['最優先: 感情安定の改善（専門家の支援も検討）', '持続努力の素養を活かし、改善行動を「習慣」にする'],
  },
  LLHH: {
    idealEnvironment: ['自律性が高く、自分のペースで働ける環境', 'プレッシャーが少なく安定した職場'],
    stressors: ['高い成果要求', '急かされる環境'],
    copingStrategies: ['if-then計画で具体的な行動目標を設定', '自己効力感を育てる小さな挑戦から'],
  },
  LLHL: {
    idealEnvironment: ['サポーティブで柔軟な環境', '短期目標が明確な業務'],
    stressors: ['長期的プレッシャー', '感情的消耗が多い環境'],
    copingStrategies: ['感情安定→自信→行動の順で段階的改善', '楽観的解釈力を活かしたポジティブ日記'],
  },
  LLLH: {
    idealEnvironment: ['安定した環境', '手厚いサポート体制', '段階的な業務'],
    stressors: ['急な変化', '高い要求', '孤立'],
    copingStrategies: ['感情安定を土台にSEを小さな成功で育てる', 'ルーティンの確立'],
  },
  LLLL: {
    idealEnvironment: ['心理的安全性が最も高い環境', '手厚い1on1サポート', '成長のペースを自分で決められる職場'],
    stressors: ['あらゆる高負荷環境'],
    copingStrategies: ['ES→SE→PE→OSの順で1つずつ改善', '専門家（カウンセラー、コーチ）のサポートを積極活用'],
  },
}

export function getEnvironmentFit(key: string): EnvironmentFit {
  return ENVIRONMENT_FIT[key] ?? ENVIRONMENT_FIT.LLLL
}

// ================================================================
// Deep Analysis
// ================================================================

export function calculateDeepAnalysis(layer2Answers: number[]): DeepAnalysis {
  if (layer2Answers.length === 0) return { autonomousMotivation: 0, consistencyOfInterest: 0 }
  const ciAnswers = layer2Answers.slice(13, 18)
  const amAnswers = layer2Answers.slice(28, 34)
  return {
    autonomousMotivation: calculateAM(amAnswers),
    consistencyOfInterest: calculateCI(ciAnswers),
  }
}

// ================================================================
// Risk Indicators
// ================================================================

export interface RiskIndicators {
  hardworkResilience: number
  adversityProcessing: number
  overallPersistence: number
  adversityRisk: 'high' | 'medium' | 'low'
  adversityRiskNote: string
}

export function computeRiskIndicators(
  se: number, pe: number, os: number, es: number
): RiskIndicators {
  const hardworkResilience = Math.round((se + pe) / 2)
  const adversityProcessing = Math.round((os + es) / 2)
  const overallPersistence = Math.round((se + pe + os + es) / 4)

  let adversityRisk: 'high' | 'medium' | 'low'
  let adversityRiskNote: string

  if (os >= 60 && es >= 60) {
    adversityRisk = 'low'
    adversityRiskNote = '楽観的な帰属スタイルと情緒安定性が高く、逆境での消耗リスクは低いです。高プレッシャー環境でも自走しやすい状態です。'
  } else if (os < 40 && es < 40) {
    adversityRisk = 'high'
    adversityRiskNote = '逆境を長期的・自己帰属的に捉えやすく、情緒安定性も低めです。高ストレス環境では早期に消耗するリスクがあります。まず心理的安全性の高い環境を選ぶことが重要です。'
  } else if (os < 40 || es < 40) {
    adversityRisk = 'medium'
    adversityRiskNote = os < 40
      ? '逆境の捉え方に改善の余地があります。失敗を一時的・限定的に捉える練習（Seligman, 1991）と、支援的なメンターの存在が回復力を高めます。'
      : '感情の揺れが逆境時のパフォーマンスに影響することがあります。感情調整の練習と、定期的な1on1でのサポートが有効です。'
  } else {
    adversityRisk = 'medium'
    adversityRiskNote = '基盤は整っていますが、特定の状況下では消耗しやすい面があります。メンターや定期フィードバックで安定的に力を発揮できます。'
  }

  return { hardworkResilience, adversityProcessing, overallPersistence, adversityRisk, adversityRiskNote }
}

/**
 * ゾーン名を type key (例: HLLH) から返す
 * ゾーンは PE (key[1]) と ES (key[3]) で決まる
 */
export function getZoneName(key: string): string {
  const pe = key[1] // H or L
  const es = key[3] // H or L
  if (pe === 'H' && es === 'H') return '実行者ゾーン'
  if (pe === 'H' && es === 'L') return '挑戦者ゾーン'
  if (pe === 'L' && es === 'H') return '安定者ゾーン'
  return '模索者ゾーン'
}
