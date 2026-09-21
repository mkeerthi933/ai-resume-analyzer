interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'lg';
}

export default function ScoreGauge({ score, label, size = 'lg' }: ScoreGaugeProps) {
  const radius = size === 'lg' ? 80 : 52;
  const strokeWidth = size === 'lg' ? 12 : 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    if (s >= 40) return '#f97316';
    return '#ef4444';
  };

  const color = getColor(score);
  const fontSize = size === 'lg' ? '2.5rem' : '1.5rem';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: (radius + strokeWidth) * 2, height: (radius + strokeWidth) * 2 }}>
        <svg
          width={(radius + strokeWidth) * 2}
          height={(radius + strokeWidth) * 2}
          className="-rotate-90"
        >
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold tabular-nums"
            style={{ fontSize, color, lineHeight: 1 }}
          >
            {score}
          </span>
          {size === 'lg' && (
            <span className="text-xs text-slate-500 mt-1">/ 100</span>
          )}
        </div>
      </div>
      <span className={`mt-3 font-medium text-slate-300 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        {label}
      </span>
    </div>
  );
}
