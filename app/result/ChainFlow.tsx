'use client'

export default function ChainFlow({
  os, es, se, pe,
}: {
  os: number; es: number; se: number; pe: number
}) {
  const nodes = [
    { label: '逆境の解釈', sub: 'OS', score: os },
    { label: '感情の安定', sub: 'ES', score: es },
    { label: '自己効力感', sub: 'SE', score: se },
    { label: '努力の持続', sub: 'PE', score: pe },
  ]

  const color = (s: number) =>
    s >= 70 ? 'bg-green-900/50 border-green-500 text-green-300' :
    s >= 40 ? 'bg-yellow-900/50 border-yellow-500 text-yellow-300' :
              'bg-red-900/50 border-red-500 text-red-300'

  const arrowColor = (s: number) =>
    s >= 70 ? 'text-green-500' :
    s >= 40 ? 'text-yellow-500' :
              'text-red-500'

  const bottleneck = nodes.reduce((m, n) => n.score < m.score ? n : m)

  const messages: Record<string, string> = {
    OS: '逆境をどう解釈するか（OS）がボトルネックです。困難を「一時的で、この場面に限ったこと」と捉え直す訓練が最もインパクトのある改善策です。',
    ES: '感情の安定性（ES）が相対的に低く、逆境時にネガティブ感情が持続しやすい傾向があります。マインドフルネスや認知行動療法的セルフモニタリングが有効です。',
    SE: '自己効力感（SE）が相対的に低い状態です。「自分にはできる」という信念を小さな成功体験の蓄積で育てることが最優先です。',
    PE: '努力の持続力（PE）が相対的に低い状態です。目標を小さく分解し達成感を積み重ねる「スモールウィン戦略」が効果的です。',
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">持続の連鎖フロー</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          困難に直面したとき、人は「解釈→感情→自信→行動」の連鎖を経て努力を続けるか決めます。
        </p>
      </div>

      <div className="flex items-center justify-between gap-1">
        {nodes.map((n, i) => (
          <div key={n.sub} className="flex items-center gap-1">
            <div className={`border rounded-xl px-3 py-2 text-center min-w-0 ${color(n.score)}`}>
              <p className="text-xs font-medium leading-tight">{n.label}</p>
              <p className="text-lg font-bold mt-0.5">{n.score}</p>
              <p className="text-xs opacity-70">{n.sub}</p>
            </div>
            {i < nodes.length - 1 && (
              <span className={`text-xl shrink-0 ${arrowColor(n.score)}`}>→</span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-900/60 rounded-xl p-4 space-y-1">
        <p className="text-xs font-semibold text-orange-400">
          ボトルネック: {bottleneck.label}（{bottleneck.sub}: {bottleneck.score}）
        </p>
        <p className="text-xs text-gray-300 leading-relaxed">{messages[bottleneck.sub]}</p>
      </div>
    </div>
  )
}
