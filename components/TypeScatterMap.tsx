'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { PERSONALITY_TYPES } from '@/lib/scoring'

function axisCodeFromKey(key: string): string {
  return `OS-${key[0]} / A-${key[1]} / B-${key[2]} / C-${key[3]}`
}

// Positions: key → { left%, top% }
// B axis = key[2]: B-H → right half, B-L → left half
// A axis = key[1]: A-H → top half, A-L → bottom half
const TYPE_POSITIONS: Record<string, { left: number; top: number }> = {
  // Right-top (B-H, A-H) - blue / executor
  HHHH: { left: 78, top: 12 },
  HHHL: { left: 78, top: 28 },
  LHHH: { left: 62, top: 12 },
  LHHL: { left: 62, top: 28 },
  // Left-top (B-L, A-H) - amber / challenger
  HHLH: { left: 38, top: 12 },
  HHLL: { left: 38, top: 28 },
  LHLH: { left: 22, top: 12 },
  LHLL: { left: 22, top: 28 },
  // Right-bottom (B-H, A-L) - emerald / stable
  HLHH: { left: 78, top: 62 },
  HLHL: { left: 78, top: 78 },
  LLHH: { left: 62, top: 62 },
  LLHL: { left: 62, top: 78 },
  // Left-bottom (B-L, A-L) - rose / explorer
  HLLH: { left: 38, top: 62 },
  HLLL: { left: 38, top: 78 },
  LLLH: { left: 22, top: 62 },
  LLLL: { left: 22, top: 78 },
}

// Returns glowing orb style per quadrant + C/OS modifiers
function getNodeStyle(key: string, isHovered: boolean): CSSProperties {
  const a = key[1]
  const b = key[2]
  const os = key[0]
  const c = key[3]

  // C-H: strong glow, C-L: weaker glow
  const glowBase = c === 'H' ? 24 : 14
  const glowInner = c === 'H' ? 8 : 5
  // OS-H: bright center (0.95), OS-L: dimmer center (0.7)
  const centerAlpha = os === 'H' ? 0.95 : 0.7

  let gradient: string
  let shadowRgb: string
  let borderColor: string

  if (a === 'H' && b === 'H') {
    // Blue: executor
    gradient = `radial-gradient(circle at 35% 35%, rgba(147,197,253,${centerAlpha}), rgba(96,165,250,0.7), rgba(59,130,246,0.3))`
    shadowRgb = '59,130,246'
    borderColor = 'rgba(147,197,253,0.4)'
  } else if (a === 'H' && b === 'L') {
    // Amber: challenger
    gradient = `radial-gradient(circle at 35% 35%, rgba(252,211,77,${centerAlpha}), rgba(245,158,11,0.7), rgba(217,119,6,0.3))`
    shadowRgb = '245,158,11'
    borderColor = 'rgba(252,211,77,0.4)'
  } else if (a === 'L' && b === 'H') {
    // Emerald: stable
    gradient = `radial-gradient(circle at 35% 35%, rgba(110,231,183,${centerAlpha}), rgba(52,211,153,0.7), rgba(16,185,129,0.3))`
    shadowRgb = '16,185,129'
    borderColor = 'rgba(110,231,183,0.4)'
  } else {
    // Rose: explorer
    gradient = `radial-gradient(circle at 35% 35%, rgba(253,164,175,${centerAlpha}), rgba(251,113,133,0.7), rgba(244,63,94,0.3))`
    shadowRgb = '244,63,94'
    borderColor = 'rgba(253,164,175,0.4)'
  }

  const mult = isHovered ? 1.5 : 1
  const s1 = Math.round(glowBase * mult)
  const s2 = Math.round(glowInner * mult)
  const a1 = isHovered ? 0.7 : 0.5
  const a2 = isHovered ? 0.5 : 0.3

  return {
    background: gradient,
    boxShadow: `0 0 ${s1}px rgba(${shadowRgb},${a1}), 0 0 ${s2}px rgba(${shadowRgb},${a2})`,
    border: `1px solid ${borderColor}`,
    backdropFilter: 'blur(2px)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
  }
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

      {/* Layer 1: Quadrant backgrounds */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="bg-amber-950/30" /> {/* top-left: challenger */}
        <div className="bg-blue-950/30" />  {/* top-right: executor */}
        <div className="bg-rose-950/30" />  {/* bottom-left: explorer */}
        <div className="bg-emerald-950/30" /> {/* bottom-right: stable */}
      </div>

      {/* Layer 2: Cross lines + zone labels + axis labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal line at exact 50% */}
        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-400 opacity-30" />
        {/* Vertical line at exact 50% */}
        <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-gray-400 opacity-30" />

        {/* Zone labels — centered in each quadrant */}
        <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 text-amber-400 text-xs font-bold opacity-20 whitespace-nowrap">
          挑戦者ゾーン
        </div>
        <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 text-blue-400 text-xs font-bold opacity-20 whitespace-nowrap">
          実行者ゾーン
        </div>
        <div className="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2 text-rose-400 text-xs font-bold opacity-20 whitespace-nowrap">
          模索者ゾーン
        </div>
        <div className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold opacity-20 whitespace-nowrap">
          安定者ゾーン
        </div>

        {/* Axis labels — at the tips of cross lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap pt-1">
          粘り強さ ↑
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap pb-1">
          ↓ 柔軟探索
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap pl-1">
          ← 感情の波
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap pr-1">
          情緒安定 →
        </div>
      </div>

      {/* Layer 3: Type nodes */}
      <div className="absolute inset-0">
        {Object.keys(TYPE_POSITIONS).map((key) => {
          const pos = TYPE_POSITIONS[key]
          const type = PERSONALITY_TYPES[key]
          if (!type) return null
          const isUser = key === userTypeKey
          const isActive = activeKey === key

          const nodeStyle = getNodeStyle(key, isActive)

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
              {/* Glowing orb node */}
              <div
                className={`w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-bold text-xs leading-none ${isUser ? 'ring-2 ring-white animate-pulse' : ''}`}
                style={{
                  ...nodeStyle,
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                {getShortName(key)}
              </div>

              {/* "あなた" label */}
              {isUser && (
                <div className="absolute left-full ml-1.5 top-1/2 -translate-y-1/2 text-[10px] text-white whitespace-nowrap bg-gray-900/80 px-1.5 py-0.5 rounded pointer-events-none">
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
    </div>
  )
}
