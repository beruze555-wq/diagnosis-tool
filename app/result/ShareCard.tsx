'use client';
import { useRef } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface ShareCardProps {
  typeName: string;
  tagline: string;
  scores: { SE: number; PE: number; OS: number; ES: number };
}

export default function ShareCard({ typeName, tagline, scores }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const radarData = [
    { axis: '自己効力感', value: scores.SE },
    { axis: '持続的努力', value: scores.PE },
    { axis: '逆境解釈力', value: scores.OS },
    { axis: '情緒安定性', value: scores.ES },
  ];

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

  return (
    <div className="mt-2">
      {/* シェアカード本体 */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '24px',
        }}
      >
        {/* ロゴ */}
        <div className="text-center mb-0.5">
          <span className="text-xl font-bold tracking-[0.2em] text-white">MIROR</span>
        </div>

        {/* サブタイトル */}
        <div className="text-center mb-5">
          <span className="text-[10px] text-gray-400 leading-relaxed">
            6つのメタ分析と10万人超の研究データが映す、あなたの「折れない力」
          </span>
        </div>

        {/* メインコンテンツ: 左にタイプ名+タグライン、右にレーダー */}
        <div className="flex items-center gap-3">
          {/* 左: タイプ名 + タグライン（左寄せ） */}
          <div className="flex-1 min-w-0">
            <h2 className="text-4xl font-bold text-white leading-tight">{typeName}</h2>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{tagline}</p>
          </div>

          {/* 右: レーダーチャート */}
          <div style={{ width: 160, height: 160, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: '#6b7280', fontSize: 8 }}
                />
                <Radar
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* URL（右寄せ・余白に合わせて下配置） */}
        <div className="text-right mt-4">
          <span className="text-[9px] text-gray-600">diagnosis-tool-ori6.vercel.app</span>
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
