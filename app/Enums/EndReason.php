<?php

namespace App\Enums;

enum EndReason:string {
    case White_Win_By_Checkmate = "white_win_by_checkmate";
    case White_Win_By_Resignation = "white_win_by_resignation";
    case Black_Win_By_Checkmate = "black_win_by_checkmate";
    case Black_Win_By_Resignation = "black_win_by_resignation";
    case Draw_By_Stalemate = "draw_by_stalemate";
    case Draw_By_Agreement = "draw_by_agreement";
    case Draw_By_Repetition = "draw_by_repetition";

    public static function getArrayValues(): array
    {
        return array_column(EndReason::cases(), 'value');
    }
}