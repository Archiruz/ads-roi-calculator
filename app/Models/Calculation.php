<?php

namespace App\Models;

use Database\Factories\CalculationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Calculation extends Model
{
    /** @use HasFactory<CalculationFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'product_price',
        'monthly_ad_spend',
        'cpr',
        'average_order_value',
        'results_count',
        'revenue',
        'profit',
        'roi_percentage',
        'cpr_target',
        'margin_per_result',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'product_price' => 'decimal:2',
            'monthly_ad_spend' => 'decimal:2',
            'cpr' => 'decimal:2',
            'average_order_value' => 'decimal:2',
            'results_count' => 'decimal:4',
            'revenue' => 'decimal:2',
            'profit' => 'decimal:2',
            'roi_percentage' => 'decimal:2',
            'cpr_target' => 'decimal:2',
            'margin_per_result' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<User, Calculation>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
