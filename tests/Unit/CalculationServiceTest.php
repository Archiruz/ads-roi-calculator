<?php

use App\Services\CalculationService;

test('calculates correct outputs matching mockup example 1 (unprofitable scenario)', function () {
    $service = new CalculationService;

    $result = $service->calculate([
        'product_price' => 50000,
        'monthly_ad_spend' => 1500000,
        'cpr' => 235000,
        'average_order_value' => 10000,
    ]);

    expect($result['display_results_count'])->toBe(6)
        ->and($result['revenue'])->toBe(63829.79) // 6.382978 * 10,000 = 63,829.79 (UI shows Rp 63.830 rounded)
        ->and(round($result['revenue']))->toEqual(63830)
        ->and(round($result['profit']))->toEqual(-1436170)
        ->and($result['roi_percentage'])->toEqual(-95.74)
        ->and(round($result['roi_percentage'], 1))->toEqual(-95.7)
        ->and($result['cpr_target'])->toEqual(15000.0)
        ->and($result['margin_per_result'])->toEqual(-225000.0)
        ->and($result['roi_status'])->toBe('Perlu Optimasi')
        ->and($result['insights'])->toHaveCount(3)
        ->and($result['insights'][0])->toContain('Kampanye perlu optimasi')
        ->and($result['insights'][1])->toContain('Pertimbangkan untuk menurunkan CPR Anda')
        ->and($result['insights'][2])->toContain('Rp 1,5 juta');
});

test('calculates correct outputs matching mockup example 2 (profitable scenario)', function () {
    $service = new CalculationService;

    $result = $service->calculate([
        'product_price' => 500000,
        'monthly_ad_spend' => 5000000,
        'cpr' => 100000,
        'average_order_value' => 500000,
    ]);

    expect($result['display_results_count'])->toBe(50)
        ->and($result['revenue'])->toEqual(25000000.0)
        ->and($result['profit'])->toEqual(20000000.0)
        ->and($result['roi_percentage'])->toEqual(400.0)
        ->and($result['cpr_target'])->toEqual(150000.0)
        ->and($result['margin_per_result'])->toEqual(400000.0)
        ->and($result['roi_status'])->toBe('Kampanye Menguntungkan')
        ->and($result['insights'])->toHaveCount(3)
        ->and($result['insights'][0])->toContain('ROI sangat baik! Kampanye Anda sangat menguntungkan.')
        ->and($result['insights'][1])->toContain('CPR Anda berada dalam kisaran sehat')
        ->and($result['insights'][2])->toContain('Rp 5 juta');
});

test('handles edge case when CPR is zero or negative without throwing division by zero', function () {
    $service = new CalculationService;

    $result = $service->calculate([
        'product_price' => 100000,
        'monthly_ad_spend' => 1000000,
        'cpr' => 0,
        'average_order_value' => 100000,
    ]);

    expect($result['display_results_count'])->toBe(0)
        ->and($result['revenue'])->toBe(0.0)
        ->and($result['profit'])->toBe(-1000000.0)
        ->and($result['roi_percentage'])->toBe(-100.0);
});

test('handles zero monthly ad spend safely', function () {
    $service = new CalculationService;

    $result = $service->calculate([
        'product_price' => 100000,
        'monthly_ad_spend' => 0,
        'cpr' => 50000,
        'average_order_value' => 100000,
    ]);

    expect($result['display_results_count'])->toBe(0)
        ->and($result['revenue'])->toBe(0.0)
        ->and($result['profit'])->toBe(0.0)
        ->and($result['roi_percentage'])->toBe(0.0);
});
