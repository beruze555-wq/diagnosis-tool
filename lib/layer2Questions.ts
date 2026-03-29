export interface Layer2Question {
  id: string
  text: string
  reversed: boolean
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
      { id: 'A1', text: '一度始めたことは、結果が出るまでやり続ける方だ', reversed: false },
      { id: 'A2', text: '壁にぶつかっても、別のやり方を探して続ける', reversed: false },
      { id: 'A3', text: '途中で飽きて投げ出すことがよくある', reversed: true },
      { id: 'A4', text: '「もう無理だ」と思った場面でも、あと一歩だけ踏ん張れる', reversed: false },
      { id: 'A5', text: '目標を立てても、途中で別のことに興味が移りやすい', reversed: true },
      { id: 'A6', text: '地味な作業でも、必要なら何時間でも続けられる', reversed: false },
      { id: 'A7', text: '失敗した翌日に、同じことにもう一度チャレンジするのは苦にならない', reversed: false },
      { id: 'A8', text: '成果がすぐに見えないと、やる気がなくなる', reversed: true },
      { id: 'A9', text: '周りが諦めた後でも、自分だけは続けていた経験がある', reversed: false },
      { id: 'A10', text: '目の前のつらい作業より、長期的な目標の方が大事だと思える', reversed: false },
    ],
  },
  {
    axis: 'B',
    title: '情緒安定性',
    questions: [
      { id: 'B1', text: '誰かにきつい言葉を言われても、引きずらずに切り替えられる', reversed: false },
      { id: 'B2', text: '人前で否定されると、頭が真っ白になることがある', reversed: true },
      { id: 'B3', text: '怒っている人を目の前にしても、冷静に対応できる方だ', reversed: false },
      { id: 'B4', text: '断られることが続くと、自分には価値がないと感じてしまう', reversed: true },
      { id: 'B5', text: '予想外のトラブルが起きても、パニックにならず状況を整理できる', reversed: false },
      { id: 'B6', text: '自分への批判は、改善のヒントとして受け取れる', reversed: false },
      { id: 'B7', text: '嫌なことがあった日は、夜になっても何度も思い出してしまう', reversed: true },
      { id: 'B8', text: '他人と自分を比べて落ち込むことはほとんどない', reversed: false },
      { id: 'B9', text: 'ストレスが溜まると体調を崩しやすい', reversed: true },
      { id: 'B10', text: '理不尽なことを言われても、感情的にならず聞き流せる', reversed: false },
    ],
  },
  {
    axis: 'C',
    title: '達成動機',
    questions: [
      { id: 'C1', text: '「1番になりたい」という気持ちが、行動の原動力になっている', reversed: false },
      { id: 'C2', text: '周りよりも多く稼ぎたいという欲求が強い', reversed: false },
      { id: 'C3', text: '競争のない環境だと、逆にモチベーションが下がる', reversed: false },
      { id: 'C4', text: '高い目標を設定されると、プレッシャーよりワクワクが勝つ', reversed: false },
      { id: 'C5', text: '「そこそこでいい」と思う自分がいることがある', reversed: true },
      { id: 'C6', text: '結果が数字で見える仕事にやりがいを感じる', reversed: false },
      { id: 'C7', text: '自分より優秀な人がいると、追い抜きたいと強く思う', reversed: false },
      { id: 'C8', text: '昇進や昇給のチャンスがあると、普段以上に頑張れる', reversed: false },
      { id: 'C9', text: '安定よりも、リスクを取ってでも大きい成果を狙いたい', reversed: false },
      { id: 'C10', text: '負けず嫌いだと言われることが多い', reversed: false },
    ],
  },
]
