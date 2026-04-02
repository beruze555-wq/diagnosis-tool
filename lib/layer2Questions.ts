export interface Layer2Question {
  id: string
  text: string
  reversed: boolean
  source: string
  metric?: string  // only for D-axis
}

export interface Layer2Section {
  axis: 'A' | 'B' | 'C' | 'D'
  title: string
  questions: Layer2Question[]
}

export const layer2Sections: Layer2Section[] = [
  {
    axis: 'A',
    title: '粘り強さ',
    questions: [
      {
        id: 'A1',
        text: '新しいアイデアやプロジェクトに気を取られて、前に始めたことが疎かになることがある',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A2',
        text: '挫折してもめげない。簡単には諦めない',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A3',
        text: '目標を設定しても、後から別の目標に切り替えることがよくある',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A4',
        text: '努力家だ',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A5',
        text: '数ヶ月以上かかるプロジェクトに集中し続けるのが難しい',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A6',
        text: '一度始めたことは必ずやり遂げる',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A7',
        text: '壁にぶつかっても、すぐには諦めずに取り組み続ける',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A8',
        text: '興味の対象がころころ変わる方だ',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A9',
        text: '自分は勤勉で、やるべきことを怠けることはほとんどない',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A10',
        text: '重要な課題に取り組んでいても、途中で興味を失うことがある',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
    ],
  },
  {
    axis: 'B',
    title: '情緒安定性',
    questions: [
      {
        id: 'B1',
        text: 'ちょっとしたことで不安になりやすい',
        reversed: true,
        source: 'BFI-2-J Anxiety (Soto & John, 2017)',
      },
      {
        id: 'B2',
        text: '気分が安定していて、あまり落ち込まない',
        reversed: false,
        source: 'BFI-2-J Depression (Soto & John, 2017)',
      },
      {
        id: 'B3',
        text: 'プレッシャーがかかると感情的になりやすい',
        reversed: true,
        source: 'BFI-2-J Emotional Volatility (Soto & John, 2017)',
      },
      {
        id: 'B4',
        text: '他人の何気ない一言を、後からずっと気にしてしまうことがある',
        reversed: true,
        source: 'RSQ (Downey & Feldman, 1996)',
      },
      {
        id: 'B5',
        text: 'ストレスがかかっても冷静さを保てる方だ',
        reversed: false,
        source: 'BFI-2-J Emotional Volatility (Soto & John, 2017)',
      },
      {
        id: 'B6',
        text: '自分への批判を受けても、あまり引きずらない',
        reversed: false,
        source: 'RSQ (Downey & Feldman, 1996)',
      },
      {
        id: 'B7',
        text: '心配事があると頭から離れず、他のことに集中しにくい',
        reversed: true,
        source: 'BFI-2-J Anxiety (Soto & John, 2017)',
      },
      {
        id: 'B8',
        text: '人前で失敗したとき、恥ずかしさをすぐに切り替えられる',
        reversed: false,
        source: 'BFI-2-J Depression (Soto & John, 2017)',
      },
      {
        id: 'B9',
        text: '嫌なことがあると、その日一日ずっと気分が沈む',
        reversed: true,
        source: 'BFI-2-J Depression (Soto & John, 2017)',
      },
      {
        id: 'B10',
        text: '周囲の雰囲気がピリピリしていても、自分のペースを崩さずにいられる',
        reversed: false,
        source: 'BFI-2-J Emotional Volatility (Soto & John, 2017)',
      },
    ],
  },
  {
    axis: 'C',
    title: '達成動機',
    questions: [
      {
        id: 'C1',
        text: '難しいことに挑戦するとワクワクする',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C2',
        text: '失敗が怖くて挑戦を避けたくなることがある',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C3',
        text: '高い目標を設定して、それに向かって計画的に動くのが好きだ',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C4',
        text: '人と競争する場面では、負けるかもしれないという不安の方が大きい',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C5',
        text: '成果を出したとき、次はもっと高い水準を目指したくなる',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C6',
        text: '評価される場面では、実力を発揮するよりミスを避けることを優先してしまう',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C7',
        text: '自分の能力を試せる機会があれば、積極的に手を挙げる',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C8',
        text: 'できるだけ難しい状況を避けて、安全な道を選びたい',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C9',
        text: '周囲から期待されると、プレッシャーよりもやる気の方が大きくなる',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C10',
        text: '挑戦して失敗するくらいなら、最初から手を出さない方がマシだと思うことがある',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
    ],
  },
  {
    axis: 'D',
    title: 'メンタルコア',
    questions: [
      {
        id: 'D1',
        text: 'ジャンルや分野が変わっても、自分はそこそこうまくやれると思う',
        reversed: false,
        source: 'NGSE Item6 (Chen, Gully & Eden, 2001)',
        metric: 'self-efficacy',
      },
      {
        id: 'D2',
        text: '自分が本気で取り組めば、大抵のことは達成できると思う',
        reversed: false,
        source: 'NGSE Item4 (Chen, Gully & Eden, 2001)',
        metric: 'self-efficacy',
      },
      {
        id: 'D3',
        text: '報酬や評価がなくても、やっていること自体が楽しいと感じるときに一番力が出る',
        reversed: false,
        source: 'SDT Intrinsic (Deci & Ryan, 2000)',
        metric: 'autonomous-motivation',
      },
      {
        id: 'D4',
        text: 'やる理由に納得できなくても、言われたことはとりあえずやれる方だ',
        reversed: true,
        source: 'SDT External Reg. (Deci & Ryan, 2000)',
        metric: 'autonomous-motivation',
      },
      {
        id: 'D5',
        text: '自分の能力は、努力次第で大きく変えられると思う',
        reversed: false,
        source: 'Implicit Theories (Dweck, 1999)',
        metric: 'growth-mindset',
      },
      {
        id: 'D6',
        text: '自分にはもともと向き不向きがあり、苦手なことはいくら頑張っても大きくは変わらないと思う',
        reversed: true,
        source: 'Implicit Theories (Dweck, 1999)',
        metric: 'growth-mindset',
      },
    ],
  },
]
