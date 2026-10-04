<?php

namespace App\Http\Controllers;

use App\Models\Calculation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalculationHistoryController extends Controller
{
    /**
     * Display calculation history isolated strictly to the authenticated user.
     */
    public function index(Request $request): Response
    {
        $calculations = $request->user()
            ->calculations()
            ->latest('id')
            ->paginate(15);

        return Inertia::render('history', [
            'calculations' => $calculations,
        ]);
    }

    /**
     * Delete a calculation owned by the authenticated user.
     */
    public function destroy(Request $request, Calculation $calculation): RedirectResponse
    {
        if ($calculation->user_id !== $request->user()->id) {
            abort(404);
        }

        $calculation->delete();

        return back()->with('success', 'Riwayat perhitungan berhasil dihapus.');
    }
}
