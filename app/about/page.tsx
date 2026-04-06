'use client'

import Link from 'next/link'

export default function AboutPage() {
  const mainAxes = [
    {
      number: '①',
      name: '自己効力感（SE）',
      theory: 'NGSE — New General Self-Efficacy Scale',
      author: 'Chen, Gully & Eden (2001)',
      description: '「自分ならできる」という信念の強さ。困難な課題に直面しても行動を起こし、粘り続けるための最も強力な心理的資源です。',
      measurement: 'NGSE 8項目（5段階評価）',
      evidence: 'Stajkovic & Luthans (1998) のメタ分析（114研究、N=21,616）で、パフォーマンスとの相関 r=.38。Robbins et al. (2004) では学業継続（retention）との相関 ρ=.36。個人特性の中で最も強力な予測因子の一つ。',
    },
    {
      number: '②',
      name: '持続的努力（PE）',
      theory: 'Grit-S Perseverance of Effort subscale',
      author: 'Duckworth & Quinn (2009)',
      description: '困難に直面しても諦めず、最後までやり遂げる傾向。Gritの2因子のうち、成果を予測する主要因子です。',
      measurement: 'Grit-S PE 5項目（5段階評価）',
      evidence: 'Credé et al. (2017) のメタ分析（88サンプル、N=66,807）で、PEの基準関連妥当性がCI（興味の一貫性）および複合Gritスコアを上回ることが示された（ρ≈.28）。',
    },
    {
      number: '③',
      name: '逆境解釈力（OS）',
      theory: 'ASQ — Attributional Style Questionnaire（改変版）',
      author: 'Peterson & Seligman (1984)',
      description: '逆境の原因を「一時的か永続的か」「限定的か全般的か」「外的か内的か」で解釈する認知スタイル。楽観的な帰属スタイルは、困難からの回復力を直接予測します。',
      measurement: '6つの逆境シナリオ × 3帰属次元 = 18問（7段階評価）',
      evidence: 'Seligman & Schulman (1986) の保険営業研究で、楽観的帰属スタイルの営業員は悲観的な営業員に比べて離職率が半分。Sweeney et al. (1986) のメタ分析（104研究、N≈15,000）で3次元の効果量がほぼ同等であることを確認。',
    },
    {
      number: '④',
      name: '情緒安定性（ES）',
      theory: 'BFI-2-J — Big Five Inventory 2 日本語版（神経症傾向の逆転）',
      author: 'Soto & John (2017)',
      description: 'ストレス下で感情的に安定し、冷静さを保てる傾向。逆境時に感情が崩れない力は、自己効力感や努力の持続を支える土台です。',
      measurement: 'BFI-2-J 神経症傾向 10項目（5段階評価、逆転スコア）',
      evidence: 'Eschleman et al. (2010) のハーディネス・メタ分析で、ストレス下でのパフォーマンスとの相関 r=.35。Judge et al. (2002) のBig Fiveメタ分析でも、神経症傾向は職務パフォーマンスの安定した予測因子。',
    },
  ]

  const deepAnalysis = [
    {
      name: '自律的動機づけ（AM）',
      theory: '自己決定理論（SDT）/ BPNS自律性サブスケール',
      author: 'Deci & Ryan (1985); Van den Broeck et al. (2010)',
      description: '「やらされている」のではなく「自分で選んでいる」と感じる度合い。自律的動機づけが高い人は、困難時にも踏ん張りやすい。',
      measurement: 'SDT/BPNS 6項目（5段階評価）',
      evidence: 'SDTメタ分析（2026年、k=192、N=93,552）で、自律的動機づけが仕事のエンゲージメント・パフォーマンスと正の関連を確認。',
    },
    {
      name: '興味の一貫性（CI）',
      theory: 'Grit-S Consistency of Interest subscale',
      author: 'Duckworth & Quinn (2009)',
      description: '一つの分野への興味を長期間維持する傾向。PEとは独立した因子であり、長期的なキャリア発達の参考指標です。',
      measurement: 'Grit-S CI 5項目（5段階評価、逆転スコア）',
      evidence: 'Jachimowicz et al. (2018) は、CIが情熱と結びついた場合にパフォーマンスを予測することを示した。ただしCredé et al. (2017) では、CI単独の基準関連妥当性はPEより低い。',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">

        <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 inline-block">
          ← トップに戻る
        </Link>

        <h1 className="text-2xl font-bold mb-2">MIRRORの科学的基盤</h1>
        <p className="text-gray-600 mb-8">
          この診断は、「困難な状況でどれだけ努力を持続できるか」を予測する心理的特性を、
          メタ分析（複数の研究結果を統合した大規模分析）で最も高い予測力が確認されている
          構成概念に基づいて測定しています。
        </p>

        {/* 持続の連鎖モデル */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">持続の連鎖モデル</h2>
          <p className="text-gray-700 mb-4">
            困難に直面したとき、人は以下の心理的連鎖を経て、努力を続けるか中断するかを決めます。
            MIRRORはこの連鎖の各段階を測定し、どこが強くどこにボトルネックがあるかを可視化します。
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-center text-sm">
            <span className="font-bold">逆境発生</span>
            <span className="mx-2">→</span>
            <span className="font-bold text-blue-700">解釈（OS）</span>
            <span className="mx-2">→</span>
            <span className="font-bold text-blue-700">感情反応（ES）</span>
            <span className="mx-2">→</span>
            <span className="font-bold text-blue-700">自己効力感（SE）</span>
            <span className="mx-2">→</span>
            <span className="font-bold text-blue-700">努力持続（PE）</span>
            <span className="mx-2">→</span>
            <span className="font-bold">成果</span>
          </div>
        </section>

        {/* メイン4軸 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">メイン4軸（Tier 1）</h2>
          <p className="text-gray-600 mb-6">
            タイプ判定に使用される4つの主要指標です。すべてメタ分析で困難下での持続力との関連が確認されています。
          </p>
          <div className="space-y-6">
            {mainAxes.map((axis) => (
              <div key={axis.name} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl font-bold text-blue-600">{axis.number}</span>
                  <div>
                    <h3 className="font-bold text-lg">{axis.name}</h3>
                    <p className="text-sm text-gray-500">{axis.theory}</p>
                    <p className="text-xs text-gray-400">{axis.author}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{axis.description}</p>
                <div className="text-xs space-y-1">
                  <p><span className="font-semibold text-gray-600">測定方法:</span> {axis.measurement}</p>
                  <p><span className="font-semibold text-gray-600">科学的根拠:</span> {axis.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Analysis */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">補助指標（Tier 2 — Deep Analysis）</h2>
          <p className="text-gray-600 mb-6">
            メインの4軸を補完する追加情報です。タイプ判定には使用しませんが、自己理解を深めるための参考指標として表示されます。
          </p>
          <div className="space-y-6">
            {deepAnalysis.map((item) => (
              <div key={item.name} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{item.theory}</p>
                <p className="text-xs text-gray-400 mb-3">{item.author}</p>
                <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                <div className="text-xs space-y-1">
                  <p><span className="font-semibold text-gray-600">測定方法:</span> {item.measurement}</p>
                  <p><span className="font-semibold text-gray-600">科学的根拠:</span> {item.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 16タイプ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">16タイプ判定について</h2>
          <p className="text-gray-700 mb-4">
            SE・PE・OS・ESの4軸それぞれを高（H: 60以上）/低（L: 60未満）に分類し、
            2⁴ = 16のプロファイルタイプを判定します。各タイプには、困難時の特徴的な反応パターンと
            具体的な改善アドバイスが含まれます。
          </p>
          <p className="text-gray-600 text-sm">
            ※ タイプは「今の状態」のスナップショットであり、固定的な性格分類ではありません。
            各軸のスコアは経験や訓練によって変化します。タイプ名は理解しやすさのための目安であり、
            各軸の数値スコアがあなたの正確なプロファイルです。
          </p>
        </section>

        {/* 設問構成 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">設問構成</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-300">
                  <th className="py-2">セクション</th>
                  <th className="py-2">問数</th>
                  <th className="py-2">内容</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-2">Layer 1（シナリオ）</td>
                  <td className="py-2">18問</td>
                  <td className="py-2">6つの逆境場面 × 帰属3問</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">SE（自己効力感）</td>
                  <td className="py-2">8問</td>
                  <td className="py-2">NGSE全8項目</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">PE（持続的努力）</td>
                  <td className="py-2">5問</td>
                  <td className="py-2">Grit-S PE 5項目</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">CI（興味の一貫性）</td>
                  <td className="py-2">5問</td>
                  <td className="py-2">Grit-S CI 5項目</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">ES（情緒安定性）</td>
                  <td className="py-2">10問</td>
                  <td className="py-2">BFI-2-J 神経症傾向10項目</td>
                </tr>
                <tr>
                  <td className="py-2">AM（自律的動機づけ）</td>
                  <td className="py-2">6問</td>
                  <td className="py-2">SDT/BPNS 6項目</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-400 font-bold">
                  <td className="py-2">合計</td>
                  <td className="py-2">52問</td>
                  <td className="py-2">所要時間: 約10〜13分</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* 参考文献 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">主要参考文献</h2>
          <div className="text-xs text-gray-600 space-y-2">
            <p>Bandura, A. (1997). <em>Self-efficacy: The exercise of control.</em> W.H. Freeman.</p>
            <p>Chen, G., Gully, S. M., &amp; Eden, D. (2001). Validation of a new general self-efficacy scale. <em>Organizational Research Methods, 4</em>(1), 62-83.</p>
            <p>Credé, M., Tynan, M. C., &amp; Harms, P. D. (2017). Much ado about grit: A meta-analytic synthesis of the grit literature. <em>Journal of Personality and Social Psychology, 113</em>(3), 492-511.</p>
            <p>Deci, E. L., &amp; Ryan, R. M. (1985). <em>Intrinsic motivation and self-determination in human behavior.</em> Plenum.</p>
            <p>Duckworth, A. L., &amp; Quinn, P. D. (2009). Development and validation of the Short Grit Scale (Grit-S). <em>Journal of Personality Assessment, 91</em>(2), 166-174.</p>
            <p>Eschleman, K. J., Bowling, N. A., &amp; Alarcon, G. M. (2010). A meta-analytic examination of hardiness. <em>International Journal of Stress Management, 17</em>(4), 277-307.</p>
            <p>Peterson, C., &amp; Seligman, M. E. P. (1984). Causal explanations as a risk factor for depression. <em>Psychological Review, 91</em>(3), 347-374.</p>
            <p>Robbins, S. B., Lauver, K., Le, H., Davis, D., Langley, R., &amp; Carlstrom, A. (2004). Do psychosocial and study skill factors predict college outcomes? <em>Psychological Bulletin, 130</em>(2), 261-288.</p>
            <p>Seligman, M. E. P., &amp; Schulman, P. (1986). Explanatory style as a predictor of productivity and quitting among life insurance sales agents. <em>Journal of Personality and Social Psychology, 50</em>(4), 832-838.</p>
            <p>Soto, C. J., &amp; John, O. P. (2017). The next Big Five Inventory (BFI-2). <em>Journal of Personality and Social Psychology, 113</em>(1), 117-143.</p>
            <p>Stajkovic, A. D., &amp; Luthans, F. (1998). Self-efficacy and work-related performance: A meta-analysis. <em>Psychological Bulletin, 124</em>(2), 240-261.</p>
            <p>Sweeney, P. D., Anderson, K., &amp; Bailey, S. (1986). Attributional style in depression: A meta-analytic review. <em>Journal of Personality and Social Psychology, 50</em>(5), 974-991.</p>
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            診断を受ける
          </Link>
        </div>

      </div>
    </div>
  )
}
