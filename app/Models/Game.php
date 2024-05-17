<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Enums\EndReason;
use App\Enums\Teams;
use App\Utils\DefaultBoard;
use App\Enums\EPieceType;
use App\Models\Move;
use App\Enums\BitFlag;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Chess\Variant\Classical\Board;

class Game extends Model
{
    use HasFactory;

    /** 
    *   Default Values:
    *   Values will be based on default chess game
    *
    * @var array
    */
    protected $attributes = [
        'winner' => null,
        'end_reason' => null,
        'init_fen' => DefaultBoard::Default_Fen,
        'current_fen' => DefaultBoard::Default_Fen,
        'pgn' => "",
    ];

    protected $fillable = ['white_team', 'black_team'];

    /**
     * Conversion of columns
     * 
     * @var array
     */
    protected $casts = [
        'winner' => Teams::class,
        'end_reason' => EndReason::class,
        'current_team' => Teams::class,
    ];

    public function getWhiteTeam(): BelongsTo
    {
        return $this->belongsTo(User::class, "white_team");
    }

    public function getBlackTeam(): BelongsTo
    {
        return $this->belongsTo(User::class, "black_team");
    }

    public function get_history(): HasMany {
        return $this->hasMany(Move::class);
    }
}
