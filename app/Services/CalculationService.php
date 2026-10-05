<?php

namespace App\Services;

class CalculationService
{
    /**
     * Compute ROI campaign parameters, results, margins, and strategic insights.
     *
     * @param  array<string, mixed>  $inputs  Missing keys default to 0.
     * @return array{
     *     product_price: float,
     *     monthly_ad_spend: float,
     *     cpr: float,
     *     average_order_value: float,
     *     results_count: float,
     *     display_results_count: int,
     *     revenue: float,
     *     profit: float,
     *     roi_percentage: float,
     *     cpr_target: float,
     *     margin_per_result: float,
     *     revenue_per_result: float,
     *     roi_status: string,
     *     insights: list<string>
     * }
     */
    public function calculate(array $inputs): array
    {
        $productPrice = max(0.0, (float) ($inputs['product_price'] ?? 0));
        $monthlyAdSpend = max(0.0, (float) ($inputs['monthly_ad_spend'] ?? 0));
        $cpr = (float) ($inputs['cpr'] ?? 0);
        $aov = max(0.0, (float) ($inputs['average_order_value'] ?? 0));

        // Benchmark target CPR is 30% of product price
        $cprTarget = round(0.30 * $productPrice, 2);

        // Safe division against zero or negative CPR
        if ($cpr <= 0.0) {
            $resultsCount = 0.0;
            $revenue = 0.0;
            $profit = -$monthlyAdSpend;
            $roiPercentage = $monthlyAdSpend > 0 ? -100.0 : 0.0;
            $marginPerResult = $aov;
        } else {
            $resultsCount = $monthlyAdSpend / $cpr;
            $revenue = round($resultsCount * $aov, 2);
            $profit = round($revenue - $monthlyAdSpend, 2);
            $roiPercentage = $monthlyAdSpend > 0
                ? round(($profit / $monthlyAdSpend) * 100.0, 2)
                : 0.0;
            $marginPerResult = round($aov - $cpr, 2);
        }

        $displayResultsCount = (int) floor($resultsCount);
        $roiStatus = $roiPercentage >= 0.0 ? 'Kampanye Menguntungkan' : 'Perlu Optimasi';

        $insights = $this->generateInsights(
            roiPercentage: $roiPercentage,
            cpr: $cpr,
            cprTarget: $cprTarget,
            monthlyAdSpend: $monthlyAdSpend,
            resultsCount: $resultsCount,
            marginPerResult: $marginPerResult
        );

        return [
            'product_price' => $productPrice,
            'monthly_ad_spend' => $monthlyAdSpend,
            'cpr' => $cpr,
            'average_order_value' => $aov,
            'results_count' => round($resultsCount, 4),
            'display_results_count' => $displayResultsCount,
            'revenue' => $revenue,
            'profit' => $profit,
            'roi_percentage' => $roiPercentage,
            'cpr_target' => $cprTarget,
            'margin_per_result' => $marginPerResult,
            'revenue_per_result' => $aov,
            'roi_status' => $roiStatus,
            'insights' => $insights,
        ];
    }

    /**
     * Generate dynamic actionable insights matching design mockups.
     *
     * @return list<string>
     */
    protected function generateInsights(
        float $roiPercentage,
        float $cpr,
        float $cprTarget,
        float $monthlyAdSpend,
        float $resultsCount,
        float $marginPerResult
    ): array {
        $insights = [];

        // 1. ROI Performance evaluation
        if ($roiPercentage >= 0.0) {
            $insights[] = 'ROI sangat baik! Kampanye Anda sangat menguntungkan.';
        } else {
            $insights[] = 'Kampanye perlu optimasi. Fokus pada pengurangan CPR atau peningkatan nilai pesanan.';
        }

        // 2. CPR Target health check
        if ($cpr <= $cprTarget && $cpr > 0.0) {
            $insights[] = 'CPR Anda berada dalam kisaran sehat (30% dari harga produk).';
        } else {
            $insights[] = 'Pertimbangkan untuk menurunkan CPR Anda untuk meningkatkan profitabilitas. Target CPR sebaiknya sekitar 30% dari harga produk.';
        }

        // 3. Projected Budget & Outcome scale narrative
        $budgetLabel = $this->formatBudgetLabel($monthlyAdSpend);
        $resultsLabel = (int) round($resultsCount);
        $marginFormatted = number_format(abs($marginPerResult), 0, ',', '.');
        $marginSign = $marginPerResult < 0 ? '-Rp ' : 'Rp ';

        $insights[] = "Dengan budget {$budgetLabel}, Anda dapat menghasilkan sekitar {$resultsLabel} results. Setiap result menghasilkan margin {$marginSign}{$marginFormatted}.";

        return $insights;
    }

    /**
     * Format human-readable budget description in Indonesian (juta/ribu).
     */
    protected function formatBudgetLabel(float $spend): string
    {
        if ($spend >= 1_000_000) {
            $juta = $spend / 1_000_000;
            $formatted = rtrim(rtrim(number_format($juta, 1, ',', '.'), '0'), ',');

            return "Rp {$formatted} juta";
        }

        if ($spend >= 1_000) {
            $ribu = $spend / 1_000;
            $formatted = rtrim(rtrim(number_format($ribu, 1, ',', '.'), '0'), ',');

            return "Rp {$formatted} ribu";
        }

        return 'Rp '.number_format($spend, 0, ',', '.');
    }
}
