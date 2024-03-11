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
    }

    public function getCurrentGame(): Game {
        $current_game = $this->games()->where('end_reason', '=', null)->first();
        if ($current_game == null) {
            return null;
        } else {
            return $current_game;
        }
    }
}
