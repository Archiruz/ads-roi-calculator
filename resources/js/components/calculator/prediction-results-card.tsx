import {
    BarChart3,
    TrendingUp,
    DollarSign,
    Target,
    Calculator,
} from 'lucide-react';
import { formatPercentage, formatRupiah } from '@/lib/calculation';
import type { ComputedResults } from '@/types';

interface PredictionResultsCardProps {
    results: ComputedResults;
}

export function PredictionResultsCard({ results }: PredictionResultsCardProps) {
    const isProfitable = results.roi_percentage >= 0;

    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="mb-6 flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100/80 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    <BarChart3 className="size-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        Hasil Prediksi
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Berdasarkan parameter kampanye Anda
                    </p>
                </div>
            </div>

            {/* Hero ROI Banner Card */}
            <div
                className={`relative mb-6 overflow-hidden rounded-2xl p-6 text-white shadow-xs transition-all duration-300 ${
                    isProfitable
                        ? 'border border-purple-600/40 bg-purple-700 dark:bg-purple-900'
                        : 'border border-neutral-700 bg-neutral-800 dark:bg-neutral-900'
                }`}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xs font-medium tracking-wide text-white/90">
                            Laba atas Investasi (ROI)
                        </span>
                        <div className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
                            {formatPercentage(results.roi_percentage)}
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                            {results.roi_status}
                        </div>
                    </div>
                    <div className="rounded-full bg-white/15 p-2.5 backdrop-blur-xs">
                        <TrendingUp className="size-6 text-white" />
                    </div>
                </div>
            </div>

            {/* 4 Primary Metric Cards Grid */}
            <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {/* 1. Pendapatan */}
                <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        <DollarSign className="size-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Pendapatan</span>
                    </div>
                    <div className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {formatRupiah(results.revenue)}
                    </div>
                </div>

                {/* 2. Keuntungan */}
                <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Keuntungan</span>
                    </div>
                    <div
                        className={`mt-2 text-xl font-bold ${
                            results.profit >= 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-500 dark:text-red-400'
                        }`}
                    >
                        {formatRupiah(results.profit)}
                    </div>
                </div>

                {/* 3. Jumlah Results */}
                <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        <Target className="size-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Jumlah Results</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {results.display_results_count}
                    </div>
                </div>

                {/* 4. CPR Target */}
                <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        <Calculator className="size-3.5 text-purple-600 dark:text-purple-400" />
                        <span>CPR Target</span>
                    </div>
                    <div className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {formatRupiah(results.cpr_target)}
                    </div>
                </div>
            </div>

            {/* Bottom Unit Economics Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200/70 bg-white px-5 py-3.5 text-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Pendapatan per Result
                    </div>
                    <div className="mt-0.5 text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {formatRupiah(results.revenue_per_result)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Margin per Result
                    </div>
                    <div
                        className={`mt-0.5 text-base font-bold ${
                            results.margin_per_result >= 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-500 dark:text-red-400'
                        }`}
                    >
                        {formatRupiah(results.margin_per_result)}
                    </div>
                </div>
            </div>
        </div>
    );
}
