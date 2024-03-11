<?php

namespace App\Utils;

use App\Enums\Teams;
use App\Enums\EPieceCode;

class DefaultBoard {



    public const Default_Fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    public static function Default_Board(): array {
        return [EPieceCode::wrook->value, EPieceCode::wknight->value, EPieceCode::wbishop->value, EPieceCode::wqueen->value, EPieceCode::wking->value, EPieceCode::wbishop->value, EPieceCode::wknight->value, EPieceCode::wrook->value,
        null, null, null, null, null, null, null, null,
        EPieceCode::wpawn->value, EPieceCode::wpawn->value, EPieceCode::wpawn->value, EPieceCode::wpawn->value, EPieceCode::wpawn->value, EPieceCode::wpawn->value, EPieceCode::wpawn->value, EPieceCode::wpawn->value,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        EPieceCode::bpawn->value, EPieceCode::bpawn->value, EPieceCode::bpawn->value, EPieceCode::bpawn->value, EPieceCode::bpawn->value, EPieceCode::bpawn->value, EPieceCode::bpawn->value, EPieceCode::bpawn->value,
        null, null, null, null, null, null, null, null,
        EPieceCode::brook->value, EPieceCode::bknight->value, EPieceCode::bbishop->value, EPieceCode::bqueen->value, EPieceCode::bking->value, EPieceCode::bbishop->value, EPieceCode::bknight->value, EPieceCode::brook->value,
        null, null, null, null, null, null, null, null];
    }

    public static function Default_Json(): string {
        return json_encode(Default_Board());
    }

}

