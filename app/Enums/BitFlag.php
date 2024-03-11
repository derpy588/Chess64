<?php

namespace App\Enums;

enum BitFlag:int {


    case Normal         = 1;
    case Capture        = 2;
    case Double_Pawn    = 4;
    case Ep_Capture     = 8;
    case Promotion      = 16;
    case KSide_Castle   = 32;
    case QSide_Castle   = 64;


    public static function getArrayValues(): array
    {
        return array_column(BitFlag::cases(), 'value');
    }
}