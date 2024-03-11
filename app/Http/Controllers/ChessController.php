<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Game;
use App\Models\Matchmake;
use App\Jobs\CheckMatchmaking;
use Illuminate\Support\Facades\Log;

class ChessController extends Controller
{
    public function show(Request $request): Response {
        $user = auth()->user();
        if ($user->isPlayingGame() == true){
            return Inertia::render('Dashboard');
        }
        return Inertia::render('Dashboard');

    }

    public function getCurrentGame(Request $request) {
        $user = auth()->user();
        if ($user->isPlayingGame() == true) {
            return $user->getCurrentGame();
        }
        return ['response' => 404];
    }

    public function getGame(Request $request): array {
        $user = auth()->user();
        $gameId = $request->route('id');
        
        // get game based on id
        $game = $user->games()->find($gameId);

        return $game;
    }

    public function findMatch(Request $request): array {
        $user = auth()->user();

        // Check if user is in game
        if ($user->isPlayingGame() == true) {
            return ['response' => 'Already in game'];
        }


        $queue = Matchmake::firstOrCreate([
            'user_id' => $user->id
        ]);


        return [ "value" => $queue ];
    }

    public function getBoard(Request $request): array {
        $user = auth()->user();
        $gameId = $request->route('id');
        
        // get game based on id
        $game = $user->games()->find($gameId);


        return $game->board;
    }

    public function getHistory(Request $request) {
        $user = auth()->user();
        $gameId = $request->route('id');

        // get game based on id
        $game = $user->games()->find($gameId);

        return $game->get_history();
    }
}
