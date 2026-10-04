<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guest can register via auth api', function () {
    $response = $this->postJson(route('api.auth.register'), [
        'name' => 'Ad Strategist',
        'email' => 'strategist@example.com',
        'password' => 'SecurePass123!',
        'password_confirmation' => 'SecurePass123!',
    ]);

    $response->assertCreated()
        ->assertJson([
            'status' => 'success',
            'user' => [
                'name' => 'Ad Strategist',
                'email' => 'strategist@example.com',
            ],
        ]);

    $this->assertAuthenticated();

    $user = User::where('email', 'strategist@example.com')->first();
    expect($user)->not->toBeNull()
        ->and(Hash::check('SecurePass123!', $user->password))->toBeTrue();
});

test('registration rejects duplicate email', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->postJson(route('api.auth.register'), [
        'name' => 'Another User',
        'email' => 'existing@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('user can log in via auth api with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'login@example.com',
        'password' => Hash::make('Secret123!'),
    ]);

    $response = $this->postJson(route('api.auth.login'), [
        'email' => 'login@example.com',
        'password' => 'Secret123!',
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'email' => 'login@example.com',
            ],
        ]);

    $this->assertAuthenticatedAs($user);
});

test('login fails with invalid credentials', function () {
    User::factory()->create([
        'email' => 'login@example.com',
        'password' => Hash::make('Secret123!'),
    ]);

    $response = $this->postJson(route('api.auth.login'), [
        'email' => 'login@example.com',
        'password' => 'WrongPassword!',
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'status' => 'error',
        ]);

    $this->assertGuest();
});

test('authenticated user can fetch me endpoint and logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson(route('api.auth.me'))
        ->assertOk()
        ->assertJson([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
            ],
        ]);

    $this->actingAs($user)
        ->postJson(route('api.auth.logout'))
        ->assertOk();

    $this->assertGuest();
});
