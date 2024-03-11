<?php

namespace App\Enums;

use App\Enums\EPieceType;

enum EPieceCode:int {

    // white pieces
    case wpawn      =    EPieceType::pawn->value + Teams::White->value;
    case wknight    =    EPieceType::knight->value + Teams::White->value;
    case wbishop    =    EPieceType::bishop->value + Teams::White->value;
    case wrook      =    EPieceType::rook->value + Teams::White->value;
    case wqueen     =    EPieceType::queen->value + Teams::White->value;
    case wking      =    EPieceType::king->value + Teams::White->value;

    // black pieces
    case bpawn      =    EPieceType::pawn->value + Teams::Black->value;
    case bknight    =    EPieceType::knight->value + Teams::Black->value;
    case bbishop    =    EPieceType::bishop->value + Teams::Black->value;
    case brook      =    EPieceType::rook->value + Teams::Black->value;
    case bqueen     =    EPieceType::queen->value + Teams::Black->value;
    case bking      =    EPieceType::king->value + Teams::Black->value;

    public static function getArrayValues(): array
    {
        return array_column(EPieceCode::cases(), 'value');
    }
}