<?php

namespace Database\Factories;

use App\Models\Calculation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Calculation>
 */
class CalculationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productPrice = 500000;
        $adSpend = 5000000;
        $cpr = 100000;
        $aov = 500000;
        $resultsCount = $adSpend / $cpr;
        $revenue = $resultsCount * $aov;
        $profit = $revenue - $adSpend;
        $roi = ($profit / $adSpend) * 100;
        $cprTarget = 0.3 * $productPrice;
        $marginPerResult = $aov - $cpr;

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'product_price' => $productPrice,
            'monthly_ad_spend' => $adSpend,
            'cpr' => $cpr,
            'average_order_value' => $aov,
            'results_count' => $resultsCount,
            'revenue' => $revenue,
            'profit' => $profit,
            'roi_percentage' => $roi,
            'cpr_target' => $cprTarget,
            'margin_per_result' => $marginPerResult,
            'notes' => fake()->optional()->paragraph(),
        ];
    }
}
