const REFERENCES = [
  { scale: 'NGSE',    cite: 'Chen, Gully & Eden (2001)',          journal: 'Organizational Research Methods' },
  { scale: 'Grit-S',  cite: 'Duckworth & Quinn (2009)',           journal: 'Journal of Personality Assessment' },
  { scale: 'ASQ',     cite: 'Seligman et al. (1979)',             journal: 'Journal of Abnormal Psychology' },
  { scale: 'BFI-2-J', cite: 'Soto & John (2017)',                 journal: 'Journal of Personality & Social Psychology' },
  { scale: 'SDT',     cite: 'Deci & Ryan (2000)',                 journal: 'Psychological Inquiry' },
  { scale: 'RSQ',     cite: 'Downey & Feldman (1996)',            journal: 'Journal of Personality & Social Psychology' },
  { scale: 'Meta',    cite: 'Sweeney, Anderson & Bailey (1986)',  journal: 'JPSP — Attribution & Depression' },
  { scale: 'Meta',    cite: 'Stajkovic & Luthans (1998)',         journal: 'Psychological Bulletin — SE & Performance' },
  { scale: 'Meta',    cite: 'Credé, Tynan & Harms (2017)',        journal: 'Journal of Personality & Social Psychology' },
  { scale: 'Meta',    cite: 'Eschleman et al. (2010)',            journal: 'Journal of Occupational Psychology' },
  { scale: 'Meta',    cite: 'Barrick & Mount (1991)',             journal: 'Personnel Psychology — Big Five & Job' },
]

export default function ReferencesMarquee() {
  const items = [...REFERENCES, ...REFERENCES]
  return (
    <div className="py-4">
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ref-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
        }
        .ref-track:hover { animation-play-state: paused; }
      `}</style>
      <p className="text-center text-xs text-gray-600 mb-3 tracking-widest uppercase">References</p>
      <div className="overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-10 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #111827, transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-10 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #111827, transparent)' }} />
        <div className="ref-track">
          {items.map((ref, i) => (
            <div
              key={i}
              className="shrink-0 border rounded-xl px-4 py-3 mx-1.5"
              style={{ minWidth: '220px', background: 'rgba(31,41,55,0.5)', borderColor: 'rgba(55,65,81,0.4)' }}
            >
              <span className="block text-xs font-mono mb-1" style={{ color: 'rgba(96,165,250,0.8)' }}>{ref.scale}</span>
              <span className="block text-xs leading-snug font-medium text-gray-300">{ref.cite}</span>
              <span className="block text-xs leading-snug mt-0.5 text-gray-500">{ref.journal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
