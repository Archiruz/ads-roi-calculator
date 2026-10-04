<?php

namespace App\Http\Controllers;

use App\Services\CalculationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalculatorController extends Controller
{
    public function __construct(
        protected CalculationService $calculationService
    ) {}

    /**
     * Display the ROI Calculator page with default initial parameters and initial computed state.
     */
    public function __invoke(Request $request): Response
    {
        $defaultInputs = [
            'product_price' => 500000,
            'monthly_ad_spend' => 5000000,
            'cpr' => 100000,
            'average_order_value' => 500000,
        ];

        $initialComputed = $this->calculationService->calculate($defaultInputs);

        return Inertia::render('calculator', [
            'defaultInputs' => $defaultInputs,
            'initialComputed' => $initialComputed,
            'recentCalculations' => $request->user()
                ->calculations()
                ->latest('id')
                ->take(5)
                ->get(),
        ]);
    }
}
