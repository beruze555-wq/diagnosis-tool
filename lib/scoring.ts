import { ScenarioAnswer, Layer2Answers, Scores, DeepAnalysis } from '@/types'
import { scenarios } from '@/lib/scenarios'

export type { DeepAnalysis }

// ─── Core score calculations ───────────────────────────────────────────────────

export function calculateOS(scenarioAnswers: ScenarioAnswer[]): number {
  const allAttributions = scenarioAnswers.flatMap((a) => a.attributions)
  const inverted = allAttributions.map((v) => 8 - v)
  const avg = inverted.reduce((sum, v) => sum + v, 0) / inverted.length
  return Math.round((avg * 100) / 7)
}

export function calculateAxisA(axisA: number[]): number {
  // PE（Perseverance of Effort）5項目のみで算出
  // Credé et al. (2017): PE(ρ=.28) は CI(ρ=.10) より成果予測力が高い
  const peIndexes = [1, 3, 5, 6, 8] // A2, A4, A6, A7, A9（全て reversed=false）
  const peSum = peIndexes.reduce((sum, idx) => sum + axisA[idx], 0)
  return Math.round((peSum * 100) / 25)
}

export function calculateCI(axisA: number[]): number {
  // CI（Consistency of Interests）5項目（全て reversed=true）
  const ciIndexes = [0, 2, 4, 7, 9] // A1, A3, A5, A8, A10
  const ciSum = ciIndexes.reduce((sum, idx) => sum + (6 - axisA[idx]), 0)
  return Math.round((ciSum * 100) / 25)
}

export function calculateAxisB(axisB: number[]): number {
  const reversedIdx = [0, 2, 3, 6, 8] // B1,B3,B4,B7,B9 are reverse:true
  const adjusted = axisB.map((v, i) => (reversedIdx.includes(i) ? 6 - v : v))
  const sum = adjusted.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / 50)
}

export function calculateAxisC(axisC: number[]): number {
  const reversedIdx = [1, 3, 5, 7, 9] // C2,C4,C6,C8,C10 are reverse:true
  const adjusted = axisC.map((v, i) => (reversedIdx.includes(i) ? 6 - v : v))
  const sum = adjusted.reduce((a, b) => a + b, 0)
  return Math.round((sum * 100) / 50)
}

export function calculateScores(
  scenarioAnswers: ScenarioAnswer[],
  layer2Answers?: Layer2Answers
): Scores {
  const OS = calculateOS(scenarioAnswers)
  if (!layer2Answers) {
    return { OS, A: 0, B: 0, C: 0 }
  }
  const A = calculateAxisA(layer2Answers.axisA)
  const B = calculateAxisB(layer2Answers.axisB)
  const C = calculateAxisC(layer2Answers.axisC)
  return { OS, A, B, C }
}

// ─── Axis description functions ────────────────────────────────────────────────

export function getOSDescription(score: number): string[] {
  if (score >= 80) {
    return [
      '非常に楽観的な帰属スタイルを持っています。Seligman & Schulman (1986) の保険営業研究では、楽観的帰属スタイルの持ち主は悲観群より37%高い業績を上げました。（本スコアは内的・安定性・全般性の3次元を等重みで合算。Sweeney et al., 1986 のメタ分析で3次元の効果量がほぼ同等であることに基づく）',
      'このスタイルは、困難な出来事に直面した際に「これは一時的なもの」「自分の全てではない」「外的要因も大きい」と捉える傾向を持ちます。結果として、挫折からの立ち直りが早く、継続的な行動を維持しやすいという特徴があります。',
      'ただしWeinstein (1980) が指摘する「非現実的楽観主義」のリスクにも注意が必要です。リスクの過小評価や、フィードバックを軽視する傾向につながる可能性があります。意図的に「悪いシナリオ」を検討する習慣を持つことで、楽観性のメリットを最大化できます。',
    ]
  }
  if (score >= 60) {
    return [
      '適度に楽観的な帰属スタイルです。Peterson et al. (1982) のASQ研究では、このレンジは現実的楽観主義として最も適応的とされています。',
      '良い出来事も悪い出来事も、バランスよく解釈できる傾向があります。過度に悲観的でも楽観的でもない、現実に即した判断ができるスタイルです。',
      '高ストレス環境においても一定のパフォーマンスを維持できる基盤があります。さらに楽観方向に伸ばすことで、挑戦的な環境でより力を発揮できるようになります。',
    ]
  }
  if (score >= 35) {
    return [
      '帰属スタイルに揺らぎがある状態です。良い出来事に対しては楽観的に解釈できますが、悪い出来事に直面すると悲観的な解釈に傾きやすい傾向があります。',
      'Peterson et al. (1982) のASQ研究では、このレンジの帰属スタイルは「可変域」にあり、環境と介入によって楽観方向にも悲観方向にもシフトする可能性があることが示されています。',
      '最初の90日間は「成功体験を意図的に作る」オンボーディング設計が効果的です。週1回の1on1で、出来事の解釈パターンをメンターと一緒に振り返ることで、楽観的帰属を強化できます (Seligman, 1991)。',
    ]
  }
  return [
    '現時点では出来事の原因を永続的・全般的・内的に帰属させやすい傾向があります。Abramson et al. (1978) の理論では、この帰属パターンは学習された思考習慣であり、変更可能です。',
    'Seligman (1986) の帰属スタイル研究では、このパターンが持続するとストレス下でのパフォーマンス低下と関連することが示されています。重要なのは、帰属スタイルは「性格」ではなく「思考の習慣」だということです。',
    '日々の出来事について「原因は一時的か永続的か」「この領域だけの問題か全般的か」を意識的に書き出すジャーナリング (Seligman, 1991) が効果的です。また、メンターとの定期的な対話で帰属の偏りに気づく機会を作ることを推奨します。',
  ]
}

export function getAxisADescription(score: number): string[] {
  if (score >= 80) {
    return [
      '極めて高い持続的努力（PE）の傾向を持っています。Credé et al. (2017) のメタ分析では、PE（ρ=.28）は成果予測力が高く、特に困難な状況でのやり遂げる力と強く関連します。一度決めたことをやり遂げる力は大きな強みです。',
      'ただし、一つのことへの強い固執は時に「損切り」が遅れるリスクもあります。状況が変わったときに柔軟に方向転換する判断力も併せ持つことで、持続的努力がより効果的に機能します。',
    ]
  }
  if (score >= 60) {
    return [
      '十分な持続的努力（PE）の基盤があります。Credé et al. (2017) によれば、このレンジのPEスコアは適応的な範囲にあり、環境次第でさらに伸びる余地があります。',
      '長期的なプロジェクトにも一定の持続力を発揮できる状態です。興味のある領域での持続力は特に高く、環境や動機付けによってさらに強化される可能性があります。',
    ]
  }
  if (score >= 40) {
    return [
      '持続的努力（PE）にはまだ伸びしろがあります。Jachimowicz et al. (2018) は、努力の持続は「情熱の調和」とセットで機能することを示しました。まず興味を持てる領域を見つけることが先決です。',
      '短期目標を設定して達成する経験を繰り返すことで、持続力の基盤を育てることができます。小さな完了体験の積み重ねが、長期的な持続的努力を形成します (Duckworth, 2016)。',
    ]
  }
  return [
    '現時点では長期的な継続に課題を感じやすい傾向です。Credé et al. (2017) の研究が示すように、持続的努力（PE）は後天的に伸ばせる特性です。',
    '小さな目標を設定し、達成経験を積み重ねることが効果的です (Duckworth, 2016)。興味のある分野から始め、「やり遂げた」という感覚を積み上げることで、持続力は確実に向上します。',
  ]
}

export function getAxisBDescription(score: number): string[] {
  if (score >= 80) {
    return [
      '非常に高い情緒安定性を持っています。Costa & McCrae (1992) のBig Five研究では、情緒安定性はほぼ全ての職種でパフォーマンスと正の相関を持つ数少ない特性として確認されています。',
      'プレッシャー下でも冷静さを保ち、感情に流されない判断ができる力は、特に高ストレス環境での大きなアドバンテージです。Luthans et al. (2007) のPsyCap研究でも、高い情緒安定性はチームの「アンカー」として機能することが示されています。',
    ]
  }
  if (score >= 60) {
    return [
      '十分な情緒安定性の基盤があります。日常的なストレスに対してバランスよく対処できる状態です。',
      'Gross (1998) の感情制御研究によれば、このレンジは適応的な範囲にあります。強いプレッシャー場面での感情制御をさらに磨くことで、より高いパフォーマンスが期待できます。',
    ]
  }
  if (score >= 40) {
    return [
      '情緒安定性にまだ伸びしろがあります。ストレス下での感情の揺れが、パフォーマンスに影響しやすい状態です。',
      'Gross (1998) の感情制御研究では、認知的再評価（Cognitive Reappraisal）のトレーニングが長期的に効果的であることが示されています。マインドフルネス実践が3ヶ月で有意な効果を示すことも報告されています (Gross & John, 2003)。',
    ]
  }
  return [
    '現時点では感情の揺れが大きく、ストレス下でのパフォーマンスへの影響が出やすい傾向です。Costa & McCrae (1992) の研究では、この状態は適切なサポートがある環境で改善できることが示されています。',
    '信頼できるメンターや相談相手を確保し、感情面のサポート体制を整えることが最優先です。心理的安全性の高い環境を選ぶことが、能力を発揮するための前提条件になります。',
  ]
}

export function getAxisCDescription(score: number): string[] {
  if (score >= 80) {
    return [
      '非常に高い達成動機を持っています。McClelland (1961) の研究では、高い達成動機は起業家的行動、営業成績、リーダーシップ発揮と強い正の相関を持つことが繰り返し確認されています。',
      '挑戦的な環境での高いパフォーマンスが期待できます。Atkinson (1957) の期待-価値理論では、達成動機が高い人は「成功確率50%」程度の適度に困難な課題で最もモチベーションが上がることが示されています。',
    ]
  }
  if (score >= 60) {
    return [
      '十分な達成動機の基盤があります。挑戦への前向きな姿勢と、失敗への適度な耐性がバランスよく備わっています。',
      'Lang & Fries (2006) のAMS-R研究では、このレンジのスコアは「成功接近動機」と「失敗回避動機」のバランスが取れた状態とされています。',
    ]
  }
  if (score >= 40) {
    return [
      '達成動機にまだ伸びしろがあります。Lang & Fries (2006) のAMS-R研究では、Fear of Failure（失敗回避動機）がHope of Success（成功接近動機）を上回ると、挑戦を避ける行動パターンが強化されることが確認されています。',
      '段階的な目標設定（Locke & Latham, 2002）が最も効果的です。現在の実力の110%程度の課題を意図的に設定し、達成時の承認を明確にすることで、「挑戦→成功→快感」のサイクルを構築してください。',
    ]
  }
  return [
    '現時点では挑戦への意欲が控えめで、失敗回避の傾向が強く出ています。McClelland (1961) の達成動機理論では、達成動機は「成功体験の蓄積」と「適度な難易度の課題設定」によって後天的に強化されることが示されています。',
    'まずは「確実に達成できる小さな目標」から始め、成功体験を積み重ねてください。達成感の積み上げが、より大きな挑戦への動機づけにつながります。',
  ]
}


// ─── Personality types ─────────────────────────────────────────────────────────

export const PERSONALITY_TYPES: Record<string, {
  name: string
  icon: string
  themeFrom: string
  themeTo: string
  paragraphs: string[]
}> = {
  HHHH: {
    name: '突破者型',
    icon: '⚡',
    themeFrom: 'from-yellow-500',
    themeTo: 'to-orange-500',
    paragraphs: [
      '逆境を一時的・外的に捉え、粘り強く取り組み、感情が安定し、挑戦への意欲も高い四拍子揃った"鉄人"タイプ。困難な環境でも自走し続ける力を持っています。',
      '高ストレス環境でこそ真価を発揮します。断られ続けても諦めない営業力、資金繰りが厳しくても次の一手を打ち続ける起業家精神、チームが疲弊しても最後まで引っ張るリーダーシップ。Seligman(1986)の研究が示すように、このプロファイルは持続的な高パフォーマンスと強く関連します。',
      '自分の基準を他者にも求めすぎるリスクがあります。"なぜ皆もっと頑張れないのか"というフラストレーションが、チームの心理的安全性を損なう可能性も。共感力を意識的に発揮することがリーダーとしての次の課題です。',
      '裁量権が大きく成果主義で不確実性が高い環境が最適。新規開拓営業、スタートアップ創業期、困難なプロジェクトのリーダー—「頑張った分だけ報われる」舞台で最大の輝きを見せます。',
    ],
  },
  HHHL: {
    name: '安定遂行型',
    icon: '🛡️',
    themeFrom: 'from-blue-400',
    themeTo: 'to-blue-600',
    paragraphs: [
      '逆境に強く粘り強く感情も安定しているが、挑戦への欲求はほどほど。「まあこれくらいでいい」というバランス感覚と、黙々と継続する力が持ち味の"堅実ランナー"タイプ。',
      '一定のクオリティを長期間維持できる力が強みです。急がず着実に積み上げるスタイルで信頼を獲得します。長期プロジェクト、継続的な顧客対応、品質が重要な業務で本領を発揮します。',
      'ポテンシャルに見合った評価を得にくいことがあります。達成意欲が低いため自分から手を挙げることが少なく、「もっとできるのに」と周囲からもどかしく思われることも。成果を言語化して発信する意識が重要です。',
      '安定した業務フロー、長期的な関係構築が重要なポジションが最適。カスタマーサクセス、ルート営業、品質管理—「継続的な貢献が正当に評価される」組織文化の中で輝きます。',
    ],
  },
  HHLH: {
    name: '情熱猪突型',
    icon: '🔥',
    themeFrom: 'from-red-500',
    themeTo: 'to-orange-500',
    paragraphs: [
      '逆境に強く高い挑戦意欲を持ちながら、感情の波が激しいタイプ。"絶対やり遂げてやる"という使命感が行動の原動力で、壁にぶつかったときの激しさも人一倍です。',
      '目標が明確なときの推進力は圧倒的。「これを成し遂げたい」という情熱がチームを巻き込み、逆境でも諦めない姿勢がエンジンになります。Duckworth(2016)が示すように、情熱と粘り強さが組み合わさるとき、最大の力を発揮します。',
      '感情の揺れが成果の揺れに直結しやすい。ネガティブなフィードバックや人間関係のトラブルで一時的に大きく消耗するリスクがあります。感情のセルフモニタリングと、信頼できる相談相手の存在が重要です。',
      'ビジョンに共感できるチーム、心理的安全性のある組織、こまめな承認とフィードバックがある環境で最大の力を発揮します。「なぜやるのか」が明確な仕事—使命感を感じられる製品や事業が合います。',
    ],
  },
  HHLL: {
    name: '楽観持久型',
    icon: '🌊',
    themeFrom: 'from-cyan-400',
    themeTo: 'to-blue-500',
    paragraphs: [
      '逆境に強く粘り強いが、感情の安定性と挑戦意欲は控えめ。「なんとかなる」という楽観性と、黙々と続ける力が組み合わさる、安定した"持久走"タイプ。',
      '地道な積み上げを長期間続けられる力があります。感情の揺れがあっても楽観性と持続力でカバーし、安定したアウトプットを維持します。長期的な関係構築、継続的な業務改善が求められる仕事で真価を発揮します。',
      '挑戦意欲と情緒安定性が控えめなため、変化の激しい環境や強いプレッシャー下ではパフォーマンスが落ちやすい。また「もっと高い目標を持てば」と周囲から物足りなく見られることもあります。',
      'プレッシャーが少なく安定した業務フローのある組織が最適。バックオフィス業務、運用・保守、継続的な顧客フォロー—「継続性と安定性が重視される」役割で輝きます。',
    ],
  },
  HLHH: {
    name: '戦略挑戦型',
    icon: '🎯',
    themeFrom: 'from-purple-500',
    themeTo: 'to-pink-500',
    paragraphs: [
      '楽観的で情緒安定性と挑戦意欲が高いが、継続力にまだ伸びしろがある"器用貧乏"型。素早い適応力と高い達成意欲を持ちながら、長期的なコミットが課題。',
      '新しい環境への適応が早く、戦略的に状況を読んで行動できます。感情が安定しているため失敗しても素早く立て直せます。コンサルティング、プロジェクト立ち上げ、新しいマーケット開拓など変化の多い場面で力を発揮します。',
      '飽き性の傾向があり「始めては辞める」パターンに陥りやすい。短期で結果が出ないと別の興味に移ってしまうことで、深い専門性が積み上がりにくい場合があります。Jachimowicz et al.(2018)が示すように、情熱の焦点化が継続力を高めます。',
      '変化が多く短期サイクルで結果が見える仕事が合います。新規事業開発、コンサルティング、スタートアップのグロース期—定期的なメンタリングがあると継続力が補完されます。',
    ],
  },
  HLHL: {
    name: '慎重楽観型',
    icon: '🌤️',
    themeFrom: 'from-amber-300',
    themeTo: 'to-yellow-500',
    paragraphs: [
      '楽観的で情緒も安定しているが、継続力と挑戦意欲は控えめ。「失敗してもまあいいか」という軽やかさと「無理なことはしない」という現実的な判断力を持つ"マイペース安定型"。',
      '感情的に動じにくく、人間関係を長期的に安定して維持できる力が強み。プレッシャーの少ない環境で一定のパフォーマンスを出し続けます。コミュニティ運営、継続的な顧客対応、チームの潤滑油的役割で真価を発揮します。',
      '挑戦意欲と継続力の両方が控えめなため、成長機会を自ら掴みに行くことが少ない傾向があります。また「もっとできる」というポテンシャルが外からわかりにくいため、評価されにくいことも。',
      '安定した人間関係と明確な役割定義がある組織が最適。ホスピタリティ、コミュニティマネジメント、カスタマーサポート—「継続的なケア」が求められる役割で活躍します。',
    ],
  },
  HLLH: {
    name: '直感突撃型',
    icon: '🚀',
    themeFrom: 'from-rose-500',
    themeTo: 'to-red-600',
    paragraphs: [
      '楽観的で挑戦意欲が高いが、継続力と情緒安定性に伸びしろがある"スプリンター"型。「まずやってみる」という直感的な行動力が最大の武器。感情は揺れやすいが楽観性で立て直せる。',
      '新しいことへの飛び込み力と挑戦意欲の高さが組み合わさり、スタートアップや新規事業の立ち上げフェーズで圧倒的な推進力を発揮します。楽観性が失敗からの素早い立て直しを助けます。',
      '感情の揺れと継続力の弱さが重なると「始めては辞める」パターンに陥りやすい。困難が続くと一時的に大きく消耗し、立て直しに時間がかかることも。定期的なメンタリングが成否を左右します。',
      '短期集中のプロジェクト、スタートアップの立ち上げ期、新しい市場開拓など、スピードと挑戦意欲が求められる環境が合います。メンターや伴走者がいると継続力が大きく補強されます。',
    ],
  },
  HLLL: {
    name: '楽天自由型',
    icon: '🎈',
    themeFrom: 'from-pink-300',
    themeTo: 'to-rose-400',
    paragraphs: [
      '楽観的だが、継続力・情緒安定性・挑戦意欲すべてに伸びしろがある"ゆる旅人"型。「人生なんとかなる」という根拠のある楽観主義で、自分のペースで生きていくタイプ。',
      '場の空気を和ませる力と、固定観念にとらわれない発想の柔軟性が強みです。楽観性がチームの重い雰囲気を切り替え、アイデア出しの場を活性化します。まだ何かに特化していないからこそ多様な視点を持てる。',
      '継続力・安定性・挑戦意欲が揃って控えめなため、プレッシャーの強い環境では早期離脱のリスクが高い。「なんとなく続けている」状態が長く続くと、成長機会を逃してしまいます。',
      'まずは自己理解を深める探索期と捉え、多様な経験を積める環境を選んでください。ジョブローテーション、マルチタスク型の業務、短期インターン—「試行錯誤が許容される文化」の中で自分の情熱を見つけることが先決です。',
    ],
  },
  LHHH: {
    name: '堅実努力型',
    icon: '💎',
    themeFrom: 'from-emerald-500',
    themeTo: 'to-teal-600',
    paragraphs: [
      '逆境への耐性はやや弱いが、粘り強く感情も安定していて挑戦意欲も高い"ダイヤモンド原石"型。失敗を必要以上に深刻に受け取りやすいが、諦めずに努力し続けられる本物の継続力を持つ。',
      '高い達成意欲と粘り強さと情緒安定性の三位一体が、長期的な目標達成において大きな強みになります。困難でも丁寧に粘り強く取り組む姿勢が、周囲からの信頼を着実に積み上げます。',
      '逆境帰属スタイルの弱さから、失敗を「自分のせい」と捉えすぎる傾向。うまくいかない時期が続くと自己批判が強まり、悪循環に陥るリスクがあります。Seligman(1991)の学習性楽観主義の手法が特に効果的です。',
      '成功体験を意図的に設計できる環境が最適。こまめなポジティブフィードバック、最初の90日での小さな勝利体験—「あなたの努力が正しい方向に向いている」という承認が、このタイプの力を最大化します。',
    ],
  },
  LHHL: {
    name: '忍耐守備型',
    icon: '🏔️',
    themeFrom: 'from-stone-400',
    themeTo: 'to-gray-600',
    paragraphs: [
      '逆境に弱く挑戦意欲も控えめだが、粘り強く感情が安定している"石の守備型"。目の前のことを丁寧にやり続ける実直さが最大の武器。派手さはないが確実に積み上げる。',
      '与えられた役割を高い精度で長期間維持できる信頼性が最大の強みです。粘り強さと感情の安定が組み合わさることで、品質管理・継続的な業務遂行・長期的なオペレーション管理で特に力を発揮します。',
      '逆境で「自分はダメだ」と感じやすく、挑戦意欲も低いため、変化の多い環境では意欲を失いやすい。自律性を強く求められる環境とは相性が悪い場合があります。',
      '役割と期待値が明確に定義された組織が最適。マニュアルが整備された業務環境、定型業務の高品質化、オペレーション管理—「実直さが正当に評価される文化」の職場で輝きます。',
    ],
  },
  LHLH: {
    name: '闘志内燃型',
    icon: '🌋',
    themeFrom: 'from-orange-600',
    themeTo: 'to-red-700',
    paragraphs: [
      '逆境への耐性と情緒安定性に伸びしろがあるが、粘り強く高い挑戦意欲を持つ"休火山"型。感情は揺れやすいが「それでも諦めない」という内なる闘志が燃えている。',
      'やる気と継続力の組み合わせが、目標達成への強い推進力を生みます。情熱的に取り組む姿勢がチームを鼓舞し、長期的な成果につながります。感受性の高さは顧客の課題を深く理解する力にもなります。',
      '感情の揺れと逆境での自己批判が重なると、大きく消耗するリスクがあります。困難が続く場面では、感情面のサポートがなければ実力を発揮しきれないことも。一人で抱え込まず、信頼できる相談相手を持つことが重要です。',
      '心理的安全性の高いチーム、共感的なリーダー、定期的な1on1がある環境で最大の力を発揮します。使命感を持てる仕事、感受性を強みに変えられる対人業務が最適です。',
    ],
  },
  LHLL: {
    name: '寡黙継続型',
    icon: '🐢',
    themeFrom: 'from-green-600',
    themeTo: 'to-emerald-800',
    paragraphs: [
      '逆境に弱く感情も揺れやすく挑戦意欲も控えめだが、粘り強さだけは本物の"亀継続型"。「黙々と続ける」という一点突破の力で、周囲が気づかないうちに成果を積み上げる。',
      '継続力という稀有な強みを持っています。地道な仕事を長期間続けられる力は多くの人が持っていない特性。特に専門性を深める仕事や、長期的な関係構築が必要な業務で大きな価値を発揮します。',
      '逆境・感情・挑戦意欲の三軸が控えめなため、高ストレス・高変化の環境では消耗が激しい。環境選びが人生の分岐点になります。「続けることで価値が生まれる」環境を選ぶことが最重要です。',
      '安定した環境で専門性を深められるポジションが最適。研究職、技術職、専門職—「継続することが価値」になる仕事で黙々と積み上げることが、最大のパフォーマンスにつながります。',
    ],
  },
  LLHH: {
    name: '冷静分析型',
    icon: '🔬',
    themeFrom: 'from-indigo-400',
    themeTo: 'to-violet-600',
    paragraphs: [
      '逆境への耐性と継続力に伸びしろがあるが、感情が安定していて挑戦意欲が高い"クールアナリスト"型。感情に流されず論理的に状況を分析し、高い目標を追い続ける。',
      '感情的な安定性と挑戦意欲の組み合わせが、データや論理を駆使した問題解決で力を発揮します。プレッシャー下でも冷静な判断ができる力は希少で、意思決定や分析が求められる業務で真価を発揮します。',
      '逆境で「自分のせい」と思いやすく継続力に課題があるため、失敗が続く場面では意欲を失いやすい。また分析が先行して「完璧な計画を立てるが実行が遅い」パターンに陥ることも。',
      '分析・研究・戦略立案・コンサルティングなど、論理的思考と挑戦意欲を活かせる仕事が合います。成功体験の設計と定期的な承認がある環境で、分析力が最大限に発揮されます。',
    ],
  },
  LLHL: {
    name: '受容安定型',
    icon: '🌿',
    themeFrom: 'from-lime-400',
    themeTo: 'to-green-500',
    paragraphs: [
      '逆境耐性と継続力に伸びしろがあり、挑戦意欲も控えめだが、感情が非常に安定している"静水型"。波を立てない穏やかさがチームの安心感を生む。',
      '感情の安定がチームの心理的安全性に貢献します。プレッシャーがかかっても冷静さを保つ姿勢が周囲に安心感をもたらします。チームサポート、調整役、社内コミュニケーションの場で特に力を発揮します。',
      '挑戦意欲と継続力が控えめなため、成長機会を自ら掴みに行くことが少ない傾向。「受け身」の姿勢が続くと、能力に対して正当な評価を受けにくいリスクがあります。',
      '明確な役割定義と期待値がある組織が最適。人間関係の質が高いチーム、協力的な雰囲気の職場—「感情の安定が資産になる」環境で輝きます。',
    ],
  },
  LLLH: {
    name: '野心原石型',
    icon: '💡',
    themeFrom: 'from-amber-500',
    themeTo: 'to-orange-600',
    paragraphs: [
      '逆境耐性・継続力・情緒安定性すべてに伸びしろがあるが、挑戦意欲だけは本物の"荒削りダイヤ"型。「大きなことを成し遂げたい」という燃える野心が、唯一の強力なエンジン。',
      '高い達成意欲は、適切な環境と支援があれば大きな可能性を開きます。McClelland(1961)の達成動機研究でも、強い達成動機を持つ人は適度な難易度の課題で最高のパフォーマンスを発揮することが示されています。「やりたい」という意志は最強の成長エンジンです。',
      '3軸が弱い状態で高い野心を追うと、挫折した際の回復が遅れるリスクがあります。「夢は大きいが実現できない」という繰り返しが自己否定につながらないよう、段階的な目標設定が必須です。',
      '手厚いメンタリング、明確な成長パス、段階的な目標設定がある環境が最適。「守られながら挑戦できる」—インターン制度、メンター付きプログラム—段階的に成功体験を積むことで、可能性が開花します。',
    ],
  },
  LLLL: {
    name: '模索探求型',
    icon: '🧭',
    themeFrom: 'from-slate-400',
    themeTo: 'to-gray-500',
    paragraphs: [
      '全ての軸に伸びしろがある、自分の方向性をまだ探している"白地図型"。「能力がない」のではなく「まだ土俵が見つかっていない」状態。先入観がない分、可能性は無限大。',
      'まだ何かに特化していない白地図の状態だからこそ、多様な視点と柔軟な発想力が持ち味になりえます。ゼロベースで物事を考える力、固定観念にとらわれない創造性は探索期における稀有な資産です。',
      '全ての軸が低いため、高ストレス・高プレッシャーの環境への早期の配置はリスクが高い。方向性が定まっていないため「自分は何がしたいのか」という問いに答えられないまま時間が経つと、焦りが増すリスクがあります。',
      'まず自己理解を深める経験を積める環境が最適。心理的安全性が高く試行錯誤が許容される文化—複数の職種を経験できるインターン、メンター制度付き研修—で「何が自分に合うか」を探索することから始めてください。',
    ],
  },
}

export function getPersonalityType(OS: number, A: number, B: number, C: number): {
  name: string
  icon: string
  themeFrom: string
  themeTo: string
  paragraphs: string[]
} {
  const key =
    (OS >= 60 ? 'H' : 'L') +
    (A >= 60 ? 'H' : 'L') +
    (B >= 60 ? 'H' : 'L') +
    (C >= 60 ? 'H' : 'L')
  return PERSONALITY_TYPES[key] ?? PERSONALITY_TYPES.LLLL
}

// ─── Tag labels ────────────────────────────────────────────────────────────────

export const TAG_LABELS: Record<string, string> = {
  'proactive': '主体的行動',
  'feedback-seeking': 'フィードバック志向',
  'team-oriented': 'チーム志向',
  'analytical': '分析的思考',
  'emotion-regulation': '感情制御',
  'help-seeking': '援助要請',
  'avoidant': '慎重判断',
  'rigid': '一貫追求',
}

// ─── SJT behavior tendency ────────────────────────────────────────────────────

export function getSJTBehaviorTendency(scenarioAnswers: ScenarioAnswer[]): {
  label: string
  topTags: [string, string]
  tagCounts: Record<string, number>
  description: string
} {
  const tagScores: Record<string, number> = {
    'proactive': 0,
    'feedback-seeking': 0,
    'team-oriented': 0,
    'analytical': 0,
    'emotion-regulation': 0,
    'help-seeking': 0,
    'avoidant': 0,
    'rigid': 0,
  }

  for (let si = 0; si < scenarioAnswers.length; si++) {
    const answer = scenarioAnswers[si]
    const scenario = scenarios[si]
    if (!scenario) continue
    for (let oi = 0; oi < scenario.sjtOptions.length; oi++) {
      const option = scenario.sjtOptions[oi]
      const rating = answer.sjtRatings[oi] ?? 0
      for (const tag of option.tags) {
        if (tag in tagScores) {
          tagScores[tag] += rating
        }
      }
    }
  }

  const sorted = Object.entries(tagScores).sort((a, b) => b[1] - a[1])
  const tag1 = sorted[0][0]
  const tag2 = sorted[1][0]

  const label = `${TAG_LABELS[tag1] ?? tag1}×${TAG_LABELS[tag2] ?? tag2}型`

  let description = ''
  if (tag1 === 'avoidant') {
    description = '慎重で丁寧なアプローチを好む傾向があります。リスクを見極めてから行動するスタイルで、慎重な判断力が強みです。焦らず状況を整理してから動く姿勢は、失敗を防ぐ力になります。'
  } else if (tag1 === 'rigid') {
    description = '一度決めた方針を貫く一貫性がある傾向があります。信念を持って物事を推進する力が強みで、ぶれない軸がチームの安定につながります。'
  } else if (tag1 === 'proactive' && tag2 === 'analytical') {
    description = '主体的に行動しながら、論理的に状況を分析して動くバランス型です。自ら動きながらも感情ではなくデータや根拠で判断する力が、成果を継続させる基盤になります。'
  } else if (tag1 === 'proactive' && tag2 === 'feedback-seeking') {
    description = '自ら行動を起こしながら、他者からのフィードバックを積極的に求める傾向があります。高い自律性と学習意欲の組み合わせが、成長スピードを加速させます。'
  } else if (tag1 === 'feedback-seeking' && tag2 === 'analytical') {
    description = '他者からの意見を積極的に取り込み、論理的に改善策を考えるタイプです。聞く力と分析力の組み合わせが、着実な成長を支えます。'
  } else if (tag1 === 'team-oriented') {
    description = 'チームの状況や仲間の感情を優先して動く傾向があります。協調性と共感力が強みで、チームの信頼を育む力があります。'
  } else if (tag1 === 'emotion-regulation') {
    description = '感情をコントロールしながら冷静に行動する傾向があります。プレッシャー下でも落ち着いて対処できる力が、安定したパフォーマンスを生みます。'
  } else {
    description = `${TAG_LABELS[tag1] ?? tag1}と${TAG_LABELS[tag2] ?? tag2}の傾向が強く出ています。この組み合わせは、状況に応じた柔軟な判断力と行動力を示しています。`
  }

  return {
    label,
    topTags: [tag1, tag2],
    tagCounts: tagScores,
    description,
  }
}

// ─── Deep analysis ─────────────────────────────────────────────────────────────

export function calculateDeepAnalysis(
  scenarioAnswers: ScenarioAnswer[],
  layer2Answers: Layer2Answers
): DeepAnalysis {
  const { axisA, axisB, axisC, axisD } = layer2Answers

  function countHighRatedTag(tag: string): number {
    let count = 0
    for (let si = 0; si < scenarioAnswers.length; si++) {
      const answer = scenarioAnswers[si]
      const scenario = scenarios[si]
      if (!scenario) continue
      for (let oi = 0; oi < scenario.sjtOptions.length; oi++) {
        const option = scenario.sjtOptions[oi]
        const rating = answer.sjtRatings[oi] ?? 0
        if (option.tags.includes(tag) && rating >= 4) {
          count++
        }
      }
    }
    return count
  }

  // Self-efficacy: D1, D2, D7, D8, D9 の5項目平均 × 100/5
  // Chen et al. (2001) NGSE α=.86 に基づき5項目化（A7除外）
  const seIndexes = [0, 1, 6, 7, 8] // D1, D2, D7, D8, D9
  const seSum = seIndexes.reduce((sum, idx) => sum + axisD[idx], 0)
  const selfEfficacy = Math.round((seSum / 5) * (100 / 5))

  // Autonomous motivation: (D3raw + (6-D4raw)) / 2 * 100/5
  const autonomousMotivation = Math.round(((axisD[2] + (6 - axisD[3])) / 2) * (100 / 5))

  // Growth mindset: (D5raw + (6-D6raw)) / 2 * 100/5
  const growthMindset = Math.round(((axisD[4] + (6 - axisD[5])) / 2) * (100 / 5))

  // Learning agility: feedback-seeking count * 15 + B6raw * 10, clipped to 100
  const learningAgility = Math.min(
    100,
    countHighRatedTag('feedback-seeking') * 15 + axisB[5] * 10
  )

  // Crisis response: emotion-regulation count * 10 + analytical count * 10 + B5raw * 8, clipped
  const crisisResponse = Math.min(
    100,
    countHighRatedTag('emotion-regulation') * 10 +
      countHighRatedTag('analytical') * 10 +
      axisB[4] * 8
  )

  // Team contribution: team-oriented count * 15 + help-seeking count * 10, clipped
  const teamContribution = Math.min(
    100,
    countHighRatedTag('team-oriented') * 15 + countHighRatedTag('help-seeking') * 10
  )

  const consistencyOfInterest = calculateCI(axisA)

  return {
    selfEfficacy,
    autonomousMotivation,
    growthMindset,
    learningAgility,
    crisisResponse,
    teamContribution,
    consistencyOfInterest,
  }
}

// ─── Deep analysis description functions ──────────────────────────────────────

export function getSelfEfficacyDescription(score: number): string {
  if (score >= 80) {
    return '高い自己効力感を持っています。新しい分野でも「自分ならやれる」という確信があり、挑戦的な環境への適応が早い傾向があります (Bandura, 1997)。'
  }
  if (score >= 50) {
    return '中程度の自己効力感です。経験のある領域では自信を持てますが、未知の領域では不安を感じやすい場合があります。成功体験の積み重ねで向上します (Chen et al., 2001)。'
  }
  return '自己効力感にまだ伸びしろがあります。Bandura (1997) が示す4つの情報源のうち、達成体験を意図的に積むことが最も効果的です。'
}

export function getAutonomousMotivationDescription(score: number): string {
  if (score >= 80) {
    return '強い内発的動機で動いています。報酬や評価がなくても、活動そのものに価値を見出せる傾向があり、長期的なパフォーマンスの持続性が高いです (Deci & Ryan, 2000)。'
  }
  if (score >= 50) {
    return '動機の質は中程度です。内発的な興味と外的な報酬の両方がモチベーション源になっています。SDT研究では、自律性を支援する環境が内発的動機を強化します (Ryan & Deci, 2000)。'
  }
  return '現時点では外的な動機への依存度が高い傾向です。Deci & Ryan (2000) の研究では、自律性・有能感・関係性の3つの基本的欲求が満たされることで、内発的動機が育つことが示されています。'
}

export function getGrowthMindsetDescription(score: number): string {
  if (score >= 80) {
    return '強い成長マインドセットを持っています。能力は努力で変えられるという信念があり、困難を「学習機会」として捉える傾向があります (Dweck, 2006)。フィードバックを成長の糧にできる力は大きな強みです。（※ 大規模メタ分析で効果量は小さいとの報告あり: Sisk et al., 2018, r=.10。参考指標としてお読みください）'
  }
  if (score >= 50) {
    return '中程度の成長マインドセットです。努力の価値は理解していますが、特定の領域では「才能の壁」を感じることがあるかもしれません。Blackwell et al. (2007) の研究では、成長マインドセットの介入が成績向上に直結することが示されています。（※ 大規模メタ分析で効果量は小さいとの報告あり: Sisk et al., 2018, r=.10。参考指標としてお読みください）'
  }
  return '現時点では固定マインドセットの傾向が見られます。Dweck (2006) の研究では、この信念は教育的介入で変容可能であり、「まだできていないだけ（not yet）」というフレーミングが効果的です。（※ 大規模メタ分析で効果量は小さいとの報告あり: Sisk et al., 2018, r=.10。参考指標としてお読みください）'
}

export function getLearningAgilityDescription(score: number): string {
  if (score >= 70) {
    return 'フィードバックを積極的に求め行動に活かす力が高いです。Lombardo & Eichinger (2000) が示すように、この特性は成長速度と強く相関します。'
  }
  if (score >= 40) {
    return 'フィードバックへの受容度は中程度です。自分から聞きに行く積極性を高めると、さらに成長が加速します。'
  }
  return 'フィードバックの活用に伸びしろがあります。信頼できる相手からの定期的なフィードバックを受ける習慣を作ることが効果的です。'
}

export function getCrisisResponseDescription(score: number): string {
  if (score >= 70) {
    return '危機的な状況でも冷静に状況を整理し、行動に移せるタイプです。Lazarus & Folkman (1984) の問題焦点型コーピングが得意な傾向があります。'
  }
  if (score >= 40) {
    return '危機対応力は中程度です。事前のシミュレーションと、感情制御スキルの練習で向上できます。'
  }
  return '突発的なトラブルへの対応に伸びしろがあります。まずルーティン業務での安定した成果を積み、徐々に変化のある環境に慣れていく段階的アプローチが有効です。'
}

export function getCIDescription(score: number): string {
  if (score >= 70) {
    return '一つの領域への関心を長期間持続する傾向が強いです。Jachimowicz et al. (2018) によれば、情熱の一貫性はPerseverance of Effortと組み合わさることで目標達成の強力な予測因子になります。'
  }
  if (score >= 40) {
    return '興味の対象は時折変わりますが、中程度の一貫性があります。多様な経験を積む探索期にいる可能性があり、方向性が定まれば持続力に転換できます。'
  }
  return '興味の対象が変わりやすい傾向です。Duckworth & Quinn (2009) によれば、この特性自体は問題ではなく、自分が情熱を持てる領域をまだ探索している段階です。'
}

export function getTeamContributionDescription(score: number): string {
  if (score >= 70) {
    return 'チームの調和を保ちながら成果に貢献できるタイプです。Salas, Sims & Burke (2005) が示すチームワーク行動（協調・コミュニケーション・相互サポート）が自然にできています。'
  }
  if (score >= 40) {
    return 'チームへの貢献度は中程度です。他者への働きかけを少し増やすと、チーム全体のパフォーマンス向上につながります。'
  }
  return '個人での作業が得意なタイプです。チームでの役割を明確にし、少人数のチームから始めると力を発揮しやすくなります。'
}

// ─── Environment fit profiles ────────────────────────────────────────────────

export interface EnvironmentFit {
  drainEnvironments: string[]
  managementTips: string[]
  growthActions: string[]
}

const ENVIRONMENT_FIT: Record<string, EnvironmentFit> = {
  // HHHH 突破者型（OS-H / A-H / B-H / C-H）
  HHHH: {
    drainEnvironments: [
      '意思決定が遅く官僚的な組織',
      'リスク回避が最優先される文化',
      '裁量が小さく細かい手順に従うことだけが求められる環境',
    ],
    managementTips: [
      '大きな目標と自由度を与え、結果で評価する',
      'プロセスを過度に管理せず、自走を信頼する',
      '他メンバーへの共感を発揮する場面を意識的に作る（Goleman, 1995）',
    ],
    growthActions: [
      '楽観に偏りすぎていないか、プロジェクト開始前に「事前検死法（Pre-mortem）」(Klein, 2007) で悪いシナリオを書き出す習慣をつける',
      '自分の基準を他者に押し付けていないか定期的に振り返る',
      '他者の感情や状況を理解するために、1on1で「聞く側」に回る練習をする',
    ],
  },

  // HHHL 安定遂行型（OS-H / A-H / B-H / C-L）
  HHHL: {
    drainEnvironments: [
      '短期的な成果を強く求められるアグレッシブな環境',
      '強い競争圧力と数字プレッシャーがある組織',
      '「もっと高みを目指せ」と常に煽られる文化',
    ],
    managementTips: [
      '長期的な貢献の価値を明確に伝え、承認する',
      '安定したペースで取り組める計画を一緒に作る',
      '挑戦を強制せず、本人が興味を持った時に機会を提供する',
    ],
    growthActions: [
      '「今の実力の110%程度」の課題を月1回だけ試す（Locke & Latham, 2002）',
      '自分の成果を言語化して発信する習慣をつける',
      '達成動機が低いこと自体を問題視せず、安定性と継続力を武器として自覚する',
    ],
  },

  // HHLH 情熱猪突型（OS-H / A-H / B-L / C-H）
  HHLH: {
    drainEnvironments: [
      '感情を押し殺すことが求められる環境',
      '冷徹な合理性だけが評価される組織',
      '長期間の高ストレスが回復なく続く環境',
    ],
    managementTips: [
      '感情の波を否定せず、回復の時間を確保する',
      '情熱を注げるプロジェクトにアサインする',
      'ストレスのサインを早期にキャッチし、負荷を調整する',
    ],
    growthActions: [
      '感情が乱れたときの回復ルーティンを3つ持っておく',
      '認知的再評価（出来事の捉え方を変える練習）を週3回・1回5-10分から始める（Gross & John, 2003）',
      '感情面の悩みを話せるメンターを1名確保する（直属の上司とは別）',
    ],
  },

  // HHLL 楽観持久型（OS-H / A-H / B-L / C-L）
  HHLL: {
    drainEnvironments: [
      '変化が激しくスピードが求められる環境',
      '強い競争圧力と短期成果主義の組織',
      '感情を抑えてアグレッシブに動くことが前提の文化',
    ],
    managementTips: [
      '安定したペースで取り組める業務を中心にアサインする',
      '感情の波を理解し、無理なペースを押し付けない',
      '長期的な貢献を評価ポイントにする',
    ],
    growthActions: [
      '感情の波のパターンを記録し、自分のリズムを把握する',
      '小さな挑戦を「好きなこと」から始め、達成感を積む',
      '感情が不安定な時期に大きな決断をしないルールを作る',
    ],
  },

  // HLHH 戦略挑戦型（OS-H / A-L / B-H / C-H）
  HLHH: {
    drainEnvironments: [
      '同じことを長期間コツコツ続ける環境',
      'プロセスを厳密に管理される組織',
      '変化が少なく単調な作業が中心の環境',
    ],
    managementTips: [
      '短いスパンで区切った目標を設定する',
      '新しい役割や挑戦を定期的に提供する',
      '飽きが来る前に次のステージを見せる',
    ],
    growthActions: [
      '一つのことに3ヶ月集中する実験を意識的に行う',
      '「飽きた」と感じたときに、深掘りする方向への興味転換を試す（Jachimowicz et al., 2018）',
      '週1回メンターと進捗を確認し「先週よりここが進んだ」を定期的に実感する',
    ],
  },

  // HLHL 慎重楽観型（OS-H / A-L / B-H / C-L）
  HLHL: {
    drainEnvironments: [
      '高い目標と長期的な粘りを同時に求められる環境',
      '結果主義で競争が激しい組織',
      '強い責任感とコミットメントが常に求められる文化',
    ],
    managementTips: [
      '過度なプレッシャーをかけず、本人のペースを尊重する',
      '多様な経験を積ませることで適性を見極める',
      '小さな成功体験を重ねさせて自信を育てる',
    ],
    growthActions: [
      '自分が最も集中できた場面を振り返り、条件を特定する',
      '短期間で完結する目標を設定し、達成感を味わう練習をする',
      '「何に情熱を感じるか」を探索する時間を意識的に確保する',
    ],
  },

  // HLLH 直感突撃型（OS-H / A-L / B-L / C-H）
  HLLH: {
    drainEnvironments: [
      '長期間コツコツ同じことを続ける環境',
      '感情を抑えて冷静に振る舞い続ける必要がある組織',
      '安定と秩序が最優先される文化',
    ],
    managementTips: [
      '情熱が持続する短期プロジェクトを与える',
      '感情の波を認め、回復期間を設ける',
      '興味が分散しないよう、優先順位の整理を一緒にやる',
    ],
    growthActions: [
      '一つのプロジェクトを最後までやり切る経験を意識的に作る',
      '感情が高ぶったときに「一晩待つ」ルールを導入する',
      '認知的再評価トレーニングを週3回から始める（Gross & John, 2003）',
    ],
  },

  // HLLL 楽天自由型（OS-H / A-L / B-L / C-L）
  HLLL: {
    drainEnvironments: [
      'ルールや手順が厳密な環境',
      '長期的な目標達成と粘りが求められる組織',
      '感情の安定が前提とされる文化',
    ],
    managementTips: [
      '管理しすぎない。自由と信頼を与える',
      '本人が面白いと感じることと仕事を結びつける',
      '短期間で成果が見えるタスク設計にする',
    ],
    growthActions: [
      '自由の中で自分なりの規律を一つだけ作る',
      '3日間だけ何かに集中してみる超短期実験を繰り返す',
      '信頼できる人からの定期的なフィードバックを受ける場を持つ',
    ],
  },

  // LHHH 堅実努力型（OS-L / A-H / B-H / C-H）
  LHHH: {
    drainEnvironments: [
      '根拠のない楽観を共有することを求められる文化',
      '準備や分析が軽視され「とりあえずやってみよう」が常態化している環境',
      '感情論で意思決定が行われる場面',
    ],
    managementTips: [
      '具体的なデータと根拠で背景を共有する',
      '感情的な鼓舞ではなくロジカルに「なぜやるか」を説明する',
      '裁量を与えつつ定期的に明確なフィードバックを返す',
    ],
    growthActions: [
      '逆境時に「この状況は一時的か永続的か」を意識的に問い直す（Seligman, 1991）',
      '信頼できるメンターと週1で状況を言語化する場を持つ',
      '自分の悲観が「戦略的な備え（防衛的悲観主義: Norem & Cantor, 1986）」として機能しているか定期的に点検する',
    ],
  },

  // LHHL 忍耐守備型（OS-L / A-H / B-H / C-L）
  LHHL: {
    drainEnvironments: [
      '変化が激しく即座の適応が求められる環境',
      '自律性を強く求められ放置される組織',
      '短期成果を強く求められるアグレッシブな文化',
    ],
    managementTips: [
      '役割と期待値を明確に定義する',
      '変化がある場合は事前に伝え、準備の時間を与える',
      '専門性を深めることに価値を置くメッセージを伝える',
    ],
    growthActions: [
      '毎日の出来事について「原因は一時的か永続的か」「この領域だけの問題か全般的か」を書き出す（Seligman, 1991）',
      '完璧を求めすぎず「80%で出す」実験を月1回行う',
      '週1回メンターと話す機会を作り、解釈パターンを客観的に見てもらう',
    ],
  },

  // LHLH 闘志内燃型（OS-L / A-H / B-L / C-H）
  LHLH: {
    drainEnvironments: [
      '孤立した作業が中心の環境',
      '感情を見せることが弱さとみなされる文化',
      '失敗への許容度が低い組織',
    ],
    managementTips: [
      '定期的に1on1で感情面も含めたケアをする',
      'チームの中での役割と貢献を明確にする',
      'ストレスサインを見逃さず、早めに負荷調整する',
    ],
    growthActions: [
      '感情の波が来たときの対処パターンを3つ持っておく',
      'ストレス日記をつけ、トリガーを特定する',
      '帰属スタイルの偏りに気づくため、週1でメンターと出来事の解釈を振り返る（Peterson & Seligman, 1984）',
    ],
  },

  // LHLL 寡黙継続型（OS-L / A-H / B-L / C-L）
  LHLL: {
    drainEnvironments: [
      '高ストレス・高変化の環境',
      '短期成果と競争が重視される組織',
      '自律と自走を前提とした放任型マネジメント',
    ],
    managementTips: [
      '心理的安全性を最優先で確保する（Edmondson, 1999）',
      '安定した業務フローと明確な手順を提供する',
      '感情面のサポートを定期的に行う',
    ],
    growthActions: [
      '「続けることで価値が生まれる」環境を意識的に選ぶ',
      '感情が不安定な時期に大きな判断をしないルールを作る',
      '小さな成功体験を週1で振り返り、自己効力感を積み上げる（Bandura, 1997）',
    ],
  },

  // LLHH 冷静分析型（OS-L / A-L / B-H / C-H）
  LLHH: {
    drainEnvironments: [
      '長期間同じ作業をコツコツ続ける環境',
      '根拠なく楽観的に進める文化',
      '失敗が厳しく罰される組織',
    ],
    managementTips: [
      '短期目標を明確にし、達成感を頻繁に提供する',
      '分析力とリスク感知力を明確に評価する',
      '長期プロジェクトは短いマイルストーンに分割する',
    ],
    growthActions: [
      '分析から行動への移行を意識的に早める（「80%で出す」練習）',
      '帰属スタイルのジャーナリングを毎日行う（Seligman, 1991）',
      '一つのプロジェクトに3ヶ月集中する実験をする',
    ],
  },

  // LLHL 受容安定型（OS-L / A-L / B-H / C-L）
  LLHL: {
    drainEnvironments: [
      '常にアグレッシブな目標を追う環境',
      '変化が激しくスピードが求められる組織',
      '競争と比較が日常的な文化',
    ],
    managementTips: [
      '安定した業務と明確な役割を与える',
      '急な変化を最小限にし、変化があるときは事前に伝える',
      '感情の安定性を「チームへの貢献」として評価する',
    ],
    growthActions: [
      '小さな目標を設定し、一つずつ達成する体験を積む',
      '自分にとっての「意味がある仕事」を言語化する',
      '最初の90日間は週1回の1on1で「今週うまくいったこと」を振り返る',
    ],
  },

  // LLLH 野心原石型（OS-L / A-L / B-L / C-H）
  LLLH: {
    drainEnvironments: [
      '即戦力を求められる高プレッシャー環境',
      '感情面のケアがない高ストレス組織',
      '孤立した作業が中心で支援がない環境',
    ],
    managementTips: [
      '手厚いメンタリングと段階的な目標設定を提供する',
      '野心を尊重しつつ、現実的なステップに分解する',
      '感情の波と帰属スタイルの両方をケアする',
    ],
    growthActions: [
      '「確実に達成できる小さな目標」から始め、成功体験を積む（Bandura, 1997）',
      '感情の波が来たときの対処パターンを事前に用意する',
      '帰属スタイルの振り返りを週1回メンターと行う',
    ],
  },

  // LLLL 模索探求型（OS-L / A-L / B-L / C-L）
  LLLL: {
    drainEnvironments: [
      '即戦力を求められる高プレッシャー環境',
      '自己管理と自律が前提とされる組織',
      '失敗が厳しく評価される文化',
    ],
    managementTips: [
      '心理的安全性を最優先で確保する（Edmondson, 1999）',
      '小さなタスクから始め、成功体験を積ませる',
      '定期的なメンタリングで方向性を一緒に考える',
      '強みが見つかるまで多様な経験をさせる',
    ],
    growthActions: [
      '自分が少しでも興味を持ったことを記録する習慣をつける',
      '3日間だけ何かに集中してみる超短期実験を繰り返す',
      '週1でメンターと「今週うまくいったこと・なぜうまくいったか」を振り返る',
      '自分を責めるのではなく、環境との相性として捉え直す（P-E Fit理論: French & Kaplan, 1972）',
    ],
  },
}
export function getEnvironmentFit(personalityTypeKey: string): EnvironmentFit {
  return ENVIRONMENT_FIT[personalityTypeKey] ?? ENVIRONMENT_FIT.LLLL
}

// ─── Personality type key helper ─────────────────────────────────────────────

export function getPersonalityTypeKey(OS: number, A: number, B: number, C: number): string {
  return (OS >= 60 ? 'H' : 'L') + (A >= 60 ? 'H' : 'L') + (B >= 60 ? 'H' : 'L') + (C >= 60 ? 'H' : 'L')
}

// ─── Risk indicators ──────────────────────────────────────────────────────────

export interface RiskIndicators {
  hardworkResilience: number      // 0-100: 努力の持続力（OS + A の平均）
  commitSustainability: number    // 0-100: コミット持続性（A + B の平均）
  adversityRisk: 'low' | 'medium' | 'high'
  adversityRiskNote: string
}

export function computeRiskIndicators(OS: number, PE: number, B: number): RiskIndicators {
  const hardworkResilience = Math.round((OS + PE) / 2)
  const commitSustainability = Math.round((PE + B) / 2)

  let adversityRisk: 'low' | 'medium' | 'high'
  let adversityRiskNote: string

  if (OS >= 60 && B >= 60) {
    adversityRisk = 'low'
    adversityRiskNote = '楽観的な帰属スタイルと情緒安定性が高く、逆境での消耗リスクは低いです。高プレッシャー環境でも自走しやすい状態です。'
  } else if (OS < 40 && B < 40) {
    adversityRisk = 'high'
    adversityRiskNote = '逆境を長期的・自己帰属的に捉えやすく、情緒安定性も低めです。高ストレス環境では早期に消耗するリスクがあります。まず心理的安全性の高い環境を選ぶことが重要です。'
  } else if (OS < 40 || B < 40) {
    adversityRisk = 'medium'
    adversityRiskNote = OS < 40
      ? '逆境の捉え方に改善の余地があります。失敗を一時的・限定的に捉える練習（Seligman, 1991）と、支援的なメンターの存在が回復力を高めます。'
      : '感情の揺れが逆境時のパフォーマンスに影響することがあります。感情調整の練習と、定期的な1on1でのサポートが有効です。'
  } else {
    adversityRisk = 'medium'
    adversityRiskNote = '基盤は整っていますが、特定の状況下では消耗しやすい面があります。メンターや定期フィードバックで安定的に力を発揮できます。'
  }

  return { hardworkResilience, commitSustainability, adversityRisk, adversityRiskNote }
}
