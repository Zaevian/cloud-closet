import type { ItemCondition, ConditionDefect } from '../../types';

interface ConditionMeterProps {
  condition?: ItemCondition;
  score?: number;
  defects?: ConditionDefect[];
  inspectedDate?: string;
  compact?: boolean;
}

const severityColors = {
  minor: 'text-zinc-300 bg-zinc-800 border-zinc-600',
  moderate: 'text-amber-200 bg-amber-950 border-amber-700',
  major: 'text-red-200 bg-red-950 border-red-700',
};

const severityDot = {
  minor: 'bg-zinc-400',
  moderate: 'bg-amber-400',
  major: 'bg-red-400',
};

export function conditionLabel(c: ItemCondition) {
  if (c === 'like-new') return 'Like New';
  if (c === 'good') return 'Good';
  return 'Fair';
}

export function conditionColors(c: ItemCondition) {
  if (c === 'like-new') return { text: 'text-emerald-300', bg: 'bg-emerald-950', border: 'border-emerald-700', bar: 'bg-emerald-400' };
  if (c === 'good') return { text: 'text-sky-300', bg: 'bg-sky-950', border: 'border-sky-700', bar: 'bg-sky-400' };
  return { text: 'text-amber-300', bg: 'bg-amber-950', border: 'border-amber-700', bar: 'bg-amber-400' };
}

export function ConditionMeter({ condition = 'good', score = 80, defects = [], inspectedDate, compact = false }: ConditionMeterProps) {
  const colors = conditionColors(condition);
  const safeScore = score ?? 80;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${colors.bar}`}
            style={{ width: `${safeScore}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${colors.text}`}>{conditionLabel(condition)}</span>
      </div>
    );
  }

  const inspectedStr = inspectedDate
    ? new Date(inspectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Not recorded';

  return (
    <div className="space-y-3">
      {/* Score bar */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Condition</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colors.text} ${colors.bg} ${colors.border}`}>
          {conditionLabel(condition)} — {safeScore}/100
        </span>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      {/* Inspected date */}
      <p className="text-xs text-zinc-500">
        Staff inspected: <span className="text-zinc-300">{inspectedStr}</span>
      </p>

      {/* Defect log — Carfax style */}
      {defects.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Inspection Report</p>
          {defects.map((d, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 px-3 py-2 rounded-lg border text-xs ${severityColors[d.severity]}`}
            >
              <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${severityDot[d.severity]}`} />
              <div className="min-w-0">
                <span className="font-semibold">{d.location}</span>
                <span className="text-zinc-400 mx-1">—</span>
                <span>{d.description}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-800 bg-emerald-950 text-xs text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          No defects found — item passed full inspection
        </div>
      )}
    </div>
  );
}
