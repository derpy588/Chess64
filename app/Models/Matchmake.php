<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matchmake extends Model
{
    use HasFactory;


    protected $table = "matchmaking";
    protected $primaryKey = "user_id";
    public $incrementing = false;

    protected $fillable = [
        'user_id'
    ];
}
