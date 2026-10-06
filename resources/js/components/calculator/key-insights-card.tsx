import { Lightbulb } from 'lucide-react';

interface KeyInsightsCardProps {
    insights: string[];
}

export function KeyInsightsCard({ insights }: KeyInsightsCardProps) {
    if (!insights || insights.length === 0) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                    <Lightbulb className="size-4" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    Wawasan Utama
                </h3>
            </div>

            <div className="space-y-3">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5 text-xs text-neutral-700 sm:text-sm dark:border-neutral-800/60 dark:bg-neutral-800/40 dark:text-neutral-300"
                    >
                        <div className="mt-1 size-2 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                        <span className="leading-relaxed">{insight}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
