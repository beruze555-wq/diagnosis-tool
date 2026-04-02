'use client'

import { useRouter } from 'next/navigation'

const gates = [
  {
    number: '①',
    name: '楽観帰属スタイル',
    question: '「これは一時的な問題だ」と思えるか？',
    theory: 'Seligman (1986) の帰属スタイル理論',
    measurement: 'Layer1: 6つのシナリオ × 3つの帰属質問',
    color: 'border-l-4 border-blue-500',
  },
  {
    number: '②',
    name: '情緒安定性',
    question: '感情が崩れずにいられるか？',
    theory: 'Big Five 理論 (Costa & McCrae, 1992)',
    measurement: 'Layer2: 10問（BFI-2-J ベース）',
    color: 'border-l-4 border-purple-500',
  },
  {
    number: '③',
    name: '粘り強さ（Grit）',
    question: '困難でも行動を続けられるか？',
    theory: 'Duckworth (2007) のGrit理論',
    measurement: 'Layer2: 10問（Grit-S ベース）',
    color: 'border-l-4 border-orange-500',
  },
  {
    number: '④',
    name: '達成動機',
    question: '「もっと上を目指したい」と思えるか？',
    theory: 'McClelland (1961) の達成動機理論',
    measurement: 'Layer2: 10問（AMS-R ベース）',
    color: 'border-l-4 border-red-500',
  },
  {
    number: '⑤',
    name: '自律的動機',
    question: 'やる理由は「自分の中」にあるか？',
    theory: 'Deci & Ryan (2000) の自己決定理論',
    measurement: 'Layer2: 2問（SDTベース）',
    color: 'border-l-4 border-green-500',
  },
  {
    number: '⑥',
    name: '自己効力感',
    question: '「自分ならできる」と思えるか？',
    theory: 'Bandura (1997) / Chen et al. (2001)',
    measurement: 'Layer2: 2問（NGSEベース）',
    color: 'border-l-4 border-cyan-500',
  },
  {
    number: '⑦',
    name: '成長マインドセット',
    question: '失敗を「学びの機会」に変えられるか？',
    theory: 'Dweck (1999, 2006) の暗黙理論',
    measurement: 'Layer2: 2問（Implicit Theories ベース）',
    color: 'border-l-4 border-yellow-500',
  },
]

const references = [
  'Seligman, M. E. P., & Schulman, P. (1986). Explanatory style as a predictor of productivity and quitting among life insurance sales agents. Journal of Personality and Social Psychology, 50(4), 832-838.',
  'Duckworth, A. L., Peterson, C., Matthews, M. D., & Kelly, D. R. (2007). Grit: Perseverance and passion for long-term goals. Journal of Personality and Social Psychology, 92(6), 1087-1101.',
  'Duckworth, A. L., & Quinn, P. D. (2009). Development and validation of the Short Grit Scale (Grit-S). Journal of Personality Assessment, 91(2), 166-174.',
  'Costa, P. T., & McCrae, R. R. (1992). Revised NEO Personality Inventory (NEO-PI-R) and NEO Five-Factor Inventory (NEO-FFI) professional manual. Psychological Assessment Resources.',
  'Soto, C. J., & John, O. P. (2017). The next Big Five Inventory (BFI-2). Journal of Personality and Social Psychology, 113(1), 117-143.',
  'McClelland, D. C. (1961). The achieving society. Van Nostrand.',
  'Lang, J. W. B., & Fries, S. (2006). A revised 10-item version of the Achievement Motives Scale. European Journal of Psychological Assessment, 22(3), 216-224.',
  'Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. Psychological Inquiry, 11(4), 227-268.',
  'Bandura, A. (1997). Self-efficacy: The exercise of control. W. H. Freeman.',
  'Chen, G., Gully, S. M., & Eden, D. (2001). Validation of a new general self-efficacy scale. Organizational Research Methods, 4(1), 62-83.',
  'Dweck, C. S. (1999). Self-theories: Their role in motivation, personality, and development. Psychology Press.',
  'Dweck, C. S. (2006). Mindset: The new psychology of success. Random House.',
  'Luthans, F., Youssef, C. M., & Avolio, B. J. (2007). Psychological capital. Oxford University Press.',
  'Barrick, M. R., & Mount, M. K. (1991). The Big Five personality dimensions and job performance. Personnel Psychology, 44(1), 1-26.',
  'Gross, J. J. (1998). The emerging field of emotion regulation. Review of General Psychology, 2(3), 271-299.',
]

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">

        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500 tracking-widest uppercase">MIRROR</p>
          <h1 className="text-3xl font-bold text-white">この診断が測っているもの</h1>
          <p className="text-gray-400 leading-relaxed">
            逆境でも折れずに成果を出し続ける力——その構造を科学的に分解します。
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-lg font-semibold text-white mb-4">ひとことで言うと</h2>
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>MIRRORが測っているのは「逆境持続力」——つらい環境やプレッシャーの中でも、折れずに成果を出し続けられる力です。</p>
            <p>これは単なる「メンタルの強さ」ではありません。「楽観性」「粘り強さ」「感情のコントロール」「挑戦への意欲」「やる理由の質」「自信」「成長への信念」——7つの心理的要素が因果関係でつながったチェーンです。</p>
            <p>たとえば、困難な出来事が起きたとき。まず「これは一時的な問題だ」と思えるか（楽観帰属）。次に感情が崩れないか（情緒安定性）。そして行動を続けられるか（粘り強さ）。この順序が重要で、どこかひとつが欠けるとチェーン全体が崩れます。</p>
            <p>逆に言えば、「どこが弱いか」が分かれば、そこだけをピンポイントで強化できます。MIRRORは、あなたのチェーンのどこが強く、どこに伸びしろがあるかを特定する診断です。</p>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-6">7つの心理的関門</h2>
          <div className="space-y-2">
            {gates.map((gate, i) => (
              <div key={gate.number}>
                <div className={`bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 ${gate.color}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 font-mono text-sm shrink-0">{gate.number}</span>
                    <div className="space-y-1">
                      <p className="font-semibold text-white text-sm">{gate.name}</p>
                      <p className="text-gray-300 text-sm">{gate.question}</p>
                      <p className="text-xs text-gray-500">📖 {gate.theory}</p>
                      <p className="text-xs text-gray-500">📊 {gate.measurement}</p>
                    </div>
                  </div>
                </div>
                {i < gates.length - 1 && (
                  <div className="text-center text-gray-600 py-1 text-lg">↓</div>
                )}
              </div>
            ))}
            <div className="text-center text-gray-600 py-1 text-lg">↓</div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 text-center">
              <p className="text-white font-semibold">逆境下でも持続的に成果を出せる</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">MBTIや一般的な性格診断との違い</h2>
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>MBTIは「あなたはどんなタイプか」を分類します。MIRRORは「あなたは逆境でどう反応するか」を予測します。</p>
            <p>MBTIは自己申告の好み（外向/内向、思考/感情など）を聞きますが、MIRRORはシナリオベースの状況判断テスト（SJT）と、7つの検証済み学術尺度を組み合わせています。「こういう場面で自分はどうするか」を実際に判断してもらうことで、自己申告だけでは見えない行動パターンを捉えます。</p>
            <p>Seligmanの帰属スタイル研究では、楽観的な帰属スタイルの保険営業パーソンは悲観群より37%高い業績を上げ、離職率も半分でした。MIRRORはこの知見を応用し、「どのような思考パターンの人が、高ストレス環境で成果を出し続けられるか」を予測します。</p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          <p className="text-sm text-gray-500 tracking-wide uppercase mb-2">採用担当者・マネージャーの方へ</p>
          <h2 className="text-lg font-semibold text-white mb-4">この診断の活用方法</h2>
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>MIRRORは、候補者の「高ストレス環境での持続可能性」を予測するために設計されています。面接では見えにくい心理的レジリエンスの構造を、7つの学術的フレームワークに基づいて可視化します。</p>
            <p>診断結果は3つのゾーン（Green/Yellow/Red）と13のサブパターンに分類されます。Greenは「自走可能」、Yellowは「適切なオンボーディングがあれば活躍可能」、Redは「現時点ではミスマッチのリスクが高い」を意味します。これは合否判定ではなく、どのような支援体制が必要かを示すものです。</p>
            <p>特にYellowゾーンの候補者に対しては、「最初の90日間の1on1設計」「メンターの配置」「段階的な目標設定」など、具体的なオンボーディング戦略を結果レポートに含めています。放置型マネジメントとの相性が悪い候補者を事前に特定することで、早期離職の予防に活用できます。</p>
            <p>主な参考理論: Seligman帰属スタイル理論 (1986)、Duckworth Grit理論 (2007)、Costa & McCrae Big Five (1992)、McClelland達成動機理論 (1961)、Deci & Ryan自己決定理論 (2000)、Bandura自己効力感理論 (1997)、Dweck成長マインドセット理論 (2006)。</p>
          </div>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">参考文献</h2>
          <ul className="text-sm text-gray-400 space-y-2">
            {references.map((ref, i) => (
              <li key={i} className="leading-relaxed">— {ref}</li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center space-y-2 pt-4">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            診断を受ける →
          </button>
          <p className="text-xs text-gray-500">無料・約10分・登録不要</p>
        </div>

      </div>
    </div>
  )
}
