import { formatRupiah } from '@/lib/calculation';

interface SyncSliderInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    showCurrencyBadge?: boolean;
    hasSlider?: boolean;
    helperText?: string;
    id: string;
}

export function SyncSliderInput({
    label,
    value,
    onChange,
    min,
    max,
    step = 1000,
    showCurrencyBadge = true,
    hasSlider = true,
    helperText,
    id,
}: SyncSliderInputProps) {
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === '' ? 0 : Number(e.target.value);
        if (!isNaN(val)) {
            onChange(val);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <label
                    htmlFor={id}
                    className="font-semibold text-neutral-800 dark:text-neutral-200"
                >
                    {label}
                </label>
                {showCurrencyBadge && (
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formatRupiah(value)}
                    </span>
                )}
            </div>

            {hasSlider && (
                <div className="py-1">
                    <input
                        type="range"
                        aria-label={`${label} slider`}
                        min={min}
                        max={max}
                        step={step}
                        value={Math.min(max, Math.max(min, value))}
                        onChange={handleSliderChange}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-blue-600 dark:bg-neutral-800 dark:accent-blue-500"
                    />
                </div>
            )}

            <div className="relative">
                <input
                    id={id}
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value === 0 ? '' : value}
                    placeholder="0"
                    onChange={handleNumberChange}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-900 shadow-xs transition-colors placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                />
            </div>

            {helperText && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {helperText}
                </p>
            )}
        </div>
    );
}
