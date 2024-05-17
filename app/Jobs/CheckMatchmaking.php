<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Matchmake;
use App\Models\Game;
use App\Events\UserMatched;
use Illuminate\Support\Facades\Log;
use App\Utils\DefaultBoard;
use App\Enums\Teams;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class CheckMatchmaking implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('default');
    }

    /**
     * Handles the matchmaking process.
     *
     * This method is responsible for matching players based on their ELO score and creating a new game for them.
     * It loops through the waiting queue and finds the first player, then searches for a second player with a similar ELO score.
     * Once a match is found, a new game is created and the players are removed from the matchmaking queue.
     * The process continues until the maximum number of matches is reached or there are no more players in the waiting queue.
     *
     * @return void
     */
    public function handle(): void
    {
        //Log::info("checking");
        
        $MaxMatches = config('matchmaking.MaxMatches');
        $MatchingDepth = config('matchmaking.MatchingDepth');

        // Get the number of players in the waiting queue
        $waiting = Matchmake::count();

        // Check if more than 1 player
        if ($waiting <= 1) {
            return;
        }

        $matchesMade = 0;
        $depth = 0;

        $usersWaiting = Matchmake::orderBy('created_at', 'asc')->take($MatchingDepth)->get();

        foreach ($usersWaiting as $userToMatch) {
            //Log::info("matching");
            
            if ($matchesMade >= $MaxMatches) return;
            if ($depth >= $MatchingDepth) return;
            if ($waiting <= 1) return;
            
            $user = User::find($userToMatch->user_id);

            // Make sure nothing happened to player
            if ($user == null) {
                continue;
            }

            // Make sure the user is not playing a game
            if ($user->isPlayingGame() == true) {
                Matchmake::where('user_id', $userToMatch->user_id)->delete();
                continue;
            }

            $elo = $user->elo;

            $userMatch = User::join('matchmaking', 'users.id', '=', 'matchmaking.user_id')
                ->whereBetween('users.elo', [$elo - 100, $elo + 100])
                ->where('users.id', '!=', $user->id)
                ->orderBy('matchmaking.created_at', 'asc')
                ->first();

            if ($userMatch == null) {
                continue;
            }

            $game = Game::create(['white_team' => $user->id, 'black_team' => $userMatch->id]);
            // Send UserMatched event
            UserMatched::dispatch($user, $userMatch);

            // Remove players from Matchmaking Queue
            Matchmake::whereIn('user_id', [$user->id, $userMatch->id])->delete();

            // Increment the number of matches made and depth
            $matchesMade++;
            $depth++;

            // Get the number of players in the waiting queue
            $waiting = Matchmake::count();
        }

        
    }
}
