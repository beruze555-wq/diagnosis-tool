'use client';
import { useRef } from 'react';

interface ShareCardProps {
  typeName: string;
  tagline: string;
  scores: { SE: number; PE: number; OS: number; ES: number };
}

export default function ShareCard({ typeName, tagline, scores }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0a0a0a',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `MIRROR-${typeName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0a0a0a',
      scale: 2,
    });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      if (navigator.share) {
        const file = new File([blob], `MIRROR-${typeName}.png`, { type: 'image/png' });
        await navigator.share({
          title: `MIRROR診断結果: ${typeName}`,
          text: `${tagline} #MIRROR診断`,
          files: [file],
        }).catch(() => {});
      } else {
        const text = encodeURIComponent(`私のメンタルタイプは「${typeName}」\n${tagline}\n#MIRROR診断`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      }
    });
  };

  const scoreItems = [
    { label: 'SE', value: scores.SE, color: '#3b82f6' },
    { label: 'PE', value: scores.PE, color: '#8b5cf6' },
    { label: 'OS', value: scores.OS, color: '#f59e0b' },
    { label: 'ES', value: scores.ES, color: '#10b981' },
  ];

  return (
    <div className="mt-2">
      {/* シェアカード本体 */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto p-8 rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}
      >
        {/* ロゴ */}
        <div className="text-center mb-2">
          <span className="text-xs tracking-widest text-gray-500 uppercase">MIRROR Mental Diagnosis</span>
        </div>

        {/* タイプ名 */}
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold text-white mb-2">{typeName}</h2>
          <p className="text-sm text-gray-400 italic">{tagline}</p>
        </div>

        {/* スコアバー */}
        <div className="space-y-3 mt-6">
          {scoreItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-6">{item.label}</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-xs font-mono text-gray-400 w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div className="text-center mt-6">
          <span className="text-[10px] text-gray-600">diagnosis-tool-ori6.vercel.app</span>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          📥 画像を保存
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          🔗 シェアする
        </button>
      </div>
    </div>
  );
}
