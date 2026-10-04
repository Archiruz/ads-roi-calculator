<?php

namespace App\Http\Controllers;

use App\Models\TeamInvitation;
use App\Services\CalculationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected CalculationService $calculationService
    ) {}

    public function __invoke(Request $request): Response
    {
        $email = strtolower($request->user()->email);

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        $defaultInputs = [
            'product_price' => 500000,
            'monthly_ad_spend' => 5000000,
            'cpr' => 100000,
            'average_order_value' => 500000,
        ];

        $initialComputed = $this->calculationService->calculate($defaultInputs);

        $recentCalculations = $request->user()
            ->calculations()
            ->latest('id')
            ->take(10)
            ->get();

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'defaultInputs' => $defaultInputs,
            'initialComputed' => $initialComputed,
            'recentCalculations' => $recentCalculations,
        ]);
    }
}
