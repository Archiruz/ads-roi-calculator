import { Head, router } from '@inertiajs/react';
import { CalculationHistoryTable } from '@/components/calculator/calculation-history-table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History as HistoryIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { CalculationRecord } from '@/types';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
    total: number;
}

interface HistoryPageProps {
    calculations: PaginatedData<CalculationRecord>;
}

export default function HistoryPage({ calculations }: HistoryPageProps) {
    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus riwayat perhitungan ini?')) {
            return;
        }

        router.delete(`/calculations/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Riwayat berhasil dihapus.');
            },
            onError: () => {
                toast.error('Gagal menghapus riwayat perhitungan.');
            },
        });
    };

    const handleLoad = () => {
        router.visit('/dashboard');
    };

    return (
        <>
            <Head title="Riwayat Perhitungan ROI" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <HistoryIcon className="size-6 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl dark:text-neutral-50">
                                Riwayat Perhitungan Kampanye
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Daftar semua proyeksi dan perhitungan ROI yang telah Anda simpan. Data bersifat privat untuk akun Anda.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleLoad}
                        className="gap-2 rounded-xl"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Kalkulator
                    </Button>
                </div>

                <div className="mx-auto w-full max-w-6xl">
                    <CalculationHistoryTable
                        calculations={calculations.data}
                        onDelete={handleDelete}
                    />

                    {/* Pagination */}
                    {calculations.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {calculations.links.map((link, idx) => (
                                <Button
                                    key={idx}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

HistoryPage.layout = {
    breadcrumbs: [
        {
            title: 'Kalkulator ROI',
            href: '/dashboard',
        },
        {
            title: 'Riwayat Perhitungan',
            href: '/history',
        },
    ],
};
