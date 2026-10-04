<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCalculationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:150'],
            'product_price' => ['required', 'numeric', 'min:0', 'max:100000000000'],
            'monthly_ad_spend' => ['required', 'numeric', 'min:0', 'max:100000000000'],
            'cpr' => ['required', 'numeric', 'min:1', 'max:100000000000'],
            'average_order_value' => ['required', 'numeric', 'min:0', 'max:100000000000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'Nama Kampanye',
            'product_price' => 'Harga Produk',
            'monthly_ad_spend' => 'Pengeluaran Iklan Bulanan',
            'cpr' => 'Cost per Results (CPR)',
            'average_order_value' => 'Nilai Pesanan Rata-rata',
            'notes' => 'Catatan',
        ];
    }
}
