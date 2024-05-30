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
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Events\OpponentMoved;
use Chess\Play\SanPlay;
use App\Enums\Teams;
use App\Enums\EndReason;

class ChessController extends Controller
{
    public function show(Request $request): Response {
        $user = auth()->user();
        if ($user->isPlayingGame() == true){
            return Inertia::render('Dashboard');
        }
        return Inertia::render('Dashboard', [
            'isMatchmaking' => Auth::user()->isMatchmaking(),
            'isPlayingGame' => Auth::user()->isPlayingGame(),
        ]);

    }

    public function showV2(Request $request): Response {
        $user = auth()->user();

        $isMatchmaking = $user->isMatchmaking();
        $isPlaying = $user->isPlayingGame();

        $state = ($isMatchmaking) ? "finding" : (($isPlaying) ? "playing" : "none");

        if ($state == "playing") {
            $game = $user->getCurrentGame();
            $opponent = $user->getOpponent();

            return Inertia::render('GameV2', [
                "currentGame" => [
                    "current_team" => ($game->current_team == Teams::White ? "white" : "black"), 
                    "opponent" => ["username" => $opponent->username, "elo" => $opponent->elo], 
                    "board" => ["pgn" => $game->pgn, "fen" => $game->current_fen],
                    "state" => $user->getState(),
                    "board_orientation" => $user->getBoardOrientation(),
                    ]
                ]);
        }

        return Inertia::render('GameV2', ["currentGame" => ["state" => $user->getState()]]);
    }

    public function getCurrentGame(Request $request) {
        $user = auth()->user();
        if ($user->isPlayingGame() == true) {
            return $user->getCurrentGame();
        }
        return ['response' => 404];
    }

    public function getCurrentGameV2(Request $request) {
        $user = auth()->user();

        if ($user->isPlayingGame() == true) {
            $game = $user->getCurrentGame();
            $opponent = $user->getOpponent();


            return response()->json([
                "current_team" => ($game->current_team == Teams::White ? "white" : "black"), 
                "opponent" => ["username" => $opponent->username, "elo" => $opponent->elo], 
                "board" => ["pgn" => $game->pgn, "fen" => $game->current_fen],
                "state" => $user->getState(),
                "board_orientation" => $user->getBoardOrientation(),
            ]);
        }

        return response()->json(["success" => false]);
    }

    public function getGame(Request $request): array {
        $user = auth()->user();
        $gameId = $request->route('id');
        
        // get game based on id
        $game = $user->games()->find($gameId);

        return reponse()->json($game);
    }

    public function findMatch(Request $request) {
        $user = auth()->user();

        // Check if user is in game
        if ($user->isPlayingGame() == true) {
            return response()->json(['success' => false, "message" => "Already In Game"]);
        }


        $queue = Matchmake::firstOrCreate([
            'user_id' => $user->id
        ]);

        
        return response()->json(['success' => true, 'message' => $queue]);
    }

    public function getBoard(Request $request): array {
        $user = auth()->user();
        $gameId = $request->route('id');
        
        // get game based on id
        $game = $user->games()->find($gameId);


        return $game->fen;
    }

    public function getBoardV2(Request $request) {
        $user = auth()->user();
        $gameId = $request->route('id');
        
        // get game based on id
        $game = $user->getCurrentGame();

        return response()->json(["pgn" => $game->pgn, "fen" => $game->current_fen]);
    }

    public function getHistory(Request $request) {
        $user = auth()->user();
        $gameId = $request->route('id');

        // get game based on id
        $game = $user->getCurrentGame();

        return $game->get_history();
    }

    public function getState(Request $request) {
        $user = auth()->user();
        $isMatchmaking = $user->isMatchmaking();
        $isPlaying = $user->isPlayingGame();

        return response()->json(["isMatchmaking" => $isMatchmaking, "isPlayingGame" => $isPlaying]);

    }

    public function getStateV2(Request $request) {
        $user = auth()->user();

        $isMatchmaking = $user->isMatchmaking();
        $isPlaying = $user->isPlayingGame();

        $state = ($isMatchmaking) ? "finding" : (($isPlaying) ? "playing" : "none");
        
        return response()->json(["state" => $state]);
    }

    public function playerMove(Request $request) {
        $user = auth()->user();
        $isPlaying = $user->isPlayingGame();
        if ($isPlaying == false)  return response()->json(["message" => "not playing game"]);

        // Check if it is there turn or not
        

        $game = $user->getCurrentGame();

        $tm = $game->getWhiteTeam->id == $user->id ? Teams::White : Teams::Black;

        if ($game->current_team != $tm) return response()->json(["message" => "wrong turn"]);

        // need to do more stuff here and also add move
        $board = (new SanPlay($game->pgn))->validate()->getBoard();

        if ($game->getWhiteTeam->id == $user->id)
        {
            $strMove = $request->san;
            $board->play('w', $strMove);

            //Log::info($board->getMoveText());

            

            if ($board->getMoveText() == $game->pgn) return response()->json(["message" => "Invalid move"]);

            

            $game->current_team = Teams::Black->value;
            OpponentMoved::dispatch($game->getBlackTeam, $board->toFen());
        } else {
            $strMove = $request->san;
            $board->play('b', $strMove);

            //Log::info($board->getMoveText());

            

            if ($board->getMoveText() == $game->pgn) return response()->json(["message" => "Invalid move"]);

            

            $game->current_team = Teams::White->value;
            OpponentMoved::dispatch($game->getWhiteTeam, $board->toFen());
        }

        $game->current_fen = $board->toFen();
        $game->pgn = $board->getMoveText();

        // Check if game ended
        
        $ended = $board->isMate() || $board->isStalemate() || $board->isFivefoldRepetition() || $board->isFiftyMoveDraw() || $board->isDeadPositionDraw();
        if ($ended == false) { }
        else {$game->ended_at = now();}

        if ($board->isMate()) {
            $winner = $tm->value;
            $end = $winner == Teams::White->value ? EndReason::White_Win_By_Checkmate : EndReason::Black_Win_By_Checkmate;

            $game->end_reason = $end->value;
            //$game->winner = $tm;
            
        } elseif ($board->isStalemate()) {
            $game->end_reason = EndReason::Draw_By_Stalemate->value;
        } elseif ($board->isFivefoldRepetition()) {
            $game->end_reason = EndReason::Draw_By_Repetition->value;
        } elseif ($board->isFiftyMoveDraw()) {
            $game->end_reason = EndReason::Draw_By_Repetition->value;
        } elseif ($board->isDeadPositionDraw()) {
            $game->end_reason = EndReason::Draw_By_Stalemate->value;
        }
        
        $game->save();
    }
}
