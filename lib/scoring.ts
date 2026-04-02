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

// --- Personality type (16 types based on 4-axis H/L split at 60) ---

const PERSONALITY_TYPES: Record<string, { name: string; description: string }> = {
  HHHH: {
    name: '突破者（ブレイクスルー）型',
    description:
      '逆境を一時的と捉え、感情に流されず、粘り強く目標を追い続ける。最も高ストレスな環境に適性がある"鉄人"タイプ。',
  },
  HHHL: {
    name: '静かな継続者型',
    description:
      '目立たないが、黙々とやり続ける安定感がある。競争より自分のペースで確実に積み上げるタイプ。',
  },
  HHLH: {
    name: '情熱戦士型',
    description:
      '目標への情熱が強く粘り強いが、批判や拒絶に敏感。仲間の支えがあると爆発的に伸びるタイプ。',
  },
  HHLL: {
    name: '堅実マイペース型',
    description:
      '自分のやるべきことを淡々とこなす。プレッシャーの少ない環境で持続的に成果を出す。',
  },
  HLHH: {
    name: '瞬発アタッカー型',
    description:
      '立ち直りが早く打たれ強いが、飽きやすい。短期集中型のプロジェクトで真価を発揮する。',
  },
  HLHL: {
    name: '楽観サバイバー型',
    description:
      'ストレスに強くポジティブだが、目標への執着は薄い。柔軟な環境で持ち味が活きる。',
  },
  HLLH: {
    name: '野心スプリンター型',
    description:
      '高い目標に向かう意欲はあるが、壁にぶつかると感情が揺れやすい。メンターの存在が鍵。',
  },
  HLLL: {
    name: '自由探索型',
    description:
      '楽観的で好奇心旺盛だが、一つに絞ることが苦手。多様な経験を積む段階で力を発揮する。',
  },
  LHHH: {
    name: '隠れエース型',
    description:
      '実行力は高いが、逆境の捉え方にやや課題あり。成功体験を積めば急成長する可能性大。',
  },
  LHHL: {
    name: '黙々職人型',
    description:
      '与えられた仕事は確実にこなすが、自発的な目標設定が弱い。明確な役割定義がある環境向き。',
  },
  LHLH: {
    name: '繊細エンジン型',
    description:
      'やる気と粘り強さはあるが、メンタルの浮き沈みが大きい。心理的安全性のあるチームで開花する。',
  },
  LHLL: {
    name: '慎重ストイック型',
    description:
      '真面目で努力家だが、悲観的になりやすい。安定した環境で地道に成長するタイプ。',
  },
  LLHH: {
    name: '勝負師型（ムラあり）',
    description:
      '打たれ強く勝ちにこだわるが、継続力に課題。短期の競争環境で一気に結果を出すタイプ。',
  },
  LLHL: {
    name: 'マイペース鈍感型',
    description:
      'ストレスには強いが、目標や継続への意欲が低い。本人の"やりたい"が見つかれば化ける。',
  },
  LLLH: {
    name: 'ガラスの野心家型',
    description:
      '高い目標は持つが、逆境に弱く継続も苦手。手厚いサポートと小さな成功体験の積み重ねが必要。',
  },
  LLLL: {
    name: '探索準備型',
    description:
      'まだ自分の方向性を模索中。高ストレス環境よりも、自己理解を深める経験が今は大切。',
  },
}

export function getPersonalityType(
  OS: number,
  A: number,
  B: number,
  C: number
): { name: string; description: string } {
  const key =
    (OS >= 60 ? 'H' : 'L') +
    (A >= 60 ? 'H' : 'L') +
    (B >= 60 ? 'H' : 'L') +
    (C >= 60 ? 'H' : 'L')
  return PERSONALITY_TYPES[key] ?? { name: '探索準備型', description: 'まだ自分の方向性を模索中。' }
}

// --- SJT behavior tendency analysis ---

const OPTION_TAGS = [
  { tags: ['自力改善', '行動変容'], phrase: '自ら原因を分析し行動を変えていこうとする' },         // A (idx 0)
  { tags: ['フィードバック志向', '関係構築'], phrase: '他者のフィードバックを活かし関係を築く' },  // B (idx 1)
  { tags: ['回避傾向', '自己防衛'], phrase: '困難な状況から距離を置いて自分を守ろうとする' },      // C (idx 2)
  { tags: ['合理化', '俯瞰思考'], phrase: '状況を俯瞰して合理的に捉え直す' },                    // D (idx 3)
]

export function getSJTBehaviorTendency(scenarioAnswers: ScenarioAnswer[]): {
  tag1: string
  tag2: string
  description: string
} {
  const scores = [0, 0, 0, 0]
  for (const ans of scenarioAnswers) {
    for (let i = 0; i < 4; i++) {
      scores[i] += ans.sjtRatings[i] ?? 0
    }
  }
  const ranked = [0, 1, 2, 3].sort((a, b) => scores[b] - scores[a])
  const top1 = ranked[0]
  const top2 = ranked[1]
  const tag1 = OPTION_TAGS[top1].tags[0]
  const tag2 = OPTION_TAGS[top2].tags[0]
  const phrase1 = OPTION_TAGS[top1].phrase
  const phrase2 = OPTION_TAGS[top2].phrase
  return {
    tag1,
    tag2,
    description: `困難な場面で${phrase1}傾向と、${phrase2}傾向が組み合わさっています。`,
  }
}

// --- Extended score descriptions (returns array of paragraphs) ---

export function getOSDescription(score: number): string[] {
  if (score >= 80) {
    return [
      'あなたは逆境を"一時的で、この場面だけの、外的な出来事"として捉える傾向が非常に強いです。心理学者セリグマンの研究では、この思考パターンを持つ営業パーソンは、そうでない人と比べて37%多くの成果を上げ、離職率は半分以下でした。',
      'あなたの強みは、失敗しても「次は違う結果になる」と自然に考えられること。これは訓練で身につけるのが難しい、生来の資質に近いものです。',
      'ただし、楽観性が高すぎると「反省しない」と見られるリスクもあります。失敗から学ぶ姿勢を意識的に見せることで、周囲の信頼がさらに厚くなります。',
    ]
  }
  if (score >= 60) {
    return [
      '逆境への捉え方は比較的健全です。落ち込むことはあっても、数日で立て直せるレベル。多くの成功者がこのゾーンに位置しています。',
      'あなたの特徴は、"適度に悲観的"であること。これは楽観一辺倒の人よりもリスク察知能力が高いことを意味します。',
      '一方で、失敗が連続すると一時的に視野が狭くなることがあります。信頼できる人に話を聞いてもらう習慣を持つと、回復スピードが上がります。',
    ]
  }
  if (score >= 35) {
    return [
      '逆境が起きたとき、「自分のせいだ」「これはずっと続く」と感じやすい傾向があります。これは珍しいことではなく、多くの人がこのゾーンにいます。',
      '重要なのは、この傾向は固定的なものではないということ。セリグマンの研究では、帰属スタイルは認知行動的なトレーニングで改善できることが実証されています。',
      'あなたに合う環境は、失敗を責めずに「次どうするか」にフォーカスするチーム。上司やメンターからのこまめなフィードバックがあると、本来の力を発揮しやすくなります。',
    ]
  }
  return [
    '逆境を"自分のせいで、ずっと続く、人生全体に影響する"と捉えやすい傾向が強めに出ています。このパターンは、心理学で"悲観的帰属スタイル"と呼ばれます。',
    'これは能力の問題ではありません。物事の捉え方のクセであり、意識的に変えていくことができます。認知行動療法（CBT）の手法が特に有効です。',
    '今のあなたに最適なのは、心理的安全性が高く、小さな成功体験を積み重ねられる環境です。いきなり高ストレスな環境に飛び込むよりも、まず自信をつけるステップを踏むことをおすすめします。',
  ]
}

export function getAxisADescription(score: number): string[] {
  if (score >= 80) {
    return [
      '目標を決めたら最後までやり抜く"鉄の意志"タイプ。Duckworthのグリット研究では、この特性が学歴やIQよりも長期的成功を予測することが示されています。',
      'あなたの粘り強さは、営業・起業・研究職など、成果が出るまで時間がかかる領域で最大の武器になります。',
      '注意点として、"粘りすぎて撤退判断が遅れる"リスクがあります。定期的に「この努力の方向性は正しいか？」と自問する習慣があるとさらに強くなります。',
    ]
  }
  if (score >= 60) {
    return [
      '十分な粘り強さがあり、明確な目標があれば困難も乗り越えられます。',
      'ただし、目的を見失うとモチベーションが低下しやすい傾向も。「なぜこれをやっているのか」を定期的に言語化する習慣が効果的です。',
      'チームでの目標共有や、マイルストーン設定があなたの粘り強さを最大化します。',
    ]
  }
  if (score >= 40) {
    return [
      '粘り強さは平均的。興味があることには集中できるが、義務感だけでは長続きしにくい傾向です。',
      'これは悪いことではなく、"本当に情熱を持てるもの"を見つけることが重要という意味。Jachimowicz(2018)のPNAS論文では、粘り強さは情熱と組み合わさったときにのみ成果を予測することが示されています。',
    ]
  }
  return [
    '長期的な取り組みよりも、短期で成果が見える環境が合っています。',
    '飽きっぽいのではなく、"常に新しい刺激を求める"というポジティブな特性でもあります。',
    '短期プロジェクト型の仕事や、タスクが頻繁に変わる環境で真価を発揮します。',
  ]
}

export function getAxisBDescription(score: number): string[] {
  if (score >= 80) {
    return [
      '感情の波が小さく、批判や拒絶を受けても冷静でいられるタイプ。営業での断られ体験、上司からの厳しいフィードバックも、必要以上に引きずりません。',
      'この特性は訪問営業やクレーム対応など、対人ストレスの高い業務で大きなアドバンテージです。',
      '一方で、"鈍感すぎて周囲の感情に気づけない"というリスクも。チームメンバーの気持ちに意識的に目を向けると、リーダーとしての信頼度がさらに上がります。',
    ]
  }
  if (score >= 60) {
    return [
      'ストレスへの耐性は十分。感情が動くことはあっても、自分でコントロールできる範囲です。',
      '適度な感受性はむしろ強みで、他者の気持ちを理解する力にもつながっています。',
      'ストレスが積み重なったときのリセット方法（運動、趣味、信頼できる人との会話）を持っておくとさらに安定します。',
    ]
  }
  if (score >= 40) {
    return [
      '批判やストレスにやや敏感で、嫌なことを引きずりやすい傾向があります。これは"共感力が高い"という裏返しでもあり、人の気持ちに寄り添える強みです。',
      '営業など拒絶が日常の環境では消耗しやすいため、心理的に安全なチーム環境や、定期的な1on1での感情のケアがあると本来の力を出せます。',
    ]
  }
  return [
    '感情の揺れが大きく、否定的なフィードバックの影響を受けやすい傾向です。高ストレス環境ではエネルギーの消耗が速く、バーンアウトのリスクがあります。',
    'あなたに合うのは、心理的安全性が確保された環境で、フィードバックが建設的かつ具体的に与えられるチームです。',
    'まずは安心できる場所で力を発揮することを優先してください。',
  ]
}

export function getAxisCDescription(score: number): string[] {
  if (score >= 80) {
    return [
      '"勝ちたい""上に行きたい"という欲求が強く、競争環境で最も力を発揮するタイプ。成果報酬型の営業、スタートアップでのポジション争いなど、勝ち負けが明確な環境がフィットします。',
      '注意点として、勝利への執着が強すぎるとチーム内の協調性に影響することも。"個人で勝つ"と"チームで勝つ"を両立させる意識があるとさらに強くなります。',
    ]
  }
  if (score >= 60) {
    return [
      '達成意欲は高い水準。目標と報酬が明確であればモチベーションを持続できます。',
      '"何のために頑張るか"が見えている状態がベスト。逆に、目標が曖昧な環境ではエンジンがかかりにくい傾向があるため、自分でマイルストーンを設定する習慣が有効です。',
    ]
  }
  if (score >= 40) {
    return [
      '競争よりも協調や過程を重視する傾向。これは"チームプレイヤー"としての強みでもあります。',
      'ただし、成果主義の強い環境では周囲とのギャップに苦しむ可能性も。あなたの達成動機を引き出すには、"数字で勝つ"より"誰かの役に立つ""チームに貢献する"という動機づけが効果的です。',
    ]
  }
  return [
    '競争や数字に対する欲求は強くなく、安定や人間関係を重視するタイプ。"ガツガツ系"の環境よりも、自分のペースで価値を提供できる環境が合っています。',
    '今の段階では無理に競争環境に身を置くよりも、自分の"好き"や"得意"を見つけることに集中する方が長期的には大きな成果につながります。',
  ]
}

export function getZoneComment(zone: Zone): string {
  if (zone === 'Green') return '高ストレス環境でも自走し、成果を出し続けられる可能性が高いです。営業・スタートアップなどの即戦力候補です。'
  if (zone === 'Yellow') return '基本的なポテンシャルはありますが、一部に課題があります。適切なオンボーディングとメンタリングで十分に活躍できます。'
  return '現時点では高ストレス環境との相性に課題がある可能性があります。本人の志向と環境のマッチングを慎重に検討してください。'
}
