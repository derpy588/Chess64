<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\Teams;
use App\Enums\EPieceType;
use App\Enums\Flag;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('moves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game')->on('games');
            $table->foreignId('user')->on('users');
            $table->enum('team', Teams::getArrayValues());
            $table->integer('from');
            $table->integer('to');
            $table->enum('piece', EPieceType::getArrayValues());
            $table->enum('captured', EPieceType::getArrayValues())->nullable();
            $table->enum('promotion', EPieceType::getArrayValues())->nullable();
            $table->integer('bit_flags');
            $table->set('flags', Flag::getArrayValues());
            $table->integer('white_king');
            $table->integer('black_king');
            $table->integer('white_castling');
            $table->integer('black_castling');
            $table->integer('ep_square');
            $table->integer('half_move_clock');
            $table->integer('move_number');
            $table->string('san');
            $table->string('before_fen');
            $table->string('after_fen');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moves');
    }
};
