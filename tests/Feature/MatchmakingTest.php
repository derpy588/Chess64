<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Matchmake;
use App\Jobs\CheckMatchmaking;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;

class MatchmakingTest extends TestCase
{

    use RefreshDatabase;

    /**
     * Just adds 2 users to matching and makes sure nothing happend
     * they have same elo score
     * 
     * @return void
     */
    public function test_matching_two_users(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Add user1 to matching
        $this->actingAs($user1)->get('/game/find-match');

        // Add user2 to matching
        $this->actingAs($user2)->get('/game/find-match');

        $this->assertDatabaseHas('matchmaking', [
            'user_id' => $user1->id,
        ]);

        $this->assertDatabaseHas('matchmaking', [
            'user_id' => $user2->id,
        ]);

        $job = CheckMatchmaking::dispatchSync();


        $this->assertDatabaseMissing('matchmaking', [
            'user_id' => $user1->id,
        ]);

        $this->assertDatabaseMissing('matchmaking', [
            'user_id' => $user2->id,
        ]);

        $this->assertDatabaseHas('games', [
            'white_team' => $user1->id,
            'black_team' => $user2->id,
        ]);
    }

    public function test_matchmaking_queued(): void {
        Queue::fake([CheckMatchmaking::class]);

        CheckMatchmaking::dispatch();

        Queue::assertPushedOn('default', CheckMatchmaking::class);
        Queue::assertPushed(CheckMatchmaking::class, 1);
    }

    /**
     * If same user tries going to /game/find-match twice in a row
     * 
     * 
     * @return void
     */
    public function test_user_try_to_join_twice(): void
    {
        $user1 = User::factory()->create();

        // Add user1 to matching
        $this->actingAs($user1)->get('/game/find-match');

        // Then try to add user1 to matching again
        $this->actingAs($user1)->get('/game/find-match');

        $this->assertDatabaseCount('matchmaking', 1);

    }

    /**
     * check if user with a + or - 100 score of first user matches together
     * 
     * @return void
     */
    public function test_matching_elo_limit(): void
    {

        $user1 = User::factory()->elo(400)->create();
        $user2 = User::factory()->elo(500)->create();
        $user3 = User::factory()->elo(400)->create();
        $user4 = User::factory()->elo(300)->create();



        // Add user1 to matching
        $this->actingAs($user1)->get('/game/find-match');

        // Add user2 to matching
        $this->actingAs($user2)->get('game/find-match');


        $this->assertDatabaseHas('matchmaking', [
            'user_id' => $user1->id,
        ]);

        $this->assertDatabaseHas('matchmaking', [
            'user_id' => $user2->id,
        ]);

        $job = CheckMatchmaking::dispatchSync();


        $this->assertDatabaseMissing('matchmaking', [
            'user_id' => $user1->id,
        ]);

        $this->assertDatabaseMissing('matchmaking', [
            'user_id' => $user2->id,
        ]);

        $this->assertDatabaseHas('games', [
            'white_team' => $user1->id,
            'black_team' => $user2->id,
        ]);


        // User 3 & 4

        // Add user3 to matching
        $this->actingAs($user3)->get('/game/find-match');

        // Add user4 to matching
        $this->actingAs($user4)->get('game/find-match');


        $this->assertDatabaseHas('matchmaking', [
            'user_id' => $user3->id,
        ]);

        $this->assertDatabaseHas('matchmaking', [
            'user_id' => $user4->id,
        ]);

        $job = CheckMatchmaking::dispatchSync();


        $this->assertDatabaseMissing('matchmaking', [
            'user_id' => $user3->id,
        ]);

        $this->assertDatabaseMissing('matchmaking', [
            'user_id' => $user4->id,
        ]);

        $this->assertDatabaseHas('games', [
            'white_team' => $user3->id,
            'black_team' => $user4->id,
        ]);

        
    }

    public function test_first_user_has_no_matching(): void
    {
        $user1 = User::factory()->elo(400)->create();
        $user2 = User::factory()->elo(750)->create();
        $user3 = User::factory()->elo(1020)->create();
        $user4 = User::factory()->elo(810)->create();
        $user5 = User::factory()->elo(1100)->create();
        $user6 = User::factory()->elo(2000)->create();
        $user7 = User::factory()->elo(1950)->create();
        $user8 = User::factory()->elo(501)->create();

        // Add users to matchmaking
        $this->actingAs($user1)->get('/game/find-match');
        $this->actingAs($user2)->get('/game/find-match');
        $this->actingAs($user3)->get('/game/find-match');
        $this->actingAs($user4)->get('/game/find-match');
        $this->actingAs($user5)->get('/game/find-match');
        $this->actingAs($user6)->get('/game/find-match');
        $this->actingAs($user7)->get('/game/find-match');
        $this->actingAs($user8)->get('/game/find-match');

        $job = CheckMatchmaking::dispatchSync();

        // Check if 2 users are in the matchmaking queue
        $this->assertDatabaseCount('matchmaking', 2);

        // Check if 3 games have been created
        $this->assertDatabaseCount('games', 3);
    }

    public function test_stress_test(): void
    {
        $users = User::factory(1000)->create();

        foreach ($users as $user) {
            $this->actingAs($user)->get('/game/find-match');
        }

        $waiting = Matchmake::count();

        $startTime = microtime(true);

        while ($waiting > 0) {
            $job = CheckMatchmaking::dispatchSync();
            $waiting = Matchmake::count();
        }

        $endTime = microtime(true);

        $duration = $endTime - $startTime;

        Log::info('Stress test finished in '. $duration.' seconds');

        $this->assertTrue(true);
    }
}
