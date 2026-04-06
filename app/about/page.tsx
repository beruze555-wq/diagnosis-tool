'use client'

import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  const mainAxes = [
    {
      number: '①',
      name: '自己効力感（SE）',
      theory: 'NGSE — New General Self-Efficacy Scale',
      author: 'Chen, Gully & Eden (2001)',
      description: '「自分ならできる」という信念の強さ。困難な課題に直面しても行動を起こし、粘り続けるための最も強力な心理的資源です。',
      measurement: 'NGSE 8項目（5段階評価）',
      evidence: 'Stajkovic & Luthans (1998) のメタ分析（114研究、N=21,616）で、パフォーマンスとの相関 r=.38。Robbins et al. (2004) では学業継続（retention）との相関 ρ=.36。個人特性の中で最も強力な予測因子の一つ。',
      accentFrom: 'from-blue-500',
      accentTo: 'to-cyan-500',
      numberColor: 'text-blue-400',
    },
    {
      number: '②',
      name: '持続的努力（PE）',
      theory: 'Grit-S Perseverance of Effort subscale',
      author: 'Duckworth & Quinn (2009)',
      description: '困難に直面しても諦めず、最後までやり遂げる傾向。Gritの2因子のうち、成果を予測する主要因子です。',
      measurement: 'Grit-S PE 5項目（5段階評価）',
      evidence: 'Credé et al. (2017) のメタ分析（88サンプル、N=66,807）で、PEの基準関連妥当性がCI（興味の一貫性）および複合Gritスコアを上回ることが示された（ρ≈.28）。',
      accentFrom: 'from-amber-500',
      accentTo: 'to-orange-500',
      numberColor: 'text-amber-400',
    },
    {
      number: '③',
      name: '逆境解釈力（OS）',
      theory: 'ASQ — Attributional Style Questionnaire（改変版）',
      author: 'Peterson & Seligman (1984)',
      description: '逆境の原因を「一時的か永続的か」「限定的か全般的か」「外的か内的か」で解釈する認知スタイル。楽観的な帰属スタイルは、困難からの回復力を直接予測します。',
      measurement: '6つの逆境シナリオ × 3帰属次元 = 18問（7段階評価）',
      evidence: 'Seligman & Schulman (1986) の保険営業研究で、楽観的帰属スタイルの営業員は悲観的な営業員に比べて離職率が半分。Sweeney et al. (1986) のメタ分析（104研究、N≈15,000）で3次元の効果量がほぼ同等であることを確認。',
      accentFrom: 'from-purple-500',
      accentTo: 'to-indigo-500',
      numberColor: 'text-purple-400',
    },
    {
      number: '④',
      name: '情緒安定性（ES）',
      theory: 'BFI-2-J — Big Five Inventory 2 日本語版（神経症傾向の逆転）',
      author: 'Soto & John (2017)',
      description: 'ストレス下で感情的に安定し、冷静さを保てる傾向。逆境時に感情が崩れない力は、自己効力感や努力の持続を支える土台です。',
      measurement: 'BFI-2-J 神経症傾向 10項目（5段階評価、逆転スコア）',
      evidence: 'Eschleman et al. (2010) のハーディネス・メタ分析で、ストレス下でのパフォーマンスとの相関 r=.35。Judge et al. (2002) のBig Fiveメタ分析でも、神経症傾向は職務パフォーマンスの安定した予測因子。',
      accentFrom: 'from-emerald-500',
      accentTo: 'to-teal-500',
      numberColor: 'text-emerald-400',
    },
  ]

  const deepAnalysisItems = [
    {
      name: '自律的動機づけ（AM）',
      theory: '自己決定理論（SDT）/ BPNS自律性サブスケール',
      author: 'Deci & Ryan (1985); Van den Broeck et al. (2010)',
      description: '「やらされている」のではなく「自分で選んでいる」と感じる度合い。自律的動機づけが高い人は、困難時にも踏ん張りやすい。',
      measurement: 'SDT/BPNS 6項目（5段階評価）',
      evidence: 'SDTメタ分析（k=192、N=93,552）で、自律的動機づけが仕事のエンゲージメント・パフォーマンスと正の関連を確認。',
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

  const references = [
    'Bandura, A. (1997). Self-efficacy: The exercise of control. W.H. Freeman.',
    'Chen, G., Gully, S. M., & Eden, D. (2001). Validation of a new general self-efficacy scale. Organizational Research Methods, 4(1), 62-83.',
    'Credé, M., Tynan, M. C., & Harms, P. D. (2017). Much ado about grit: A meta-analytic synthesis of the grit literature. Journal of Personality and Social Psychology, 113(3), 492-511.',
    'Deci, E. L., & Ryan, R. M. (1985). Intrinsic motivation and self-determination in human behavior. Plenum.',
    'Duckworth, A. L., & Quinn, P. D. (2009). Development and validation of the Short Grit Scale (Grit-S). Journal of Personality Assessment, 91(2), 166-174.',
    'Eschleman, K. J., Bowling, N. A., & Alarcon, G. M. (2010). A meta-analytic examination of hardiness. International Journal of Stress Management, 17(4), 277-307.',
    'Peterson, C., & Seligman, M. E. P. (1984). Causal explanations as a risk factor for depression. Psychological Review, 91(3), 347-374.',
    'Robbins, S. B., et al. (2004). Do psychosocial and study skill factors predict college outcomes? Psychological Bulletin, 130(2), 261-288.',
    'Seligman, M. E. P., & Schulman, P. (1986). Explanatory style as a predictor of productivity and quitting among life insurance sales agents. Journal of Personality and Social Psychology, 50(4), 832-838.',
    'Soto, C. J., & John, O. P. (2017). The next Big Five Inventory (BFI-2). Journal of Personality and Social Psychology, 113(1), 117-143.',
    'Stajkovic, A. D., & Luthans, F. (1998). Self-efficacy and work-related performance: A meta-analysis. Psychological Bulletin, 124(2), 240-261.',
    'Sweeney, P. D., Anderson, K., & Bailey, S. (1986). Attributional style in depression: A meta-analytic review. Journal of Personality and Social Psychology, 50(5), 974-991.',
  ]

  return (
    <div className="min-h-screen bg-gray-900 pb-20">

      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur px-4 py-3 border-b border-gray-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 tracking-wide">MIRROR</p>
            <h1 className="text-lg font-bold text-white">科学的基盤</h1>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600"
          >
            ← 戻る
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-8">

        {/* Page intro */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white">MIRRORの科学的基盤</h2>
          <p className="text-sm text-gray-400">メタ分析で検証された4軸モデル</p>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">
          この診断は、「困難な状況でどれだけ努力を持続できるか」を予測する心理的特性を、
          メタ分析（複数の研究結果を統合した大規模分析）で最も高い予測力が確認されている
          構成概念に基づいて測定しています。
        </p>

        {/* 持続の連鎖モデル */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">持続の連鎖モデル</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              困難に直面したとき、人は以下の心理的連鎖を経て、努力を続けるか中断するかを決めます。
              MIRRORはこの連鎖の各段階を測定し、どこが強くどこにボトルネックがあるかを可視化します。
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1 text-xs">
            <span className="text-gray-400 px-2 py-1 bg-gray-900/60 rounded-lg">逆境発生</span>
            <span className="text-gray-600">→</span>
            <span className="text-purple-300 px-2 py-1 bg-purple-900/30 rounded-lg font-medium">解釈 OS</span>
            <span className="text-gray-600">→</span>
            <span className="text-emerald-300 px-2 py-1 bg-emerald-900/30 rounded-lg font-medium">感情 ES</span>
            <span className="text-gray-600">→</span>
            <span className="text-blue-300 px-2 py-1 bg-blue-900/30 rounded-lg font-medium">自信 SE</span>
            <span className="text-gray-600">→</span>
            <span className="text-amber-300 px-2 py-1 bg-amber-900/30 rounded-lg font-medium">持続 PE</span>
            <span className="text-gray-600">→</span>
            <span className="text-gray-400 px-2 py-1 bg-gray-900/60 rounded-lg">成果</span>
          </div>
        </div>

        {/* メイン4軸 */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">メイン4軸（Tier 1）</h2>
          <p className="text-sm text-gray-400">
            タイプ判定に使用される4つの主要指標です。すべてメタ分析で困難下での持続力との関連が確認されています。
          </p>
          {mainAxes.map((axis) => (
            <div key={axis.name} className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${axis.accentFrom} ${axis.accentTo}`} />
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className={`text-2xl font-bold shrink-0 ${axis.numberColor}`}>{axis.number}</span>
                  <div>
                    <h3 className="font-bold text-white">{axis.name}</h3>
                    <p className="text-xs text-gray-500">{axis.theory}</p>
                    <p className="text-xs text-gray-600">{axis.author}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{axis.description}</p>
                <div className="space-y-1.5 pt-1 border-t border-gray-700/50">
                  <p className="text-xs text-gray-400">
                    <span className="text-gray-500 font-medium">測定方法: </span>{axis.measurement}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-gray-500 font-medium">科学的根拠: </span>{axis.evidence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Analysis */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">補助指標（Tier 2）</h2>
            <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">Deep Analysis</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            タイプ判定には使用しませんが、自己理解を深めるための参考指標として結果画面に表示されます。
          </p>
          <div className="space-y-4">
            {deepAnalysisItems.map((item) => (
              <div key={item.name} className="bg-gray-800/60 rounded-xl p-4 space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-200 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.theory}</p>
                  <p className="text-xs text-gray-600">{item.author}</p>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
                <div className="space-y-1 pt-1 border-t border-gray-700/30">
                  <p className="text-xs text-gray-400">
                    <span className="text-gray-500 font-medium">測定方法: </span>{item.measurement}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-gray-500 font-medium">科学的根拠: </span>{item.evidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 16タイプ */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="p-6 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">16タイプ判定</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              SE・PE・OS・ESの4軸それぞれを高（H: 60以上）/低（L: 60未満）に分類し、
              2⁴ = 16のプロファイルタイプを判定します。各タイプには、困難時の特徴的な反応パターンと
              具体的な改善アドバイスが含まれます。
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              ※ タイプは「今の状態」のスナップショットであり、固定的な性格分類ではありません。
              各軸のスコアは経験や訓練によって変化します。タイプ名は理解しやすさのための目安であり、
              各軸の数値スコアがあなたの正確なプロファイルです。
            </p>
          </div>
        </div>

        {/* 設問構成 */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">設問構成</p>
          <div className="space-y-2">
            {[
              { section: 'Layer 1（シナリオ）',   count: '18問', detail: '6つの逆境場面 × 帰属3問' },
              { section: 'SE（自己効力感）',       count: '8問',  detail: 'NGSE全8項目' },
              { section: 'PE（持続的努力）',       count: '5問',  detail: 'Grit-S PE 5項目' },
              { section: 'CI（興味の一貫性）',     count: '5問',  detail: 'Grit-S CI 5項目' },
              { section: 'ES（情緒安定性）',       count: '10問', detail: 'BFI-2-J 神経症傾向10項目' },
              { section: 'AM（自律的動機づけ）',   count: '6問',  detail: 'SDT/BPNS 6項目' },
            ].map((row) => (
              <div key={row.section} className="flex items-center gap-3 py-2 border-b border-gray-700/40 last:border-0">
                <span className="text-sm text-gray-300 w-44 shrink-0">{row.section}</span>
                <span className="text-sm font-bold text-white w-10 shrink-0">{row.count}</span>
                <span className="text-xs text-gray-500">{row.detail}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-bold text-white w-44 shrink-0">合計</span>
              <span className="text-sm font-bold text-blue-400 w-10 shrink-0">52問</span>
              <span className="text-xs text-gray-500">所要時間: 約10〜13分</span>
            </div>
          </div>
        </div>

        {/* 参考文献 */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">主要参考文献</p>
          <ul className="space-y-2">
            {references.map((ref, i) => (
              <li key={i} className="text-xs text-gray-500 leading-relaxed">— {ref}</li>
            ))}
          </ul>
        </div>

        {/* 採用担当者・経営者の方へ */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="p-6 space-y-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">採用担当者・経営者の方へ</p>
            <h2 className="text-base font-bold text-white">この診断結果の読み方</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              MIRORの4軸は「逆境下での持続力」を構成する要素です。採用やチーム編成において、以下の視点で活用できます。
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-blue-400 mb-2">配置の目安</p>
                <div className="space-y-3">
                  <div className="bg-gray-900/60 rounded-xl p-4">
                    <p className="text-xs font-semibold text-emerald-400 mb-1">新規事業・スタートアップに配置したい場合</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      → SE（自己効力感）と OS（楽観的帰属）を見てください。「自分にはできる」と信じ、逆境を一時的と捉えられる人材が、不確実性の高い環境で力を発揮します。
                    </p>
                  </div>
                  <div className="bg-gray-900/60 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-400 mb-1">既存事業の安定運用に配置したい場合</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      → PE（粘り強さ）と ES（情緒安定性）を見てください。粘り強く続け、感情的に安定している人材が、長期的なオペレーションを支えます。
                    </p>
                  </div>
                  <div className="bg-gray-900/60 rounded-xl p-4">
                    <p className="text-xs font-semibold text-purple-400 mb-1">マネージャー・リーダー候補</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      → 4軸すべてが中〜高（目安：各60以上）であることが望ましいですが、「全部高い＝最強」ではありません（下記参照）。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-400 mb-2">「全部高い」は万能ではない</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  4軸が全て高い人材（将軍タイプ）は、裁量権があり挑戦的な環境で最大の力を発揮します。しかし、マイクロマネジメントが強い環境や、指示待ちを求められるポジションでは、かえって消耗し、離職リスクが高まります。「優秀な人材」と「自社に合う人材」は異なります。スコアの高さではなく、ポジションとの適合性で判断してください。
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">4軸の相互関係</p>
                <ul className="space-y-2">
                  {[
                    'SE（自己効力感）が高くてもOS（楽観的帰属）が低い人は、「やれるはずなのにうまくいかない」と感じやすく、フラストレーションが溜まりやすい。',
                    'PE（粘り強さ）が高くてもES（情緒安定性）が低い人は、歯を食いしばって続けるが心身の消耗が激しい。燃え尽き防止のサポートが必要。',
                    'OS（楽観的帰属）が高くてもSE（自己効力感）が低い人は、「なんとかなる」と思っているが「自分がなんとかする」とは思えない。受動的な楽観に陥りやすい。',
                  ].map((text, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-400 leading-relaxed">
                      <span className="text-gray-600 shrink-0 mt-0.5">•</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div>
          <a
            href="/"
            className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-semibold text-sm text-center"
          >
            自分のタイプを診断する →
          </a>
        </div>

        <div className="text-center pb-4">
          <button
            onClick={() => router.back()}
            className="text-xs text-gray-600 hover:text-gray-500 transition-colors"
          >
            ← 戻る
          </button>
        </div>

      </div>
    </div>
  )
}
