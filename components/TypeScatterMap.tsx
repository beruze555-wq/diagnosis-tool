'use client'

import { useState } from 'react'
import { PERSONALITY_TYPES } from '@/lib/scoring'

function axisCodeFromKey(key: string): string {
  return `OS-${key[0]} / A-${key[1]} / B-${key[2]} / C-${key[3]}`
}

// Positions: key → { left%, top% }
// B axis = key[2]: B-H → right half, B-L → left half
// A axis = key[1]: A-H → top half, A-L → bottom half
// OS sub-axis: OS-H → right within quadrant, OS-L → left within quadrant
// C sub-axis: C-H → top within quadrant, C-L → bottom within quadrant
const TYPE_POSITIONS: Record<string, { left: number; top: number }> = {
  // Right-top (B-H, A-H) - blue / executor
  HHHH: { left: 78, top: 12 }, // OS-H, C-H
  HHHL: { left: 78, top: 28 }, // OS-H, C-L
  LHHH: { left: 62, top: 12 }, // OS-L, C-H
  LHHL: { left: 62, top: 28 }, // OS-L, C-L
  // Left-top (B-L, A-H) - amber / challenger
  HHLH: { left: 38, top: 12 }, // OS-H, C-H
  HHLL: { left: 38, top: 28 }, // OS-H, C-L
  LHLH: { left: 22, top: 12 }, // OS-L, C-H
  LHLL: { left: 22, top: 28 }, // OS-L, C-L
  // Right-bottom (B-H, A-L) - emerald / stable
  HLHH: { left: 78, top: 62 }, // OS-H, C-H
  HLHL: { left: 78, top: 78 }, // OS-H, C-L
  LLHH: { left: 62, top: 62 }, // OS-L, C-H
  LLHL: { left: 62, top: 78 }, // OS-L, C-L
  // Left-bottom (B-L, A-L) - rose / explorer
  HLLH: { left: 38, top: 62 }, // OS-H, C-H
  HLLL: { left: 38, top: 78 }, // OS-H, C-L
  LLLH: { left: 22, top: 62 }, // OS-L, C-H
  LLLL: { left: 22, top: 78 }, // OS-L, C-L
}

function getTypeColor(key: string): string {
  const a = key[1]
  const b = key[2]
  const os = key[0]
  if (a === 'H' && b === 'H') return os === 'H' ? 'bg-blue-400' : 'bg-blue-700'
  if (a === 'H' && b === 'L') return os === 'H' ? 'bg-amber-400' : 'bg-amber-700'
  if (a === 'L' && b === 'H') return os === 'H' ? 'bg-emerald-400' : 'bg-emerald-700'
  return os === 'H' ? 'bg-rose-400' : 'bg-rose-700'
}

function getTypeSize(key: string): string {
  return key[3] === 'H' ? 'w-14 h-14 text-[10px]' : 'w-10 h-10 text-[9px]'
}

function getShortName(key: string): string {
  const type = PERSONALITY_TYPES[key]
  if (!type) return key.slice(0, 2)
  return type.name.slice(0, 2)
}

function getOneLiner(key: string): string {
  const type = PERSONALITY_TYPES[key]
  if (!type) return ''
  const first = type.paragraphs[0]
  const dotIdx = first.indexOf('。')
  return dotIdx >= 0 ? first.slice(0, dotIdx + 1) : first.slice(0, 60) + '…'
}

interface TypeScatterMapProps {
  userTypeKey?: string
}

export default function TypeScatterMap({ userTypeKey }: TypeScatterMapProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-square select-none">
      {/* Quadrant backgrounds */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-amber-950/30" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-950/30" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-rose-950/30" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-950/30" />

      {/* Cross lines */}
      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-400 opacity-30 pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-gray-400 opacity-30 pointer-events-none" />

      {/* Zone labels */}
      <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 text-amber-400 text-xs font-bold opacity-20 whitespace-nowrap pointer-events-none">
        挑戦者ゾーン
      </div>
      <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 text-blue-400 text-xs font-bold opacity-20 whitespace-nowrap pointer-events-none">
        実行者ゾーン
      </div>
      <div className="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2 text-rose-400 text-xs font-bold opacity-20 whitespace-nowrap pointer-events-none">
        模索者ゾーン
      </div>
      <div className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold opacity-20 whitespace-nowrap pointer-events-none">
        安定者ゾーン
      </div>

      {/* Axis labels — adjacent to cross lines */}
      <div className="absolute top-[50%] left-1 -translate-y-full text-[10px] text-gray-500 pointer-events-none whitespace-nowrap">
        ← 感情の波
      </div>
      <div className="absolute top-[50%] right-1 -translate-y-full text-[10px] text-gray-500 pointer-events-none whitespace-nowrap">
        情緒安定 →
      </div>
      <div className="absolute top-1 left-[50%] -translate-x-1/2 text-[10px] text-gray-500 pointer-events-none whitespace-nowrap">
        粘り強さ ↑
      </div>
      <div className="absolute bottom-1 left-[50%] -translate-x-1/2 text-[10px] text-gray-500 pointer-events-none whitespace-nowrap">
        ↓ 柔軟探索
      </div>

      {/* Type dots */}
      {Object.keys(TYPE_POSITIONS).map((key) => {
        const pos = TYPE_POSITIONS[key]
        const type = PERSONALITY_TYPES[key]
        if (!type) return null
        const bgColor = getTypeColor(key)
        const sizeClass = getTypeSize(key)
        const isUser = key === userTypeKey
        const isActive = activeKey === key

        // Tooltip direction based on position
        const tooltipLeft = pos.left > 60 ? undefined : '0'
        const tooltipRight = pos.left > 60 ? '0' : undefined
        const tooltipTop = pos.top > 60 ? undefined : '110%'
        const tooltipBottom = pos.top > 60 ? '110%' : undefined

        return (
          <div
            key={key}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            onMouseEnter={() => setActiveKey(key)}
            onMouseLeave={() => setActiveKey(null)}
            onClick={() => setActiveKey(activeKey === key ? null : key)}
          >
            {/* Dot */}
            <div
              className={`rounded-full flex items-center justify-center text-white font-bold leading-none ${bgColor} ${sizeClass} ${isUser ? 'ring-2 ring-white animate-pulse' : ''}`}
            >
              {getShortName(key)}
            </div>

            {/* "あなた" label */}
            {isUser && (
              <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 text-[10px] text-white whitespace-nowrap bg-gray-900/80 px-1 py-0.5 rounded pointer-events-none">
                ← あなた
              </div>
            )}

            {/* Tooltip */}
            {isActive && (
              <div
                className="absolute z-20 bg-gray-800 border border-gray-600 rounded-lg p-2 w-52 shadow-xl pointer-events-none"
                style={{
                  left: tooltipLeft,
                  right: tooltipRight,
                  top: tooltipTop,
                  bottom: tooltipBottom,
                }}
              >
                <p className="text-xs font-bold text-white mb-0.5">
                  {type.icon} {type.name}
                </p>
                <p className="text-[10px] text-gray-400 mb-1">{axisCodeFromKey(key)}</p>
                <p className="text-[10px] text-gray-300 leading-relaxed">{getOneLiner(key)}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
