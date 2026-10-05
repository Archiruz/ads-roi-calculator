import { Target } from 'lucide-react';
import { SyncSliderInput } from './sync-slider-input';
import type { CalculatorInputs } from '@/types';

interface CampaignParametersCardProps {
    inputs: CalculatorInputs;
    onChange: <K extends keyof CalculatorInputs>(
        key: K,
        value: CalculatorInputs[K],
    ) => void;
}

export function CampaignParametersCard({
    inputs,
    onChange,
}: CampaignParametersCardProps) {
    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-6 flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Target className="size-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        Parameter Kampanye
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Sesuaikan parameter kampanye Anda untuk melihat hasil
                        prediksi
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* 1. Harga Produk */}
                <SyncSliderInput
                    id="product_price"
                    label="Harga Produk"
                    value={inputs.product_price}
                    onChange={(val) => onChange('product_price', val)}
                    min={0}
                    max={100000000}
                    step={5000}
                    hasSlider={false}
                    helperText="Harga jual produk digital per unit"
                />

                {/* 2. Pengeluaran Iklan Bulanan */}
                <SyncSliderInput
                    id="monthly_ad_spend"
                    label="Pengeluaran Iklan Bulanan"
                    value={inputs.monthly_ad_spend}
                    onChange={(val) => onChange('monthly_ad_spend', val)}
                    min={0}
                    max={50000000}
                    step={100000}
                    hasSlider={true}
                    helperText="Total alokasi budget iklan bulanan"
                />

                {/* 3. Cost per Results (CPR) */}
                <SyncSliderInput
                    id="cpr"
                    label="Cost per Results (CPR)"
                    value={inputs.cpr}
                    onChange={(val) => onChange('cpr', Math.max(1, val))}
                    min={1000}
                    max={2000000}
                    step={5000}
                    hasSlider={true}
                    helperText="Biaya per akuisisi / konversi iklan"
                />

                {/* 4. Nilai Pesanan Rata-rata */}
                <SyncSliderInput
                    id="average_order_value"
                    label="Nilai Pesanan Rata-rata"
                    value={inputs.average_order_value}
                    onChange={(val) => onChange('average_order_value', val)}
                    min={0}
                    max={100000000}
                    step={5000}
                    hasSlider={false}
                    helperText="Rata-rata pendapatan yang diperoleh dari tiap transaksi (AOV)"
                />
            </div>
        </div>
    );
}
