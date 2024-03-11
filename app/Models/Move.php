<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use App\Enums\Teams;
use App\Enums\BitFlag;
use App\Enums\Flag;
use App\Enums\EPieceType;

class Move extends Model
{
    use HasFactory;

    protected $attributes = [
        'bit_flags' => BitFlag::Normal,
        'flags' => [Flag::Normal]
    ];

    protected $casts = [
        'team' => Teams::class,
        'piece' => EPieceType::class,
        'captured' => EPieceType::class,
        'promotion' => EPieceType::class
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class, 'game');
    }

    public function teamUser(): HasOneThrough
    {
        return match($this->team) {
            Teams::White => $this->hasOneThrough(
                User::class, 
                Game::class,
                'id',
                'id',
                'game',
                'white_team'
            ),
            Teams::Black => $this->hasOneThrough(
                User::class, 
                Game::class,
                'id',
                'id',
                'game',
                'black_team'
            )
        };
    }
}
