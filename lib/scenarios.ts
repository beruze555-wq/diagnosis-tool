import { SJTOption } from '@/types'

export interface Scenario {
  id: number
  title: string
  summaryText: string
  description: string
  sjtOptions: SJTOption[]
  attributions: { question: string; leftLabel: string; rightLabel: string }[]
}

function makeAttrQuestions() {
  return [
    {
      question: 'この出来事の影響は、時間が経てば薄れると思いますか？',
      leftLabel: 'すぐ薄れる',
      rightLabel: 'ずっと続く',
    },
    {
      question: 'こういうことは、この場面に限った話だと思いますか？ それとも自分の周りでは繰り返し起きそうですか？',
      leftLabel: 'この場面だけ',
      rightLabel: '繰り返し起きる',
    },
    {
      question: 'この出来事に、自分の行動や判断はどの程度関係していると思いますか？',
      leftLabel: '自分は関係ない',
      rightLabel: '大きく関係している',
    },
  ]
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: '30件全滅の1日',
    summaryText: '30件全員に断られた',
    description:
      '7月、真夏。朝9時、あなたはアイロンをかけたばかりのシャツに袖を通し、リストを片手にオフィスを出た。訪問先は30件。最初の家のインターホンを押す。「間に合ってます」。次の家。ドアすら開かない。昼過ぎ、コンビニの駐車場でおにぎりをかじりながらリストを見ると、15件すべてに斜線が引かれている。午後も同じだった。夕方5時、汗でよれたシャツのままオフィスに戻ると、上司はパソコンから目を上げずに「で、今日何件取れた？」と聞いてきた。あなたは「ゼロです」と答えた。上司は少し間を置いて、「明日どうするかは自分で考えて」とだけ言った。',
    sjtOptions: [
      { label: 'A', text: '昨日断られた理由を1件ずつ振り返り、トークを変えて同じエリアにもう一度行く', tags: ['proactive', 'team-oriented'] },
      { label: 'B', text: '上司や先輩に「自分のどこがダメだったか」を具体的に聞きに行く', tags: ['feedback-seeking', 'help-seeking'] },
      { label: 'C', text: '「訪問営業自体が時代に合っていない」と感じ、別の方法を提案する', tags: ['analytical', 'proactive'] },
      { label: 'D', text: '正直やる気が出ないので、とりあえず件数だけこなして早めに切り上げる', tags: ['avoidant'] },
    ],
    attributions: makeAttrQuestions(),
  },
  {
    id: 2,
    title: '企画全面却下',
    summaryText: '企画が全面却下された',
    description:
      'あなたは3人チームのリーダーとして、2週間かけて新規事業の企画書を作った。深夜まで残ってスライドを直し、チームメンバーとも何度もビデオ通話で議論した。自信はあった。プレゼン当日、会議室には役員が5人並んでいる。15分間、練習通りに話し終えた。沈黙が3秒ほど続いた後、一番奥に座っていた役員が口を開いた。「方向性が根本的に違う。うちがやるべきことじゃない」。他の役員も頷いている。あなたのスライドはそのまま閉じられ、次の議題に移った。会議室を出たあと、チームメンバーの一人が「俺たちの2週間、何だったんだろうな」とつぶやいた。',
    sjtOptions: [
      { label: 'A', text: '「根本的に違う」と言われた部分を具体的に聞きに行き、次の企画に活かす', tags: ['feedback-seeking', 'analytical'] },
      { label: 'B', text: 'チームメンバーの気持ちを立て直すことを最優先にし、食事に誘う', tags: ['team-oriented', 'emotion-regulation'] },
      { label: 'C', text: '自分にはこのレベルの企画を作る力がまだないと感じ、しばらく提案を控える', tags: ['avoidant'] },
      { label: 'D', text: '「方向性が違う」のは役員側の理解不足だと思い、別ルートで再提案する', tags: ['rigid', 'proactive'] },
    ],
    attributions: makeAttrQuestions(),
  },
  {
    id: 3,
    title: '試合で決定的ミス',
    summaryText: '試合の決定的な場面でミスをした',
    description:
      '秋の大会、バレーボールの最終セット。チームは半年間この日のために朝練と夜練を重ねてきた。あなたにボールが回ってきた。何度も練習した場面だ。でも、体が一瞬固まった。打ったボールはネットにかかり、相手チームの歓声が体育館に響いた。試合終了。ベンチに戻ると、3年生の先輩が近づいてきて、こう言った。「なんであそこで決められないんだよ。半年間、何やってたんだ」。周りのチームメイトは目を伏せている。ロッカールームに戻ると、自分のバッグだけがぽつんと端に置かれていた。',
    sjtOptions: [
      { label: 'A', text: '悔しさをバネに、翌日から自主練の時間を増やす', tags: ['proactive', 'rigid'] },
      { label: 'B', text: '先輩に頭を下げた上で、「具体的にどう改善すべきか」を聞く', tags: ['feedback-seeking', 'team-oriented'] },
      { label: 'C', text: '自分のメンタルの弱さが原因だと感じ、試合に出ること自体を避けたいと思う', tags: ['avoidant'] },
      { label: 'D', text: 'ミスは仕方ないと割り切り、チーム全体の課題として捉え直す', tags: ['analytical', 'emotion-regulation'] },
    ],
    attributions: makeAttrQuestions(),
  },
  {
    id: 4,
    title: '信頼していた仲間の離脱',
    summaryText: '信頼していた同期が突然辞めた',
    description:
      'あなたには、入社時から一緒にやってきた同期がいた。ランチも毎日一緒、仕事で困ったら真っ先に相談する相手だった。ある月曜の朝、その同期のデスクが空になっていた。上司から「先週末付で退職した。転職先は競合のA社だ」と告げられた。引き継ぎ資料はメール1通だけ。あなたが担当していたプロジェクトの、いちばん重要なクライアント対応をその同期に任せていた。午後には、そのクライアントから「担当者が変わったと聞いたが、今後どうなるのか」と不安そうな電話がかかってきた。',
    sjtOptions: [
      { label: 'A', text: '感情は脇に置き、まずクライアントへの対応方針を上司と30分以内に決める', tags: ['team-oriented', 'emotion-regulation'] },
      { label: 'B', text: '同期に直接連絡を取り、引き継ぎで足りない情報を聞き出す', tags: ['feedback-seeking', 'proactive'] },
      { label: 'C', text: '「裏切られた」という気持ちが強く、しばらく仕事に集中できない', tags: ['avoidant'] },
      { label: 'D', text: '自分のマネジメント不足（1人に頼りすぎた）と捉え、体制を見直す', tags: ['analytical', 'proactive'] },
    ],
    attributions: makeAttrQuestions(),
  },
  {
    id: 5,
    title: '3ヶ月の努力が白紙',
    summaryText: '3ヶ月追った案件が白紙になった',
    description:
      'あなたは3ヶ月間、ある企業との大型契約を追いかけてきた。先方の担当者とは週2回のペースで打ち合わせを重ね、提案書は5回作り直した。先方も「社内稟議を通す」と言ってくれていた。金曜の夕方、あなたのスマートフォンが鳴った。先方の担当者の声はいつもより小さかった。「申し訳ないんですが、来期の予算が止まってしまい（予算凍結）、今回の件は一旦なしで…」。電話を切ったあと、しばらく画面を見つめていた。隣の席の上司は一言、「切り替えて、次いこう」と言った。月曜から、あなたのパイプラインはゼロに戻る。',
    sjtOptions: [
      { label: 'A', text: '週末のうちに新しい見込みリストを作り、月曜朝から動けるように準備する', tags: ['proactive'] },
      { label: 'B', text: 'この3ヶ月で築いた先方との関係は資産だと考え、半年後に再アプローチする計画を立てる', tags: ['analytical', 'rigid'] },
      { label: 'C', text: '「3ヶ月が無駄だった」という気持ちが消えず、しばらく新規開拓のモチベーションが出ない', tags: ['avoidant'] },
      { label: 'D', text: '予算凍結は自分にはどうしようもないことなので、深く考えずに次に行く', tags: ['emotion-regulation', 'analytical'] },
    ],
    attributions: makeAttrQuestions(),
  },
  {
    id: 6,
    title: '自分だけ置いていかれる',
    summaryText: '自分だけ成果が出ず孤立している',
    description:
      '長期インターン初日から1ヶ月が経った。同じ時期に入った他の3人は、すでにクライアントとのミーティングに同席している。Slackでは「〇〇さんのアウトプット良かったです！」と名前が飛び交っている。あなたの名前はない。与えられたタスクはこなしているが、目に見える成果が出ていない。ランチの時間、他の3人が楽しそうに話しているのが見えた。あなたは自分のデスクでコンビニのサンドイッチを食べながら、パソコンの画面を眺めている。夕方、マネージャーが全員に向けて「来月からはアウトプットで評価する」とアナウンスした。',
    sjtOptions: [
      { label: 'A', text: 'マネージャーに1on1を申し込み、「自分に何が足りないか」を率直に聞く', tags: ['feedback-seeking', 'help-seeking'] },
      { label: 'B', text: '他の3人のやり方を観察・模倣して、まず同じ水準まで追いつこうとする', tags: ['analytical', 'proactive'] },
      { label: 'C', text: '自分にはこの環境が合っていないのかもしれないと思い、別のインターン先を探し始める', tags: ['avoidant', 'analytical'] },
      { label: 'D', text: '焦りはあるが、自分なりのやり方を見つけながら追いつこうとする', tags: ['proactive', 'emotion-regulation'] },
    ],
    attributions: makeAttrQuestions(),
  },
]
