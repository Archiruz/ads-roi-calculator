<?php

use App\Models\Calculation;
use App\Models\User;

test('unauthenticated users cannot access calculation api', function () {
    $this->getJson(route('api.calculations.index'))
        ->assertUnauthorized();

    $this->postJson(route('api.calculations.store'), [
        'product_price' => 500000,
        'monthly_ad_spend' => 5000000,
        'cpr' => 100000,
        'average_order_value' => 500000,
    ])->assertUnauthorized();
});

test('authenticated user can store and compute calculation', function () {
    $user = User::factory()->create();

    $payload = [
        'title' => 'Kampanye Meta Q4',
        'product_price' => 500000,
        'monthly_ad_spend' => 5000000,
        'cpr' => 100000,
        'average_order_value' => 500000,
        'notes' => 'Testing profitable scale',
    ];

    $response = $this->actingAs($user)
        ->postJson(route('api.calculations.store'), $payload);

    $response->assertCreated()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'user_id' => $user->id,
                'title' => 'Kampanye Meta Q4',
                'product_price' => '500000.00',
                'monthly_ad_spend' => '5000000.00',
                'cpr' => '100000.00',
                'average_order_value' => '500000.00',
                'results_count' => '50.0000',
                'revenue' => '25000000.00',
                'profit' => '20000000.00',
                'roi_percentage' => '400.00',
            ],
            'computed' => [
                'roi_status' => 'Kampanye Menguntungkan',
            ],
        ]);

    $this->assertDatabaseHas('calculations', [
        'user_id' => $user->id,
        'title' => 'Kampanye Meta Q4',
        'roi_percentage' => 400.00,
    ]);
});

test('calculation store rejects invalid input ranges', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('api.calculations.store'), [
            'product_price' => -100,
            'monthly_ad_spend' => -500,
            'cpr' => 0, // CPR must be at least 1
            'average_order_value' => -50,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['product_price', 'monthly_ad_spend', 'cpr', 'average_order_value']);
});

test('authenticated user can only list their own calculations and not others (data isolation)', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $calcA1 = Calculation::factory()->create(['user_id' => $userA->id, 'title' => 'Calculation A1']);
    $calcA2 = Calculation::factory()->create(['user_id' => $userA->id, 'title' => 'Calculation A2']);
    $calcB1 = Calculation::factory()->create(['user_id' => $userB->id, 'title' => 'Calculation B1']);

    // User A fetches their calculations
    $responseA = $this->actingAs($userA)
        ->getJson(route('api.calculations.index'));

    $responseA->assertOk();
    $dataA = $responseA->json('data');
    expect(count($dataA))->toBe(2);
    $idsA = collect($dataA)->pluck('id');
    expect($idsA)->toContain($calcA1->id)
        ->and($idsA)->toContain($calcA2->id)
        ->and($idsA)->not->toContain($calcB1->id);

    // User B fetches their calculations
    $responseB = $this->actingAs($userB)
        ->getJson(route('api.calculations.index'));

    $responseB->assertOk();
    $dataB = $responseB->json('data');
    expect(count($dataB))->toBe(1);
    expect($dataB[0]['id'])->toBe($calcB1->id);
});

test('user cannot view or delete another users calculation', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $calcB = Calculation::factory()->create(['user_id' => $userB->id]);

    // User A attempts to view calculation owned by User B
    $this->actingAs($userA)
        ->getJson(route('api.calculations.show', $calcB))
        ->assertNotFound();

    // User A attempts to delete calculation owned by User B
    $this->actingAs($userA)
        ->deleteJson(route('api.calculations.destroy', $calcB))
        ->assertNotFound();

    // Calculation is still present
    $this->assertDatabaseHas('calculations', ['id' => $calcB->id]);

    // User B can successfully delete it
    $this->actingAs($userB)
        ->deleteJson(route('api.calculations.destroy', $calcB))
        ->assertOk();

    $this->assertDatabaseMissing('calculations', ['id' => $calcB->id]);
});

test('malicious payload cannot override user_id', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $response = $this->actingAs($userA)
        ->postJson(route('api.calculations.store'), [
            'user_id' => $userB->id, // Malicious override attempt
            'product_price' => 500000,
            'monthly_ad_spend' => 5000000,
            'cpr' => 100000,
            'average_order_value' => 500000,
        ]);

    $response->assertCreated();
    expect($response->json('data.user_id'))->toBe($userA->id);
    expect($response->json('data.user_id'))->not->toBe($userB->id);
});
