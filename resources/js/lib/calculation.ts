import type { CalculatorInputs, ComputedResults } from '@/types';

/**
 * Format number into standard Indonesian Rupiah format: Rp 1.500.000 or -Rp 1.436.170
 */
export function formatRupiah(
    value: number | string | null | undefined,
): string {
    const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
    if (isNaN(num)) return 'Rp 0';

    const isNegative = num < 0;
    const absVal = Math.round(Math.abs(num));
    const formatted = new Intl.NumberFormat('id-ID').format(absVal);

    return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

/**
 * Format percentage with explicit sign and single decimal: +400.0% or -95.7%
 */
export function formatPercentage(
    value: number | string | null | undefined,
): string {
    const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
    if (isNaN(num)) return '0.0%';

    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
}

/**
 * Format budget description into Indonesian words (Rp 1,5 juta, Rp 500 ribu)
 */
export function formatBudgetWord(spend: number): string {
    if (spend >= 1_000_000) {
        const juta = (spend / 1_000_000)
            .toFixed(1)
            .replace('.0', '')
            .replace('.', ',');
        return `Rp ${juta} juta`;
    }
    if (spend >= 1_000) {
        const ribu = (spend / 1_000)
            .toFixed(1)
            .replace('.0', '')
            .replace('.', ',');
        return `Rp ${ribu} ribu`;
    }
    return formatRupiah(spend);
}

/**
 * Pure deterministic calculation function with 100% parity with backend CalculationService
 */
export function computeCalculatorResults(
    inputs: CalculatorInputs,
): ComputedResults {
    const productPrice = Math.max(0, Number(inputs.product_price) || 0);
    const monthlyAdSpend = Math.max(0, Number(inputs.monthly_ad_spend) || 0);
    const cpr = Number(inputs.cpr) || 0;
    const aov = Math.max(0, Number(inputs.average_order_value) || 0);

    const cprTarget = Math.round(0.3 * productPrice);

    let resultsCount = 0;
    let revenue = 0;
    let profit = 0;
    let roiPercentage = 0;
    let marginPerResult = aov;

    if (cpr <= 0) {
        resultsCount = 0;
        revenue = 0;
        profit = -monthlyAdSpend;
        roiPercentage = monthlyAdSpend > 0 ? -100 : 0;
        marginPerResult = aov;
    } else {
        resultsCount = monthlyAdSpend / cpr;
        revenue = Math.round(resultsCount * aov);
        profit = revenue - monthlyAdSpend;
        roiPercentage =
            monthlyAdSpend > 0
                ? Number(((profit / monthlyAdSpend) * 100).toFixed(2))
                : 0;
        marginPerResult = Math.round(aov - cpr);
    }

    const displayResultsCount = Math.floor(resultsCount);
    const roiStatus =
        roiPercentage >= 0 ? 'Kampanye Menguntungkan' : 'Perlu Optimasi';

    // Dynamic strategic insights matching mockups
    const insights: string[] = [];

    // 1. ROI Performance
    if (roiPercentage >= 0) {
        insights.push('ROI sangat baik! Kampanye Anda sangat menguntungkan.');
    } else {
        insights.push(
            'Kampanye perlu optimasi. Fokus pada pengurangan CPR atau peningkatan nilai pesanan.',
        );
    }

    // 2. CPR Benchmark Health
    if (cpr <= cprTarget && cpr > 0) {
        insights.push(
            'CPR Anda berada dalam kisaran sehat (30% dari harga produk).',
        );
    } else {
        insights.push(
            'Pertimbangkan untuk menurunkan CPR Anda untuk meningkatkan profitabilitas. Target CPR sebaiknya sekitar 30% dari harga produk.',
        );
    }

    // 3. Projected Budget Scale Narrative
    const budgetLabel = formatBudgetWord(monthlyAdSpend);
    const resultsLabel = Math.round(resultsCount);
    const marginFormatted = formatRupiah(marginPerResult);

    insights.push(
        `Dengan budget ${budgetLabel}, Anda dapat menghasilkan sekitar ${resultsLabel} results. Setiap result menghasilkan margin ${marginFormatted}.`,
    );

    return {
        product_price: productPrice,
        monthly_ad_spend: monthlyAdSpend,
        cpr,
        average_order_value: aov,
        results_count: resultsCount,
        display_results_count: displayResultsCount,
        revenue,
        profit,
        roi_percentage: roiPercentage,
        cpr_target: cprTarget,
        margin_per_result: marginPerResult,
        revenue_per_result: aov,
        roi_status: roiStatus,
        insights,
    };
}
