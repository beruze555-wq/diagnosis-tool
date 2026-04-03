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
  HHHH: { left: 80, top: 16 },  // 突破者型   OS-H / C-H
  HHHL: { left: 80, top: 36 },  // 安定遂行型 OS-H / C-L
  LHHH: { left: 62, top: 16 },  // 堅実努力型 OS-L / C-H
  LHHL: { left: 62, top: 36 },  // 忍耐守備型 OS-L / C-L
  // Left-top (B-L, A-H) - amber / challenger
  HHLH: { left: 38, top: 16 },  // 情熱猪突型 OS-H / C-H
  HHLL: { left: 38, top: 36 },  // 楽観持久型 OS-H / C-L
  LHLH: { left: 20, top: 16 },  // 闘志内燃型 OS-L / C-H
  LHLL: { left: 20, top: 36 },  // 寡黙継続型 OS-L / C-L
  // Right-bottom (B-H, A-L) - emerald / stable
  HLHH: { left: 80, top: 62 },  // 戦略挑戦型 OS-H / C-H
  HLHL: { left: 80, top: 80 },  // 慎重楽観型 OS-H / C-L
  LLHH: { left: 62, top: 62 },  // 冷静分析型 OS-L / C-H
  LLHL: { left: 62, top: 80 },  // 受容安定型 OS-L / C-L
  // Left-bottom (B-L, A-L) - rose / explorer
  HLLH: { left: 38, top: 62 },  // 直感突撃型 OS-H / C-H
  HLLL: { left: 38, top: 80 },  // 楽天自由型 OS-H / C-L
  LLLH: { left: 20, top: 62 },  // 野心原石型 OS-L / C-H
  LLLL: { left: 20, top: 80 },  // 模索探求型 OS-L / C-L
}

// Returns glowing orb style per quadrant + shape/size from OS/C
// OS-H → rounded circle (borderRadius 50%), OS-L → rounded square (16px)
// C-H → large (72px), C-L → small (48px)
function getNodeStyle(key: string, isHovered: boolean): CSSProperties {
  const a = key[1]
  const b = key[2]
  const os = key[0]
  const c = key[3]

  // Unified glow intensity (C/OS differences now expressed via shape/size)
  const glowBase = 20
  const glowInner = 8

  // C-H: large node, C-L: small node
  const nodeSize = c === 'H' ? '72px' : '48px'
  // OS-H: circle, OS-L: rounded square
  const nodeRadius = os === 'H' ? '50%' : '16px'

  let gradient: string
  let shadowRgb: string
  let borderColor: string

  if (a === 'H' && b === 'H') {
    // Blue: executor
    gradient = 'radial-gradient(circle at 35% 35%, rgba(147,197,253,0.9), rgba(96,165,250,0.7), rgba(59,130,246,0.3))'
    shadowRgb = '59,130,246'
    borderColor = 'rgba(147,197,253,0.4)'
  } else if (a === 'H' && b === 'L') {
    // Amber: challenger
    gradient = 'radial-gradient(circle at 35% 35%, rgba(252,211,77,0.9), rgba(245,158,11,0.7), rgba(217,119,6,0.3))'
    shadowRgb = '245,158,11'
    borderColor = 'rgba(252,211,77,0.4)'
  } else if (a === 'L' && b === 'H') {
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
    <div className="relative z-0 isolate w-full max-w-3xl mx-auto aspect-square select-none overflow-hidden">

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

        {/* Zone labels — pinned to each quadrant corner to avoid overlapping nodes */}
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
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              onMouseEnter={() => setActiveKey(key)}
              onMouseLeave={() => setActiveKey(null)}
              onClick={() => setActiveKey(activeKey === key ? null : key)}
            >
              {/* Glowing orb node — size/shape from nodeStyle (width/height/borderRadius) */}
              <div
                className={`flex items-center justify-center text-white font-bold text-xs leading-none ${isUser ? 'ring-2 ring-white animate-pulse' : ''}`}
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
