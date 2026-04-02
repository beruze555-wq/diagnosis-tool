export interface Layer2Question {
  id: string
  text: string
  reversed: boolean
  source: string
}

export interface Layer2Section {
  axis: 'A' | 'B' | 'C'
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
        text: '新しいことに興味が移って、前にやっていたことが中途半端になることがある',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A2',
        text: '一度始めたことへの興味を、数年間以上持ち続けることができる',
        reversed: false,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A3',
        text: 'アイデアや目標が短期間でコロコロ変わりやすい',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A4',
        text: '一つの分野・目標に粘り強くこだわり続けることができる',
        reversed: false,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A5',
        text: '今取り組んでいることへの熱量が、数ヶ月後も続いているか自信がない',
        reversed: true,
        source: 'Grit-S CI (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A6',
        text: '一度決めた目標は、どんな障害があっても達成しようとする',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A7',
        text: '失敗してもへこたれずに、再び挑戦し続けることができる',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A8',
        text: '困難なプロジェクトも、途中で投げ出さず最後までやり遂げる',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A9',
        text: '結果が出ないとわかると、途中でも目標を諦めることがある',
        reversed: true,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
      {
        id: 'A10',
        text: 'つらい状況でも、長期的なゴールを見失わずにいられる',
        reversed: false,
        source: 'Grit-S PE (Duckworth & Quinn, 2009)',
      },
    ],
  },
  {
    axis: 'B',
    title: '情緒安定性',
    questions: [
      {
        id: 'B1',
        text: '些細なことでもくよくよ心配してしまう',
        reversed: true,
        source: 'BFI-2-J Anxiety (Oshio et al., 2022)',
      },
      {
        id: 'B2',
        text: '不安になりやすく、ちょっとしたことで落ち込む',
        reversed: true,
        source: 'BFI-2-J Anxiety (Oshio et al., 2022)',
      },
      {
        id: 'B3',
        text: '先のことを考えると、つい悪い結果を想像してしまう',
        reversed: true,
        source: 'BFI-2-J Anxiety (Oshio et al., 2022)',
      },
      {
        id: 'B4',
        text: '緊張しやすく、プレッシャーのある場面では実力を出しにくい',
        reversed: true,
        source: 'BFI-2-J Anxiety (Oshio et al., 2022)',
      },
      {
        id: 'B5',
        text: '失敗しても、必要以上に引きずらずに前を向ける',
        reversed: false,
        source: 'BFI-2-J Anxiety (Oshio et al., 2022)',
      },
      {
        id: 'B6',
        text: '気分の波が激しく、感情がコントロールしにくいことがある',
        reversed: true,
        source: 'BFI-2-J Emotional Volatility (Oshio et al., 2022)',
      },
      {
        id: 'B7',
        text: '批判されたとき、しばらく気持ちの切り替えができない',
        reversed: true,
        source: 'BFI-2-J Emotional Volatility (Oshio et al., 2022)',
      },
      {
        id: 'B8',
        text: '感情が乱れても、比較的早く立ち直れる',
        reversed: false,
        source: 'BFI-2-J Emotional Volatility (Oshio et al., 2022)',
      },
      {
        id: 'B9',
        text: '怒りや悲しみに飲み込まれず、冷静さを保てる場面が多い',
        reversed: false,
        source: 'BFI-2-J Emotional Volatility (Oshio et al., 2022)',
      },
      {
        id: 'B10',
        text: '物事がうまくいかないとき、ネガティブな感情が一気に湧き出る',
        reversed: true,
        source: 'BFI-2-J Emotional Volatility (Oshio et al., 2022)',
      },
    ],
  },
  {
    axis: 'C',
    title: '達成動機',
    questions: [
      {
        id: 'C1',
        text: '困難な目標でも、達成できると信じて取り組める',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C2',
        text: '高い目標を設定されたとき、プレッシャーよりワクワクが勝つ',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C3',
        text: '努力すれば自分は成長できるという確信がある',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C4',
        text: 'チャレンジングな仕事に挑戦することが好きだ',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C5',
        text: '成功したときのイメージを思い描くことで、やる気が上がる',
        reversed: false,
        source: 'AMS-R Hope of Success (Lang & Fries, 2006)',
      },
      {
        id: 'C6',
        text: '失敗することへの不安が強く、挑戦をためらうことがある',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C7',
        text: 'ミスをすると、自分の評価が下がることを必要以上に恐れる',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C8',
        text: 'うまくいかないとどうしようと心配して、行動を先延ばしにすることがある',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C9',
        text: 'リスクのある選択肢は、失敗を恐れて避けがちだ',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
      {
        id: 'C10',
        text: '批判されたり失敗したりすることへの恐れが、行動の足かせになっている',
        reversed: true,
        source: 'AMS-R Fear of Failure (Lang & Fries, 2006)',
      },
    ],
  },
]
