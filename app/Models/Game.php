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
        'current_team' => Teams::White,
        'init_fen' => DefaultBoard::Default_Fen,
        'white_king' => 4,
        'black_king' => 116,
        'ep_square' => EPieceType::empty,
        'half_move_clock' => 0,
        'move_number' => 1,
        'white_castling' => BitFlag::KSide_Castle->value | BitFlag::QSide_Castle->value,
        'black_castling' => BitFlag::KSide_Castle->value | BitFlag::QSide_Castle->value,
    ];

    protected $fillable = ['white_team', 'black_team', 'board'];

    /**
     * Conversion of columns
     * 
     * @var array
     */
    protected $casts = [
        'winner' => Teams::class,
        'end_reason' => EndReason::class,
        'current_team' => Teams::class,
        'board' => asArrayObject::class,
    ];

    public function white_team(): BelongsTo
    {
        return $this->belongsTo(User::class, "white_team");
    }

    public function black_team(): BelongsTo
    {
        return $this->belongsTo(User::class, "black_team");
    }

    public function get_history(): HasMany {
        return $this->hasMany(Move::class);
    }
}
