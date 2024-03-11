<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ChessController;


Route::prefix('game')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::get('/get/{id}', [ChessController::class, 'getGame']);
        Route::get('/current', [ChessController::class,'getCurrentGame']);
        Route::get('/find-match', [ChessController::class, 'findMatch']);
    });
});