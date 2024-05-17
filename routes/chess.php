<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ChessController;


Route::prefix('game')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::get('/get/{id}', [ChessController::class, 'getGame']);
        Route::get('/current', [ChessController::class,'getCurrentGame']);
        Route::get('/find-match', [ChessController::class, 'findMatch']);
        Route::get('/state', [ChessController::class, 'getState']);
        Route::get('/move/{san}', [ChessController::class, 'playerMove']);

        Route::get('/v2', [ChessController::class, 'showV2']);
        Route::get('/v2/state', [ChessController::class, 'getStateV2']);
        Route::get('/v2/get-board', [ChessController::class, 'getBoardV2']);
        Route::get('/v2/game', [ChessController::class, 'getCurrentGameV2']);
    });
});