<?php

use App\Http\Controllers\CalculationHistoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('history', [CalculationHistoryController::class, 'index'])->name('calculations.history');
        Route::delete('calculations/{calculation}', [CalculationHistoryController::class, 'destroy'])->name('calculations.destroy');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $team = $request->user()->currentTeam ?? $request->user()->personalTeam();

        return redirect()->route('dashboard', ['current_team' => $team->slug]);
    });
    Route::get('history', function (Request $request) {
        $team = $request->user()->currentTeam ?? $request->user()->personalTeam();

        return redirect()->route('calculations.history', ['current_team' => $team->slug]);
    });
    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
