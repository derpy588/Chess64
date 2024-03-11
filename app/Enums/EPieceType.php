<?php

namespace App\Enums;

enum EPieceType:int {
    case empty      = -1; // empty space
    case pawn       = 0x1;
    case knight     = 0x2;
    case bishop     = 0x4;
    case rook       = 0x8;
    case queen      = 0x10;
    case king       = 0x20;

    public static function getArrayValues(): array
    {
        return array_column(EPieceType::cases(), 'value');
    }
}