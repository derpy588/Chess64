<?php

namespace App\Enums;

enum Teams:int {
    case White = 0x40;
    case Black = 0x80;

    public static function getArrayValues(): array
    {
        return array_column(Teams::cases(), 'value');
    }
}