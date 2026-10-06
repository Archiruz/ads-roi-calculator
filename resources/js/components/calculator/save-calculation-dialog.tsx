import { useState } from 'react';
import { router } from '@inertiajs/react';
import { BookmarkPlus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type {
    CalculatorInputs,
    ComputedResults,
    CalculationRecord,
} from '@/types';

interface SaveCalculationDialogProps {
    inputs: CalculatorInputs;
    results: ComputedResults;
    onSaved?: (saved: CalculationRecord) => void;
}

export function SaveCalculationDialog({
    inputs,
    results,
    onSaved,
}: SaveCalculationDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleOpen = () => {
        setTitle(
            `Kampanye ${new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`,
        );
        setNotes('');
        setOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;

            const res = await fetch('/api/calculations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({
                    title: title.trim() || undefined,
                    product_price: inputs.product_price,
                    monthly_ad_spend: inputs.monthly_ad_spend,
                    cpr: inputs.cpr,
                    average_order_value: inputs.average_order_value,
                    notes: notes.trim() || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Gagal menyimpan perhitungan');
            }

            toast.success('Perhitungan berhasil disimpan!', {
                description: `ROI: ${data.data.roi_percentage}% (${data.data.title})`,
            });

            if (onSaved && data.data) {
                onSaved(data.data);
            }

            router.reload({ only: ['recentCalculations'] });

            setOpen(false);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
            toast.error('Gagal menyimpan', { description: message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={handleOpen}
                    className="gap-2 rounded-xl bg-purple-600 px-5 font-semibold text-white shadow-xs hover:bg-purple-700"
                >
                    <BookmarkPlus className="size-4" />
                    Simpan Perhitungan
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSave}>
                    <DialogHeader>
                        <DialogTitle>Simpan Hasil Perhitungan</DialogTitle>
                        <DialogDescription>
                            Simpan proyeksi kampanye ini ke riwayat akun Anda
                            untuk dibandingkan di kemudian hari.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="save_title">Nama Kampanye</Label>
                            <Input
                                id="save_title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Skala Iklan TikTok E-book"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="save_notes">
                                Catatan Tambahan (Opsional)
                            </Label>
                            <textarea
                                id="save_notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Target audiens, copy test A/B, atau asumsi konversi..."
                                rows={3}
                                className="w-full rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-900 shadow-xs focus:border-purple-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                            />
                        </div>

                        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
                            <div>
                                Estimasi ROI:{' '}
                                <strong className="text-purple-600 dark:text-purple-400">
                                    {results.roi_percentage}%
                                </strong>
                            </div>
                            <div>
                                Keuntungan:{' '}
                                <strong>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        maximumFractionDigits: 0,
                                    }).format(results.profit)}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSaving}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                            {isSaving && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Simpan ke Riwayat
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
