import { useState } from 'react';
import { formatRupiah, formatPercentage } from '@/lib/calculation';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Calendar, RotateCcw } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { CalculationRecord } from '@/types';

interface CalculationHistoryTableProps {
    calculations: CalculationRecord[];
    onDelete?: (id: number) => void;
    onLoadIntoCalculator?: (record: CalculationRecord) => void;
}

export function CalculationHistoryTable({
    calculations,
    onDelete,
    onLoadIntoCalculator,
}: CalculationHistoryTableProps) {
    const [selectedRecord, setSelectedRecord] =
        useState<CalculationRecord | null>(null);

    if (!calculations || calculations.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
                <Calendar className="mx-auto size-8 text-neutral-400" />
                <h4 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Belum Ada Riwayat Perhitungan
                </h4>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Jalankan perhitungan dengan parameter kampanye Anda dan klik
                    "Simpan Perhitungan".
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-neutral-100 bg-neutral-50/70 text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-400">
                        <tr>
                            <th className="px-5 py-3.5">Kampanye</th>
                            <th className="px-5 py-3.5">Budget Iklan</th>
                            <th className="px-5 py-3.5">Pendapatan</th>
                            <th className="px-5 py-3.5">Keuntungan</th>
                            <th className="px-5 py-3.5">ROI</th>
                            <th className="px-5 py-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                        {calculations.map((calc) => {
                            const roiNum = Number(calc.roi_percentage);
                            const isPositive = roiNum >= 0;

                            return (
                                <tr
                                    key={calc.id}
                                    className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {calc.title ||
                                                `Perhitungan #${calc.id}`}
                                        </div>
                                        <div className="text-xs text-neutral-400">
                                            {new Date(
                                                calc.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-neutral-700 dark:text-neutral-300">
                                        {formatRupiah(calc.monthly_ad_spend)}
                                    </td>
                                    <td className="px-5 py-4 font-medium text-neutral-700 dark:text-neutral-300">
                                        {formatRupiah(calc.revenue)}
                                    </td>
                                    <td
                                        className={`px-5 py-4 font-semibold ${
                                            Number(calc.profit) >= 0
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-red-500 dark:text-red-400'
                                        }`}
                                    >
                                        {formatRupiah(calc.profit)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                isPositive
                                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                                    : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                            }`}
                                        >
                                            {formatPercentage(
                                                calc.roi_percentage,
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {onLoadIntoCalculator && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onLoadIntoCalculator(
                                                            calc,
                                                        )
                                                    }
                                                    title="Terapkan ke Kalkulator"
                                                    className="size-8 p-0 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 dark:text-purple-400"
                                                >
                                                    <RotateCcw className="size-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedRecord(calc)
                                                }
                                                title="Lihat Rincian"
                                                className="size-8 p-0 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                            >
                                                <Eye className="size-4" />
                                            </Button>
                                            {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onDelete(calc.id)
                                                    }
                                                    title="Hapus"
                                                    className="size-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Detail Inspection Modal */}
            <Dialog
                open={!!selectedRecord}
                onOpenChange={(open) => !open && setSelectedRecord(null)}
            >
                <DialogContent className="sm:max-w-lg">
                    {selectedRecord && (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedRecord.title ||
                                        'Detail Perhitungan'}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-3 py-3 text-sm">
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <div className="text-xs text-neutral-500">
                                        Harga Produk
                                    </div>
                                    <div className="mt-1 font-bold text-neutral-900 dark:text-neutral-100">
                                        {formatRupiah(
                                            selectedRecord.product_price,
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <div className="text-xs text-neutral-500">
                                        Budget Iklan
                                    </div>
                                    <div className="mt-1 font-bold text-neutral-900 dark:text-neutral-100">
                                        {formatRupiah(
                                            selectedRecord.monthly_ad_spend,
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <div className="text-xs text-neutral-500">
                                        Cost per Result (CPR)
                                    </div>
                                    <div className="mt-1 font-bold text-neutral-900 dark:text-neutral-100">
                                        {formatRupiah(selectedRecord.cpr)}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <div className="text-xs text-neutral-500">
                                        Nilai Pesanan Rata-rata
                                    </div>
                                    <div className="mt-1 font-bold text-neutral-900 dark:text-neutral-100">
                                        {formatRupiah(
                                            selectedRecord.average_order_value,
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <div className="text-xs text-neutral-500">
                                        Estimasi Jumlah Results
                                    </div>
                                    <div className="mt-1 font-bold text-neutral-900 dark:text-neutral-100">
                                        {Math.floor(
                                            Number(
                                                selectedRecord.results_count,
                                            ),
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <div className="text-xs text-neutral-500">
                                        Target CPR (30%)
                                    </div>
                                    <div className="mt-1 font-bold text-neutral-900 dark:text-neutral-100">
                                        {formatRupiah(
                                            selectedRecord.cpr_target,
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedRecord.notes && (
                                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                                    <div className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">
                                        Catatan:
                                    </div>
                                    <p className="whitespace-pre-wrap">
                                        {selectedRecord.notes}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
