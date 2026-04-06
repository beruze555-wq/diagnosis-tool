'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { PERSONALITY_TYPES } from '@/lib/scoring'

function axisCodeFromKey(key: string): string {
  return `SE-${key[0]} / PE-${key[1]} / OS-${key[2]} / ES-${key[3]}`
}

// Positions: key → { left%, top% }
// Key format: SE(0)-PE(1)-OS(2)-ES(3), each H=1 / L=0
// X (right=H): left = es*50 + se*25 + 12.5
// Y (top=H):   top  = (1-pe)*50 + (1-os)*25 + 12.5
// → HHHH lands at (87.5, 12.5) = most top-right; LLLL at (12.5, 87.5) = most bottom-left
const TYPE_POSITIONS: Record<string, { left: number; top: number }> = {
  // Top-right (PE-H, ES-H) - blue / executor
  HHHH: { left: 87.5, top: 12.5 },  // SE-H / OS-H
  HHLH: { left: 87.5, top: 37.5 },  // SE-H / OS-L
  LHHH: { left: 62.5, top: 12.5 },  // SE-L / OS-H
  LHLH: { left: 62.5, top: 37.5 },  // SE-L / OS-L
  // Top-left (PE-H, ES-L) - amber / challenger
  HHHL: { left: 37.5, top: 12.5 },  // SE-H / OS-H
  HHLL: { left: 37.5, top: 37.5 },  // SE-H / OS-L
  LHHL: { left: 12.5, top: 12.5 },  // SE-L / OS-H
  LHLL: { left: 12.5, top: 37.5 },  // SE-L / OS-L
  // Bottom-right (PE-L, ES-H) - emerald / stable
  HLHH: { left: 87.5, top: 62.5 },  // SE-H / OS-H
  HLLH: { left: 87.5, top: 87.5 },  // SE-H / OS-L
  LLHH: { left: 62.5, top: 62.5 },  // SE-L / OS-H
  LLLH: { left: 62.5, top: 87.5 },  // SE-L / OS-L
  // Bottom-left (PE-L, ES-L) - rose / explorer
  HLHL: { left: 37.5, top: 62.5 },  // SE-H / OS-H
  HLLL: { left: 37.5, top: 87.5 },  // SE-H / OS-L
  LLHL: { left: 12.5, top: 62.5 },  // SE-L / OS-H
  LLLL: { left: 12.5, top: 87.5 },  // SE-L / OS-L
}

// SE(key[0]): H → large (72px), L → small (48px)
// OS(key[2]): H → circle, L → rounded square
function getNodeStyle(key: string, isHovered: boolean): CSSProperties {
  const pe = key[1]
  const es = key[3]
  const se = key[0]
  const os = key[2]

  const glowBase = 20
  const glowInner = 8

  const nodeSize = se === 'H' ? '72px' : '48px'
  const nodeRadius = os === 'H' ? '50%' : '16px'

  let gradient: string
  let shadowRgb: string
  let borderColor: string

  if (pe === 'H' && es === 'H') {
    // Blue: executor
    gradient = 'radial-gradient(circle at 35% 35%, rgba(147,197,253,0.9), rgba(96,165,250,0.7), rgba(59,130,246,0.3))'
    shadowRgb = '59,130,246'
    borderColor = 'rgba(147,197,253,0.4)'
  } else if (pe === 'H' && es === 'L') {
    // Amber: challenger
    gradient = 'radial-gradient(circle at 35% 35%, rgba(252,211,77,0.9), rgba(245,158,11,0.7), rgba(217,119,6,0.3))'
    shadowRgb = '245,158,11'
    borderColor = 'rgba(252,211,77,0.4)'
  } else if (pe === 'L' && es === 'H') {
    // Emerald: stable
    gradient = 'radial-gradient(circle at 35% 35%, rgba(110,231,183,0.9), rgba(52,211,153,0.7), rgba(16,185,129,0.3))'
    shadowRgb = '16,185,129'
    borderColor = 'rgba(110,231,183,0.4)'
  } else {
    // Rose: explorer
    gradient = 'radial-gradient(circle at 35% 35%, rgba(253,164,175,0.9), rgba(251,113,133,0.7), rgba(244,63,94,0.3))'
    shadowRgb = '244,63,94'
    borderColor = 'rgba(253,164,175,0.4)'
  }

  const mult = isHovered ? 1.5 : 1
  const s1 = Math.round(glowBase * mult)
  const s2 = Math.round(glowInner * mult)
  const a1 = isHovered ? 0.7 : 0.5
  const a2 = isHovered ? 0.5 : 0.3

  return {
    width: nodeSize,
    height: nodeSize,
    borderRadius: nodeRadius,
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
  const desc = type.description
  const dotIdx = desc.indexOf('。')
  return dotIdx >= 0 ? desc.slice(0, dotIdx + 1) : desc.slice(0, 60) + '…'
}

interface TypeScatterMapProps {
  userTypeKey?: string
}

export default function TypeScatterMap({ userTypeKey }: TypeScatterMapProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  return (
    <div className="relative z-0 isolate w-full max-w-3xl mx-auto aspect-square select-none overflow-hidden">

      {/* Layer 1: Quadrant backgrounds */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="bg-amber-950/30" /> {/* top-left: challenger (PE-H/ES-L) */}
        <div className="bg-blue-950/30" />  {/* top-right: executor (PE-H/ES-H) */}
        <div className="bg-rose-950/30" />  {/* bottom-left: explorer (PE-L/ES-L) */}
        <div className="bg-emerald-950/30" /> {/* bottom-right: stable (PE-L/ES-H) */}
      </div>

      {/* Layer 2: Cross lines + zone labels + axis labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-400 opacity-30" />
        <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-gray-400 opacity-30" />

        <div className="absolute top-[4%] left-[4%] text-amber-400 text-sm font-semibold opacity-40 whitespace-nowrap">
          挑戦者ゾーン
        </div>
        <div className="absolute top-[4%] right-[4%] text-blue-400 text-sm font-semibold opacity-40 whitespace-nowrap text-right">
          実行者ゾーン
        </div>
        <div className="absolute bottom-[4%] left-[4%] text-rose-400 text-sm font-semibold opacity-40 whitespace-nowrap">
          模索者ゾーン
        </div>
        <div className="absolute bottom-[4%] right-[4%] text-emerald-400 text-sm font-semibold opacity-40 whitespace-nowrap text-right">
          安定者ゾーン
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap pt-1">
          持続的努力 ↑
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap pb-1">
          ↓ 低持久
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

          const tooltipLeft = pos.left > 60 ? undefined : '0'
          const tooltipRight = pos.left > 60 ? '0' : undefined
          const tooltipTop = pos.top > 60 ? undefined : '110%'
          const tooltipBottom = pos.top > 60 ? '110%' : undefined

          return (
            <div
              key={key}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              onMouseEnter={() => setActiveKey(key)}
              onMouseLeave={() => setActiveKey(null)}
              onClick={() => setActiveKey(activeKey === key ? null : key)}
            >
              <div
                className={`flex items-center justify-center text-white font-bold text-xs leading-none ${isUser ? 'ring-2 ring-white animate-pulse' : ''}`}
                style={{
                  ...nodeStyle,
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                {getShortName(key)}
              </div>

              {isUser && (
                <div className="absolute left-full ml-1.5 top-1/2 -translate-y-1/2 text-[10px] text-white whitespace-nowrap bg-gray-900/80 px-1.5 py-0.5 rounded pointer-events-none">
                  ← あなた
                </div>
              )}

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
                  <p className="text-xs font-bold text-white mb-0.5">{type.name}</p>
                  <p className="text-[10px] text-gray-500 mb-0.5">{type.subtitle}</p>
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
