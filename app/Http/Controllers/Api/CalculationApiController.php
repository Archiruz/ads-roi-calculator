<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCalculationRequest;
use App\Models\Calculation;
use App\Services\CalculationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CalculationApiController extends Controller
{
    public function __construct(
        protected CalculationService $calculationService
    ) {}

    /**
     * Display a listing of calculations belonging to the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(50, max(1, (int) $request->query('per_page', 15)));

        $calculations = $request->user()
            ->calculations()
            ->latest('id')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $calculations->items(),
            'meta' => [
                'current_page' => $calculations->currentPage(),
                'last_page' => $calculations->lastPage(),
                'per_page' => $calculations->perPage(),
                'total' => $calculations->total(),
            ],
        ]);
    }

    /**
     * Store a newly created calculation associated with the authenticated user.
     */
    public function store(StoreCalculationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $computed = $this->calculationService->calculate($validated);

        // Security requirement: user_id is ALWAYS assigned from the authenticated user
        /** @var Calculation $calculation */
        $calculation = $request->user()->calculations()->create([
            'title' => $validated['title'] ?? 'Perhitungan Kampanye '.now()->format('d M Y H:i'),
            'product_price' => $computed['product_price'],
            'monthly_ad_spend' => $computed['monthly_ad_spend'],
            'cpr' => $computed['cpr'],
            'average_order_value' => $computed['average_order_value'],
            'results_count' => $computed['results_count'],
            'revenue' => $computed['revenue'],
            'profit' => $computed['profit'],
            'roi_percentage' => $computed['roi_percentage'],
            'cpr_target' => $computed['cpr_target'],
            'margin_per_result' => $computed['margin_per_result'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Perhitungan berhasil disimpan.',
            'data' => $calculation,
            'computed' => $computed,
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified calculation if owned by the user.
     */
    public function show(Request $request, Calculation $calculation): JsonResponse
    {
        if ($calculation->user_id !== $request->user()->id) {
            abort(Response::HTTP_NOT_FOUND, 'Perhitungan tidak ditemukan.');
        }

        return response()->json([
            'status' => 'success',
            'data' => $calculation,
        ]);
    }

    /**
     * Remove the specified calculation from storage.
     */
    public function destroy(Request $request, Calculation $calculation): JsonResponse
    {
        if ($calculation->user_id !== $request->user()->id) {
            abort(Response::HTTP_NOT_FOUND, 'Perhitungan tidak ditemukan.');
        }

        $calculation->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Perhitungan berhasil dihapus.',
        ]);
    }
}
