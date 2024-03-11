<?php

namespace App\Enums;

enum Flag:string {


    case Normal         = "n";
    case Capture        = "c";
    case Double_Pawn    = "b";
    case Ep_Capture     = "e";
    case Promotion      = "p";
    case KSide_Castle   = "k";
    case QSide_Castle   = "q";


    public static function getArrayValues(): array
    {
        return array_column(Flag::cases(), 'value');
    }
}