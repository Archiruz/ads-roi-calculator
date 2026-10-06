import { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';
import {
    computeCalculatorResults,
    formatRupiah,
    formatPercentage,
} from '@/lib/calculation';
import {
    TrendingUp,
    Target,
    Calculator,
    DollarSign,
    CheckCircle2,
    Sliders,
    ArrowRight,
} from 'lucide-react';
import type { Auth, Team } from '@/types';

type WelcomeProps = {
    auth: Auth;
    currentTeam?: Team | null;
};

export default function Welcome() {
    const { auth, currentTeam } = usePage<WelcomeProps>().props;
    const dashboardUrl = currentTeam
        ? dashboard(currentTeam.slug)
        : '/dashboard';

    // Interactive preview state directly powering the live demo on the landing page
    const [demoInputs, setDemoInputs] = useState({
        product_price: 500000,
        monthly_ad_spend: 5000000,
        cpr: 100000,
        average_order_value: 500000,
    });

    const computed = useMemo(() => {
        return computeCalculatorResults(demoInputs);
    }, [demoInputs]);

    const isProfitable = computed.roi_percentage >= 0;

    return (
        <>
            <Head title="AdForecast Pro - Kalkulator ROI Kampanye Iklan Digital" />

            <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors selection:bg-purple-500 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
                {/* Navbar */}
                <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-purple-700 text-white shadow-xs dark:bg-purple-600">
                                <AppLogoIcon className="size-5" />
                            </div>
                            <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                                AdForecast{' '}
                                <span className="text-purple-600 dark:text-purple-400">
                                    Pro
                                </span>
                            </span>
                        </Link>

                        <nav className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500"
                                >
                                    <span>Buka Dashboard</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-700 dark:text-neutral-300 dark:hover:text-purple-300"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500"
                                    >
                                        Daftar Gratis
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="space-y-20 py-12 sm:py-16">
                    {/* Hero Section */}
                    <section className="mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/90 px-3.5 py-1 text-xs font-semibold text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/50 dark:text-purple-300">
                                <TrendingUp className="size-3.5" />
                                <span>
                                    Kalkulator ROI & Prediksi Iklan Digital
                                </span>
                            </div>

                            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-tight">
                                Prediksi Profit Iklan{' '}
                                <br className="hidden sm:inline" />
                                <span className="text-purple-700 dark:text-purple-400">
                                    Sebelum Anggaran Habis
                                </span>
                            </h1>

                            <p className="mt-4 text-base text-neutral-600 sm:text-lg dark:text-neutral-400">
                                Simulasi real-time untuk memperhitungkan
                                pengeluaran iklan bulanan, Cost per Result
                                (CPR), dan omzet. Dapatkan estimasi ROI riil dan
                                margin bersih secara akurat.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href={
                                        auth?.user ? dashboardUrl : register()
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500"
                                >
                                    <span>Mulai Hitung ROI</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                                <a
                                    href="#preview"
                                    className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                    Coba Simulasi Interaktif
                                </a>
                            </div>
                        </div>

                        {/* Interactive Live Preview Component */}
                        <div id="preview" className="mt-12 scroll-mt-24">
                            <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-5 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                            <Sliders className="size-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                                Simulasi Langsung Real-Time
                                            </h2>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Geser slider untuk melihat
                                                perubahan proyeksi seketika
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/50 dark:text-purple-300">
                                        Formula Sesuai Business Logic
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                                    {/* Left Sliders: Interactive Controls */}
                                    <div className="space-y-6 lg:col-span-6">
                                        {/* Slider 1: Budget Iklan Bulanan */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    Pengeluaran Iklan Bulanan
                                                </span>
                                                <span className="font-semibold text-purple-700 dark:text-purple-400">
                                                    {formatRupiah(
                                                        demoInputs.monthly_ad_spend,
                                                    )}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={500000}
                                                max={30000000}
                                                step={500000}
                                                value={
                                                    demoInputs.monthly_ad_spend
                                                }
                                                onChange={(e) =>
                                                    setDemoInputs((prev) => ({
                                                        ...prev,
                                                        monthly_ad_spend:
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                    }))
                                                }
                                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-purple-600 dark:bg-neutral-800 dark:accent-purple-500"
                                            />
                                            <p className="text-xs text-neutral-500">
                                                Alokasi total biaya promosi
                                                berbayar (Meta/Google Ads).
                                            </p>
                                        </div>

                                        {/* Slider 2: Cost Per Result */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    Cost per Results (CPR)
                                                </span>
                                                <span className="font-semibold text-purple-700 dark:text-purple-400">
                                                    {formatRupiah(
                                                        demoInputs.cpr,
                                                    )}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={10000}
                                                max={500000}
                                                step={5000}
                                                value={demoInputs.cpr}
                                                onChange={(e) =>
                                                    setDemoInputs((prev) => ({
                                                        ...prev,
                                                        cpr: Math.max(
                                                            1,
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        ),
                                                    }))
                                                }
                                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-purple-600 dark:bg-neutral-800 dark:accent-purple-500"
                                            />
                                            <p className="text-xs text-neutral-500">
                                                Biaya per akuisisi
                                                pesanan/pembeli. Target
                                                benchmark: ≤ 30% dari harga
                                                produk.
                                            </p>
                                        </div>

                                        {/* Slider 3: Harga Produk / AOV */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    Harga Produk & Rata-rata
                                                    Pesanan
                                                </span>
                                                <span className="font-semibold text-purple-700 dark:text-purple-400">
                                                    {formatRupiah(
                                                        demoInputs.average_order_value,
                                                    )}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={50000}
                                                max={2000000}
                                                step={25000}
                                                value={
                                                    demoInputs.average_order_value
                                                }
                                                onChange={(e) => {
                                                    const val = Number(
                                                        e.target.value,
                                                    );
                                                    setDemoInputs((prev) => ({
                                                        ...prev,
                                                        product_price: val,
                                                        average_order_value:
                                                            val,
                                                    }));
                                                }}
                                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-purple-600 dark:bg-neutral-800 dark:accent-purple-500"
                                            />
                                            <p className="text-xs text-neutral-500">
                                                Nilai transaksi kotor per
                                                transaksi yang berhasil
                                                dikonversi.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Results: Visual Cards */}
                                    <div className="space-y-4 lg:col-span-6">
                                        {/* Hero ROI Box */}
                                        <div
                                            className={`rounded-xl p-5 text-white shadow-xs transition-colors ${
                                                isProfitable
                                                    ? 'border border-purple-600/40 bg-purple-700 dark:bg-purple-900'
                                                    : 'border border-neutral-700 bg-neutral-800 dark:bg-neutral-900'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-xs font-medium text-white/90">
                                                        Laba atas Investasi
                                                        (ROI)
                                                    </span>
                                                    <div className="mt-1 text-3xl font-extrabold sm:text-4xl">
                                                        {formatPercentage(
                                                            computed.roi_percentage,
                                                        )}
                                                    </div>
                                                    <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                                                        {computed.roi_status}
                                                    </div>
                                                </div>
                                                <div className="rounded-lg bg-white/15 p-2">
                                                    <TrendingUp className="size-5 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4 Mini Cards */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    <DollarSign className="size-3 text-purple-600 dark:text-purple-400" />
                                                    <span>Pendapatan</span>
                                                </div>
                                                <div className="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">
                                                    {formatRupiah(
                                                        computed.revenue,
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                    <span>Keuntungan</span>
                                                </div>
                                                <div
                                                    className={`mt-1.5 text-base font-bold ${
                                                        computed.profit >= 0
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-red-500 dark:text-red-400'
                                                    }`}
                                                >
                                                    {formatRupiah(
                                                        computed.profit,
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    <Target className="size-3 text-purple-600 dark:text-purple-400" />
                                                    <span>Jumlah Results</span>
                                                </div>
                                                <div className="mt-1.5 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                                    {
                                                        computed.display_results_count
                                                    }
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    <Calculator className="size-3 text-purple-600 dark:text-purple-400" />
                                                    <span>
                                                        CPR Target (30%)
                                                    </span>
                                                </div>
                                                <div className="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">
                                                    {formatRupiah(
                                                        computed.cpr_target,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Business Logic Explanation Section */}
                    <section className="mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
                                Matematika & Logika Bisnis yang Transparan
                            </h2>
                            <p className="mt-2 text-sm text-neutral-600 sm:text-base dark:text-neutral-400">
                                Setiap angka yang dihasilkan didasarkan pada
                                standar industri akuisisi produk digital.
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Card 1 */}
                            <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                    <Target className="size-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Benchmark CPR Target 30%
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
                                    Formula mengevaluasi apakah Cost Per Result
                                    Anda di bawah 30% harga produk. Batasan ini
                                    menjaga struktur margin operasi tetap sehat
                                    dan aman dari fluktuasi biaya platform
                                    iklan.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                    <Calculator className="size-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Hasil Konversi Riil
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
                                    Jumlah konversi dihitung langsung dari
                                    pembagian anggaran bulanan dengan CPR tanpa
                                    asumsi tersembunyi. Nilai pesanan rata-rata
                                    (AOV) dikalikan untuk menghasilkan proyeksi
                                    turnover akurat.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                    <TrendingUp className="size-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Net ROI, Bukan Sekadar ROAS
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
                                    ROAS hanya memperlihatkan omzet kotor,
                                    sementara ROI memperhitungkan laba bersih
                                    setelah memotong seluruh biaya modal iklan.
                                    Kalkulator ini memprioritaskan profit aktual
                                    Anda.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features checklist section */}
                    <section className="mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-6 sm:p-10 dark:border-purple-900/50 dark:bg-purple-950/20">
                            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
                                        Dirancang Khusus untuk Media Buyer &
                                        Pemilik Bisnis Digital
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300">
                                        Tidak perlu lagi membuat spreadsheet
                                        rumit untuk setiap pengujian kampanye
                                        baru. AdForecast Pro menyediakan alat
                                        prediksi instan dengan kemampuan simpan
                                        riwayat.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={
                                                auth?.user
                                                    ? dashboardUrl
                                                    : register()
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500"
                                        >
                                            <span>Mulai Sekarang</span>
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-3.5">
                                    <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900">
                                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                Simpan & Bandingkan Skenario
                                            </h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Simpan hasil prediksi ke dalam
                                                database akun Anda untuk
                                                referensi perbandingan di masa
                                                mendatang.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900">
                                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                Rekomendasi Strategis Otomatis
                                            </h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Analisis cerdas berdasarkan
                                                perbandingan CPR terhadap batas
                                                aman 30% dan status ROI
                                                positif/negatif.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-2xs dark:bg-neutral-900">
                                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                Kolaborasi Tim Terintegrasi
                                            </h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Dukungan multi-tim bawaan untuk
                                                berbagi riwayat kalkulasi antar
                                                rekan pengiklan.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-200/80 bg-white py-8 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                        <div className="flex items-center gap-2">
                            <div className="flex size-6 items-center justify-center rounded-md bg-purple-700 text-white dark:bg-purple-600">
                                <AppLogoIcon className="size-3.5" />
                            </div>
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                AdForecast Pro
                            </span>
                            <span className="text-xs text-neutral-400">
                                — Kalkulator ROI Kampanye Iklan Digital
                            </span>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                            {auth?.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="hover:text-purple-600"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hover:text-purple-600"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="hover:text-purple-600"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                            <span>
                                © {new Date().getFullYear()} AdForecast Pro
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
