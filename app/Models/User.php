<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function games()
    {
        return $this->hasMany(Game::class, 'white_team')->get()->merge($this->hasMany(Game::class, 'black_team')->get());
    }

    public function sendPasswordResetNotification($token): void
    {
        $url = url("/reset-password/{$token}?email={$this->email}");
    
        $this->notify(new ResetPassword($url));
    }

    public function isPlayingGame(): bool {
        $current_game = $this->games()->where('end_reason', '=', null)->first();
        if ($current_game == null) {
            return false;
        } else {
            return true;
        }
        return false;
    }

    public function isMatchmaking(): bool {
        if ($this->isPlayingGame()) {
            return false;
        }

        $queue = Matchmake::where('user_id', '=', $this->id)->first();
        if ($queue != null) {
            return true;
        }
        return false;
    }

    public function getCurrentGame(): Game {
        $current_game = $this->games()->where('end_reason', '=', null)->first();
        if ($current_game == null) {
            return null;
        } else {
            return $current_game;
        }
    }

    public function getOpponent(): User {
        $current_game = $this->getCurrentGame();
        if ($current_game == null) {
            return null;
        } else {
            if ($current_game->white_team == $this->id) {
                return User::findOrFail($current_game->black_team);
            } else {
                return User::findOrFail($current_game->white_team);
            }
        }
    }

    public function getState() {
        if ($this->isPlayingGame()) {
            return "playing";
        } else if ($this->isMatchmaking()) {
            return "finding";
        } else {
            return "none";
        }
    }

    public function getBoardOrientation() {
        $current_game = $this->getCurrentGame();
        if ($current_game == null) {
            return null;
        } else {
            if ($current_game->white_team == $this->id) {
                return "white";
            } else {
                return "black";
            }
        }
    }
}
