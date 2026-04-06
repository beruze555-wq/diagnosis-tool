export interface Layer2Question {
  id: string
  text: string
  reversed: boolean
  source: string
  metric?: string
}

export interface Layer2Section {
  axis: string
  label: string
  questions: Layer2Question[]
}

// 全質問を1フラット配列で管理（インデックス順が回答配列のインデックスに対応）
export const layer2Questions: Layer2Question[] = [

  // ============================================================
  // SE: 自己効力感 (NGSE, Chen et al. 2001) — 8問 (index 0-7)
  // ============================================================
  { id: 'SE1', text: 'ジャンルや分野が変わっても、自分はそこそこうまくやれると思う', reversed: false, source: 'NGSE Item6 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },
  { id: 'SE2', text: '自分が本気で取り組めば、大抵のことは達成できると思う', reversed: false, source: 'NGSE Item4 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },
  { id: 'SE3', text: '困難な課題に直面しても、自分はやり遂げられると思う', reversed: false, source: 'NGSE Item2 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },
  { id: 'SE4', text: '大きな壁がいくつあっても、乗り越えていけると思う', reversed: false, source: 'NGSE Item5 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },
  { id: 'SE5', text: '厳しい状況に置かれても、自分はそれなりにうまくやれると思う', reversed: false, source: 'NGSE Item8 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },
  { id: 'SE6', text: '自分が立てた目標の大半は達成できると思う', reversed: false, source: 'NGSE Item1 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },
  { id: 'SE7', text: '自分にとって重要な成果は、たいてい手に入れられると思う', reversed: false, source: 'NGSE Item3 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },
  { id: 'SE8', text: 'さまざまな課題に対して、効果的にやれる自信がある', reversed: false, source: 'NGSE Item7 (Chen, Gully & Eden, 2001)', metric: 'selfEfficacy' },

  // ============================================================
  // PE: 持続的努力 (Grit-S PE, Duckworth & Quinn 2009) — 5問 (index 8-12)
  // ============================================================
  { id: 'PE1', text: '挫折してもめげない。簡単には諦めない', reversed: false, source: 'Grit-S PE (Duckworth & Quinn, 2009)' },
  { id: 'PE2', text: '努力家だ', reversed: false, source: 'Grit-S PE (Duckworth & Quinn, 2009)' },
  { id: 'PE3', text: '一度始めたことは必ずやり遂げる', reversed: false, source: 'Grit-S PE (Duckworth & Quinn, 2009)' },
  { id: 'PE4', text: '壁にぶつかっても、すぐには諦めずに取り組み続ける', reversed: false, source: 'Grit-S PE (Duckworth & Quinn, 2009)' },
  { id: 'PE5', text: '自分は勤勉で、やるべきことを怠けることはほとんどない', reversed: false, source: 'Grit-S PE (Duckworth & Quinn, 2009)' },

  // ============================================================
  // CI: 興味の一貫性 (Grit-S CI) — 5問 (index 13-17)
  // ============================================================
  { id: 'CI1', text: '新しいアイデアやプロジェクトに気を取られて、前に始めたことが疎かになることがある', reversed: true, source: 'Grit-S CI (Duckworth & Quinn, 2009)' },
  { id: 'CI2', text: '目標を設定しても、後から別の目標に切り替えることがよくある', reversed: true, source: 'Grit-S CI (Duckworth & Quinn, 2009)' },
  { id: 'CI3', text: '数ヶ月以上かかるプロジェクトに集中し続けるのが難しい', reversed: true, source: 'Grit-S CI (Duckworth & Quinn, 2009)' },
  { id: 'CI4', text: '興味の対象がころころ変わる方だ', reversed: true, source: 'Grit-S CI (Duckworth & Quinn, 2009)' },
  { id: 'CI5', text: '重要な課題に取り組んでいても、途中で興味を失うことがある', reversed: true, source: 'Grit-S CI (Duckworth & Quinn, 2009)' },

  // ============================================================
  // ES: 情緒安定性 (BFI-2-J Neuroticism reversed) — 10問 (index 18-27)
  // ============================================================
  { id: 'ES1',  text: 'ちょっとしたことで不安になりやすい',                                               reversed: true,  source: 'BFI-2-J Anxiety (Soto & John, 2017)' },
  { id: 'ES2',  text: '気分が安定していて、あまり落ち込まない',                                           reversed: false, source: 'BFI-2-J Depression (Soto & John, 2017)' },
  { id: 'ES3',  text: 'プレッシャーがかかると感情的になりやすい',                                         reversed: true,  source: 'BFI-2-J Emotional Volatility (Soto & John, 2017)' },
  { id: 'ES4',  text: '他人の何気ない一言を、後からずっと気にしてしまうことがある',                       reversed: true,  source: 'RSQ (Downey & Feldman, 1996)' },
  { id: 'ES5',  text: 'ストレスがかかっても冷静さを保てる方だ',                                           reversed: false, source: 'BFI-2-J Emotional Volatility (Soto & John, 2017)' },
  { id: 'ES6',  text: '自分への批判を受けても、あまり引きずらない',                                       reversed: false, source: 'RSQ (Downey & Feldman, 1996)' },
  { id: 'ES7',  text: '心配事があると頭から離れず、他のことに集中しにくい',                               reversed: true,  source: 'BFI-2-J Anxiety (Soto & John, 2017)' },
  { id: 'ES8',  text: '人前で失敗したとき、恥ずかしさをすぐに切り替えられる',                             reversed: false, source: 'BFI-2-J Depression (Soto & John, 2017)' },
  { id: 'ES9',  text: '嫌なことがあると、その日一日ずっと気分が沈む',                                     reversed: true,  source: 'BFI-2-J Depression (Soto & John, 2017)' },
  { id: 'ES10', text: '周囲の雰囲気がピリピリしていても、自分のペースを崩さずにいられる',                 reversed: false, source: 'BFI-2-J Emotional Volatility (Soto & John, 2017)' },

  // ============================================================
  // AM: 自律的動機づけ (SDT / BPNS) — 6問 (index 28-33)
  // ============================================================
  { id: 'AM1', text: '報酬や評価がなくても、やっていること自体が楽しいと感じるときに一番力が出る', reversed: false, source: 'SDT Intrinsic (Deci & Ryan, 2000)', metric: 'autonomousMotivation' },
  { id: 'AM2', text: 'やる理由に納得できなくても、言われたことはとりあえずやれる方だ', reversed: true, source: 'SDT External Reg. (Deci & Ryan, 2000)', metric: 'autonomousMotivation' },
  { id: 'AM3', text: '今取り組んでいることは、自分自身の選択だと感じている', reversed: false, source: 'BPNS Autonomy (Deci & Ryan, 2000)', metric: 'autonomousMotivation' },
  { id: 'AM4', text: '日々の活動で、自分の意志で行動していると感じることが多い', reversed: false, source: 'BPNS Autonomy (Deci & Ryan, 2000)', metric: 'autonomousMotivation' },
  { id: 'AM5', text: '自分のやることを、自分で決められていると感じる', reversed: false, source: 'BPNS Autonomy (Deci & Ryan, 2000)', metric: 'autonomousMotivation' },
  { id: 'AM6', text: '自分の行動は、本当にやりたいことと一致していると思う', reversed: false, source: 'SDT Intrinsic (Deci & Ryan, 2000)', metric: 'autonomousMotivation' },
]

// 合計: 8 + 5 + 5 + 10 + 6 = 34問

// セクション定義（UI表示用）
export const layer2Sections: Layer2Section[] = [
  { axis: 'SE', label: '自己効力感',    questions: layer2Questions.filter(q => q.id.startsWith('SE')) },
  { axis: 'PE', label: '持続的努力',    questions: layer2Questions.filter(q => q.id.startsWith('PE')) },
  { axis: 'CI', label: '興味の一貫性',  questions: layer2Questions.filter(q => q.id.startsWith('CI')) },
  { axis: 'ES', label: '情緒安定性',    questions: layer2Questions.filter(q => q.id.startsWith('ES')) },
  { axis: 'AM', label: '自律的動機づけ', questions: layer2Questions.filter(q => q.id.startsWith('AM')) },
]
