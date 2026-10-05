import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { CampaignParametersCard } from '@/components/calculator/campaign-parameters-card';
import { PredictionResultsCard } from '@/components/calculator/prediction-results-card';
import { KeyInsightsCard } from '@/components/calculator/key-insights-card';
import { SaveCalculationDialog } from '@/components/calculator/save-calculation-dialog';
import { CalculationHistoryTable } from '@/components/calculator/calculation-history-table';
import { computeCalculatorResults } from '@/lib/calculation';
import { dashboard } from '@/routes';
import { Sparkles, History as HistoryIcon } from 'lucide-react';
import type {
    DashboardInvitation,
    CalculatorInputs,
    ComputedResults,
    CalculationRecord,
} from '@/types';

type Props = {
    pendingInvitations?: DashboardInvitation[];
    defaultInputs?: CalculatorInputs;
    initialComputed?: ComputedResults;
    recentCalculations?: CalculationRecord[];
};

export default function Dashboard({
    pendingInvitations = [],
    defaultInputs = {
        product_price: 500000,
        monthly_ad_spend: 5000000,
        cpr: 100000,
        average_order_value: 500000,
    },
    recentCalculations = [],
}: Props) {
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    // Single source of truth for numeric inputs to ensure 100% real-time synchronization
    const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
    const [historyList, setHistoryList] =
        useState<CalculationRecord[]>(recentCalculations);

    // Deterministic instant client-side calculation
    const computedResults = useMemo(() => {
        return computeCalculatorResults(inputs);
    }, [inputs]);

    const handleInputChange = <K extends keyof CalculatorInputs>(
        key: K,
        value: CalculatorInputs[K],
    ) => {
        setInputs((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSavedCalculation = (newRecord: CalculationRecord) => {
        setHistoryList((prev) => [newRecord, ...prev]);
    };

    const handleLoadCalculation = (record: CalculationRecord) => {
        setInputs({
            product_price: Number(record.product_price),
            monthly_ad_spend: Number(record.monthly_ad_spend),
            cpr: Number(record.cpr),
            average_order_value: Number(record.average_order_value),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Head title="Kalkulator ROI Kampanye Iklan" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8">
                {/* Hero Header matching design mockups */}
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                        <Sparkles className="size-3.5" />
                        <span>Prediksi Kesuksesan Produk Digital Anda</span>
                    </div>

                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-neutral-50">
                        Hitung ROI Kampanye <br className="hidden sm:inline" />
                        Iklan Anda Secara Real-Time
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-600 sm:text-base dark:text-neutral-400">
                        Buat keputusan berdasarkan data dengan kalkulator
                        prediksi canggih kami. Prediksi pendapatan, optimalkan
                        pengeluaran iklan, dan maksimalkan profitabilitas produk
                        digital Anda.
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <SaveCalculationDialog
                            inputs={inputs}
                            results={computedResults}
                            onSaved={handleSavedCalculation}
                        />
                    </div>
                </div>

                {/* 2-Column Calculator Core Grid */}
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Panel: Campaign Parameters */}
                    <CampaignParametersCard
                        inputs={inputs}
                        onChange={handleInputChange}
                    />

                    {/* Right Panel: Predicted Outputs & Strategic Insights */}
                    <div className="space-y-6">
                        <PredictionResultsCard results={computedResults} />
                        <KeyInsightsCard insights={computedResults.insights} />
                    </div>
                </div>

                {/* Bottom Section: Recent Calculations History */}
                <div className="mx-auto w-full max-w-6xl pt-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HistoryIcon className="size-5 text-neutral-600 dark:text-neutral-400" />
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                Riwayat Perhitungan Terakhir
                            </h3>
                        </div>
                    </div>

                    <CalculationHistoryTable
                        calculations={historyList}
                        onLoadIntoCalculator={handleLoadCalculation}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Kalkulator ROI',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
